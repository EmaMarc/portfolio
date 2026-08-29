import { google } from "@ai-sdk/google";
import { checkBotId } from "botid/server";
import {
  APICallError,
  StreamProviderError,
  createTextStreamResponse,
  streamText,
  type TextStreamPart,
  type ToolSet,
} from "ai";
import type { Locale } from "@/content/portfolio";
import { isSupportedLocale } from "@/lib/locale";
import {
  winterQuestionMaxLength,
  winterRequestBodyMaxBytes,
  type WinterApiErrorCode,
  type WinterApiErrorResponse,
} from "@/lib/winter/api-contract";
import { serializeWinterKnowledge } from "@/lib/winter/context";
import { serializeWinterIdentity } from "@/lib/winter/identity";
import { buildWinterKnowledge } from "@/lib/winter/knowledge";
import { buildWinterInstructions } from "@/lib/winter/prompt";

const winterAiModel = "gemini-3.1-flash-lite";
const winterGenerationTimeoutMs = 20000;
const winterServiceUnavailableRetryDelayMs = 1000;
const winterMaxProviderAttempts = 2;
const winterMaxOutputTokens = 140;

type WinterStreamStart =
  | {
      kind: "ready";
      stream: ReadableStream<string>;
    }
  | {
      error: unknown;
      kind: "error";
    };

type WinterJsonBodyResult =
  | {
      body: unknown;
      kind: "ready";
    }
  | {
      kind: "malformed";
    }
  | {
      kind: "too-large";
    };

const errorMessages = {
  es: {
    ACCESS_DENIED: "Solicitud denegada.",
    AI_MODEL_UNAVAILABLE:
      "Winter no pudo acceder al modelo configurado en este momento.",
    AI_NOT_CONFIGURED:
      "Winter AI todavía no está configurado en este entorno.",
    AI_QUOTA_EXCEEDED:
      "Winter alcanzó temporalmente su límite de consultas. Probá nuevamente más tarde.",
    AI_SERVICE_UNAVAILABLE:
      "Winter está temporalmente indisponible porque el servicio de Gemini no respondió. Probá nuevamente en unos segundos.",
    AI_REQUEST_FAILED: "Winter no pudo responder en este momento.",
    EMPTY_QUESTION: "La pregunta no puede estar vacía.",
    INTERNAL_ERROR: "Winter no pudo responder en este momento.",
    INVALID_BODY: "El cuerpo de la solicitud no tiene un formato válido.",
    INVALID_LOCALE: "El locale debe ser es o en.",
    INVALID_QUESTION: "La pregunta debe ser un texto válido.",
    MALFORMED_JSON: "El cuerpo de la solicitud debe ser JSON válido.",
    ORIGIN_NOT_ALLOWED: "Winter no pudo procesar la solicitud.",
    QUESTION_TOO_LONG: `La pregunta no puede superar ${winterQuestionMaxLength} caracteres.`,
    REQUEST_TOO_LARGE: "La solicitud es demasiado grande para procesarse.",
    SECURITY_CHECK_UNAVAILABLE:
      "Winter no pudo responder en este momento. Intentá nuevamente.",
    UNSUPPORTED_MEDIA_TYPE:
      "Winter no pudo procesar el formato de la solicitud.",
  },
  en: {
    ACCESS_DENIED: "Request denied.",
    AI_MODEL_UNAVAILABLE:
      "Winter could not access the configured model right now.",
    AI_NOT_CONFIGURED: "Winter AI is not configured in this environment yet.",
    AI_QUOTA_EXCEEDED:
      "Winter has temporarily reached its request limit. Please try again later.",
    AI_SERVICE_UNAVAILABLE:
      "Winter is temporarily unavailable because the Gemini service didn't respond. Please try again in a few seconds.",
    AI_REQUEST_FAILED: "Winter could not respond right now.",
    EMPTY_QUESTION: "The question cannot be empty.",
    INTERNAL_ERROR: "Winter could not respond right now.",
    INVALID_BODY: "The request body has an invalid shape.",
    INVALID_LOCALE: "The locale must be es or en.",
    INVALID_QUESTION: "The question must be a valid string.",
    MALFORMED_JSON: "The request body must be valid JSON.",
    ORIGIN_NOT_ALLOWED: "Winter could not process the request.",
    QUESTION_TOO_LONG: `The question cannot exceed ${winterQuestionMaxLength} characters.`,
    REQUEST_TOO_LARGE: "The request is too large to process.",
    SECURITY_CHECK_UNAVAILABLE:
      "Winter could not respond right now. Please try again.",
    UNSUPPORTED_MEDIA_TYPE: "Winter could not process the request format.",
  },
} satisfies Record<Locale, Record<WinterApiErrorCode, string>>;

function getWinterResponseHeaders() {
  return {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
}

function jsonError(
  code: WinterApiErrorCode,
  status: number,
  locale: Locale = "en",
) {
  return Response.json(
    {
      error: {
        code,
        message: errorMessages[locale][code],
      },
    } satisfies WinterApiErrorResponse,
    {
      headers: getWinterResponseHeaders(),
      status,
    },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasGoogleApiKey() {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim());
}

function logWinterSecurityCheckError(error: unknown) {
  const name = error instanceof Error ? error.name : "UnknownError";

  console.error("Winter security check failed", {
    name,
    securityCheck: "botid",
  });
}

async function verifyWinterBotAccess() {
  try {
    const verification = await checkBotId({
      advancedOptions: {
        checkLevel: "basic",
      },
    });

    if (verification.isBot) {
      return jsonError("ACCESS_DENIED", 403);
    }

    return undefined;
  } catch (error) {
    logWinterSecurityCheckError(error);

    return jsonError("SECURITY_CHECK_UNAVAILABLE", 503);
  }
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("Origin");

  if (!origin) {
    return false;
  }

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function hasJsonContentType(request: Request) {
  const contentType = request.headers.get("Content-Type");

  if (!contentType) {
    return false;
  }

  const mediaType = contentType.split(";")[0]?.trim().toLowerCase();

  return mediaType === "application/json";
}

function getContentLength(request: Request) {
  const contentLength = request.headers.get("Content-Length");

  if (!contentLength) {
    return undefined;
  }

  const parsedContentLength = Number(contentLength.trim());

  return Number.isSafeInteger(parsedContentLength) && parsedContentLength >= 0
    ? parsedContentLength
    : undefined;
}

function hasTooLargeContentLength(request: Request) {
  const contentLength = getContentLength(request);

  return (
    contentLength !== undefined && contentLength > winterRequestBodyMaxBytes
  );
}

function releaseWinterBodyReader(
  reader: ReadableStreamDefaultReader<Uint8Array>,
) {
  try {
    reader.releaseLock();
  } catch {
    // The lock can already be released after cancellation or stream errors.
  }
}

async function cancelWinterBodyReader(
  reader: ReadableStreamDefaultReader<Uint8Array>,
) {
  try {
    await reader.cancel();
  } catch {
    // The body may already be closed or aborted.
  }
}

async function readWinterJsonBody(
  request: Request,
): Promise<WinterJsonBodyResult> {
  if (!request.body) {
    return { kind: "malformed" };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      totalBytes += value.byteLength;

      if (totalBytes > winterRequestBodyMaxBytes) {
        await cancelWinterBodyReader(reader);

        return { kind: "too-large" };
      }

      chunks.push(value);
    }
  } finally {
    releaseWinterBodyReader(reader);
  }

  if (totalBytes === 0) {
    return { kind: "malformed" };
  }

  const bodyBytes = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const bodyText = new TextDecoder("utf-8", { fatal: true }).decode(
      bodyBytes,
    );

    return {
      body: JSON.parse(bodyText) as unknown,
      kind: "ready",
    };
  } catch {
    return { kind: "malformed" };
  }
}

function getErrorStatus(error: unknown) {
  if (APICallError.isInstance(error)) {
    return error.statusCode;
  }

  if (StreamProviderError.isInstance(error)) {
    return error.statusCode;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }

  return undefined;
}

function getErrorData(error: unknown) {
  if (APICallError.isInstance(error)) {
    return error.data;
  }

  if (StreamProviderError.isInstance(error)) {
    return error.data;
  }

  return undefined;
}

function getProviderError(error: unknown) {
  const errorData = getErrorData(error);

  if (!isRecord(errorData)) {
    return undefined;
  }

  const providerError = errorData.error;

  return isRecord(providerError) ? providerError : undefined;
}

function getProviderErrorCode(error: unknown) {
  if (
    StreamProviderError.isInstance(error) &&
    typeof error.code === "number"
  ) {
    return error.code;
  }

  const providerError = getProviderError(error);

  return typeof providerError?.code === "number"
    ? providerError.code
    : undefined;
}

function normalizeProviderStatus(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  return value.trim().toUpperCase().replaceAll("-", "_");
}

function getProviderErrorStatus(error: unknown) {
  if (StreamProviderError.isInstance(error)) {
    return (
      normalizeProviderStatus(error.type) ?? normalizeProviderStatus(error.code)
    );
  }

  const providerError = getProviderError(error);

  return normalizeProviderStatus(providerError?.status);
}

function getErrorText(error: unknown) {
  const parts: string[] = [];

  if (error instanceof Error) {
    parts.push(error.name, error.message);
  }

  if (APICallError.isInstance(error)) {
    if (typeof error.responseBody === "string") {
      parts.push(error.responseBody);
    }

    if (error.data !== undefined) {
      try {
        parts.push(JSON.stringify(error.data));
      } catch {
        // Ignore non-serializable provider data. Classification still uses status.
      }
    }
  }

  if (StreamProviderError.isInstance(error)) {
    parts.push(error.type ?? "", String(error.code ?? ""), error.message);

    if (error.data !== undefined) {
      try {
        parts.push(JSON.stringify(error.data));
      } catch {
        // Ignore non-serializable provider data. Classification still uses status.
      }
    }
  }

  return parts.join(" ").toLowerCase();
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function getAbortError() {
  return new DOMException("The operation was aborted.", "AbortError");
}

function isWinterServiceUnavailableError(error: unknown) {
  const statusCode = getErrorStatus(error);
  const providerCode = getProviderErrorCode(error);
  const providerStatus = getProviderErrorStatus(error);
  const errorText = getErrorText(error);

  return (
    statusCode === 503 ||
    providerCode === 503 ||
    providerStatus === "SERVICE_UNAVAILABLE" ||
    providerStatus === "UNAVAILABLE" ||
    errorText.includes("service_unavailable") ||
    errorText.includes("service unavailable") ||
    errorText.includes('"status":"unavailable"') ||
    errorText.includes('"status": "unavailable"') ||
    errorText.includes('"code":"unavailable"') ||
    errorText.includes('"code": "unavailable"')
  );
}

function waitForWinterRetryDelay(abortSignal?: AbortSignal) {
  if (abortSignal?.aborted) {
    return Promise.reject(getAbortError());
  }

  return new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      abortSignal?.removeEventListener("abort", handleAbort);
      resolve();
    }, winterServiceUnavailableRetryDelayMs);

    function handleAbort() {
      clearTimeout(timeoutId);
      abortSignal?.removeEventListener("abort", handleAbort);
      reject(getAbortError());
    }

    abortSignal?.addEventListener("abort", handleAbort, { once: true });

    if (abortSignal?.aborted) {
      handleAbort();
    }
  });
}

function logWinterAiError(error: unknown, attempt?: number) {
  const statusCode = getErrorStatus(error) ?? getProviderErrorCode(error);
  const name = error instanceof Error ? error.name : "UnknownError";
  const context =
    attempt === undefined ? { name, statusCode } : { attempt, name, statusCode };

  console.error("Winter AI request failed", context);
}

function releaseWinterStreamReader<Tools extends ToolSet>(
  reader: ReadableStreamDefaultReader<TextStreamPart<Tools>>,
) {
  try {
    reader.releaseLock();
  } catch {
    // The lock can already be released after cancellation or stream errors.
  }
}

async function cancelWinterStreamReader<Tools extends ToolSet>(
  reader: ReadableStreamDefaultReader<TextStreamPart<Tools>>,
) {
  try {
    await reader.cancel();
  } catch {
    // The stream may already be closed or errored.
  } finally {
    releaseWinterStreamReader(reader);
  }
}

function createWinterTextDeltaStream<Tools extends ToolSet>({
  attempt,
  firstText,
  reader,
}: {
  attempt: number;
  firstText: string;
  reader: ReadableStreamDefaultReader<TextStreamPart<Tools>>;
}) {
  let isReaderReleased = false;

  function releaseReader() {
    if (isReaderReleased) {
      return;
    }

    isReaderReleased = true;
    releaseWinterStreamReader(reader);
  }

  return new ReadableStream<string>({
    start(controller) {
      controller.enqueue(firstText);
    },
    async pull(controller) {
      try {
        while (true) {
          const { done, value: part } = await reader.read();

          if (done) {
            releaseReader();
            controller.close();
            return;
          }

          if (part.type === "text-delta" && part.text.length > 0) {
            controller.enqueue(part.text);
            return;
          }

          if (part.type === "error") {
            logWinterAiError(part.error, attempt);
            releaseReader();
            controller.error(new Error("Winter AI stream failed."));
            return;
          }

          if (part.type === "abort") {
            releaseReader();
            controller.close();
            return;
          }
        }
      } catch (error) {
        releaseReader();

        if (isAbortError(error)) {
          controller.close();
          return;
        }

        logWinterAiError(error, attempt);
        controller.error(new Error("Winter AI stream failed."));
      }
    },
    async cancel() {
      if (isReaderReleased) {
        return;
      }

      isReaderReleased = true;
      await cancelWinterStreamReader(reader);
    },
  });
}

async function readWinterStreamStart<Tools extends ToolSet>(
  stream: ReadableStream<TextStreamPart<Tools>>,
  attempt: number,
): Promise<WinterStreamStart> {
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value: part } = await reader.read();

      if (done) {
        releaseWinterStreamReader(reader);

        return {
          error: new Error("Winter AI stream ended without text."),
          kind: "error",
        };
      }

      if (part.type === "text-delta" && part.text.length > 0) {
        return {
          kind: "ready",
          stream: createWinterTextDeltaStream({
            attempt,
            firstText: part.text,
            reader,
          }),
        };
      }

      if (part.type === "error") {
        await cancelWinterStreamReader(reader);

        return {
          error: part.error,
          kind: "error",
        };
      }

      if (part.type === "abort") {
        releaseWinterStreamReader(reader);

        return {
          error: getAbortError(),
          kind: "error",
        };
      }
    }
  } catch (error) {
    releaseWinterStreamReader(reader);

    return {
      error,
      kind: "error",
    };
  }
}

function startWinterAiStream({
  abortSignal,
  instructions,
  prompt,
}: {
  abortSignal?: AbortSignal;
  instructions: string;
  prompt: string;
}) {
  return streamText({
    abortSignal,
    instructions,
    maxOutputTokens: winterMaxOutputTokens,
    maxRetries: 0,
    model: google(winterAiModel),
    onError: () => undefined,
    prompt,
    temperature: 0.2,
    timeout: { totalMs: winterGenerationTimeoutMs },
  });
}

async function createWinterStreamingResponse({
  abortSignal,
  instructions,
  prompt,
}: {
  abortSignal?: AbortSignal;
  instructions: string;
  prompt: string;
}) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= winterMaxProviderAttempts; attempt += 1) {
    try {
      const result = startWinterAiStream({
        abortSignal,
        instructions,
        prompt,
      });

      const streamStart = await readWinterStreamStart(result.stream, attempt);

      if (streamStart.kind === "ready") {
        return createTextStreamResponse({
          headers: getWinterResponseHeaders(),
          stream: streamStart.stream,
        });
      }

      lastError = streamStart.error;
    } catch (error) {
      lastError = error;
    }

    if (isAbortError(lastError)) {
      throw lastError;
    }

    logWinterAiError(lastError, attempt);

    if (attempt === 1 && isWinterServiceUnavailableError(lastError)) {
      await waitForWinterRetryDelay(abortSignal);
      continue;
    }

    throw lastError;
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Winter AI request exhausted provider attempts.");
}

function toWinterAiErrorResponse(error: unknown, locale: Locale) {
  const statusCode = getErrorStatus(error);
  const providerCode = getProviderErrorCode(error);
  const errorText = getErrorText(error);

  if (
    statusCode === 429 ||
    providerCode === 429 ||
    errorText.includes("resource_exhausted") ||
    errorText.includes("quota") ||
    errorText.includes("rate limit") ||
    errorText.includes("too many requests")
  ) {
    return jsonError("AI_QUOTA_EXCEEDED", 429, locale);
  }

  if (isWinterServiceUnavailableError(error)) {
    return jsonError("AI_SERVICE_UNAVAILABLE", 503, locale);
  }

  if (
    statusCode === 401 ||
    statusCode === 403 ||
    errorText.includes("api key") ||
    errorText.includes("authentication") ||
    errorText.includes("unauthorized") ||
    errorText.includes("forbidden")
  ) {
    return jsonError("AI_NOT_CONFIGURED", 503, locale);
  }

  if (
    statusCode === 404 ||
    (errorText.includes("model") &&
      (errorText.includes("not found") ||
        errorText.includes("unavailable") ||
        errorText.includes("not supported")))
  ) {
    return jsonError("AI_MODEL_UNAVAILABLE", 503, locale);
  }

  return jsonError("AI_REQUEST_FAILED", 502, locale);
}

export async function POST(request: Request) {
  try {
    const botAccessResponse = await verifyWinterBotAccess();

    if (botAccessResponse) {
      return botAccessResponse;
    }

    if (!isAllowedOrigin(request)) {
      return jsonError("ORIGIN_NOT_ALLOWED", 403);
    }

    if (!hasJsonContentType(request)) {
      return jsonError("UNSUPPORTED_MEDIA_TYPE", 415);
    }

    if (hasTooLargeContentLength(request)) {
      return jsonError("REQUEST_TOO_LARGE", 413);
    }

    const bodyResult = await readWinterJsonBody(request);

    if (bodyResult.kind === "too-large") {
      return jsonError("REQUEST_TOO_LARGE", 413);
    }

    if (bodyResult.kind === "malformed") {
      return jsonError("MALFORMED_JSON", 400);
    }

    const { body } = bodyResult;

    if (!isRecord(body)) {
      return jsonError("INVALID_BODY", 400);
    }

    const { locale, question } = body;

    if (typeof locale !== "string" || !isSupportedLocale(locale)) {
      return jsonError("INVALID_LOCALE", 400);
    }

    if (typeof question !== "string") {
      return jsonError("INVALID_QUESTION", 400, locale);
    }

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      return jsonError("EMPTY_QUESTION", 400, locale);
    }

    if (trimmedQuestion.length > winterQuestionMaxLength) {
      return jsonError("QUESTION_TOO_LONG", 413, locale);
    }

    if (!hasGoogleApiKey()) {
      return jsonError("AI_NOT_CONFIGURED", 503, locale);
    }

    const knowledge = buildWinterKnowledge(locale);
    const context = serializeWinterKnowledge(knowledge);
    const winterIdentityContext = serializeWinterIdentity(locale);
    const instructions = buildWinterInstructions({
      context,
      locale,
      winterIdentityContext,
    });

    try {
      return await createWinterStreamingResponse({
        abortSignal: request.signal,
        instructions,
        prompt: trimmedQuestion,
      });
    } catch (error) {
      return toWinterAiErrorResponse(error, locale);
    }
  } catch (error) {
    if (!isAbortError(error)) {
      logWinterAiError(error);
    }

    return jsonError("INTERNAL_ERROR", 500);
  }
}
