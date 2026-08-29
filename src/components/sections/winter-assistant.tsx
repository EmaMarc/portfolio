"use client";

import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/content/portfolio";
import {
  type WinterApiErrorCode,
  type WinterApiErrorResponse,
  winterQuestionMaxLength,
  type WinterApiRequest,
} from "@/lib/winter/api-contract";
import styles from "./winter-assistant.module.css";

type WinterAssistantLabels = {
  clearInput: string;
  emptyState: string;
  errorMessage: string;
  inputLabel: string;
  loadingMessage: string;
  placeholder: string;
  quotaErrorMessage: string;
  rateLimitErrorMessage: string;
  sendQuestion: string;
  serviceUnavailableErrorMessage: string;
  suggestionsLabel: string;
  winterLabel: string;
};

type WinterAssistantProps = {
  labels: WinterAssistantLabels;
  locale: Locale;
  suggestedQuestions: readonly string[];
};

type WinterRequestStatus =
  | "error"
  | "idle"
  | "loading"
  | "streaming"
  | "success";

type WinterClientErrorCode = WinterApiErrorCode | "LOCAL_RATE_LIMITED";

function SendIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isWinterErrorResponse(
  value: unknown,
): value is WinterApiErrorResponse {
  return (
    isRecord(value) &&
    isRecord(value.error) &&
    typeof value.error.code === "string"
  );
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function getWinterErrorMessage(
  errorCode: WinterClientErrorCode | undefined,
  labels: WinterAssistantLabels,
) {
  if (errorCode === "AI_QUOTA_EXCEEDED") {
    return labels.quotaErrorMessage;
  }

  if (errorCode === "AI_SERVICE_UNAVAILABLE") {
    return labels.serviceUnavailableErrorMessage;
  }

  if (errorCode === "LOCAL_RATE_LIMITED") {
    return labels.rateLimitErrorMessage;
  }

  return labels.errorMessage;
}

function getThinkingMessageBase(message: string) {
  const base = message.trimEnd().replace(/\.+$/, "");

  return base || message;
}

export function WinterAssistant({
  labels,
  locale,
  suggestedQuestions,
}: WinterAssistantProps) {
  const inputId = useId();
  const activeRequestRef = useRef<AbortController | null>(null);
  const activeQuestionRef = useRef("");
  const requestSequenceRef = useRef(0);
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [requestStatus, setRequestStatus] =
    useState<WinterRequestStatus>("idle");
  const [requestErrorCode, setRequestErrorCode] =
    useState<WinterClientErrorCode>();
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const trimmedQuestion = question.trim();
  const hasAnswer = answer.length > 0;
  const thinkingMessageBase = getThinkingMessageBase(labels.loadingMessage);
  const isRequestActive =
    requestStatus === "loading" || requestStatus === "streaming";

  useEffect(() => {
    return () => {
      activeRequestRef.current?.abort();
    };
  }, []);

  function isCurrentRequest(controller: AbortController, requestId: number) {
    return (
      activeRequestRef.current === controller &&
      requestSequenceRef.current === requestId &&
      !controller.signal.aborted
    );
  }

  async function readWinterErrorCode(response: Response) {
    const responseBody: unknown = await response.json().catch(() => null);

    return isWinterErrorResponse(responseBody)
      ? responseBody.error.code
      : undefined;
  }

  async function readWinterTextStream({
    controller,
    requestId,
    response,
  }: {
    controller: AbortController;
    requestId: number;
    response: Response;
  }) {
    if (!response.body) {
      throw new Error("Winter response body is not readable.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let hasReceivedText = false;
    let nextAnswer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (!isCurrentRequest(controller, requestId)) {
          return;
        }

        if (done) {
          const trailingText = decoder.decode();

          if (trailingText) {
            nextAnswer += trailingText;
            setAnswer(nextAnswer);
          }

          if (!nextAnswer) {
            throw new Error("Winter stream completed without text.");
          }

          setRequestStatus("success");
          return;
        }

        const text = decoder.decode(value, { stream: true });

        if (!text) {
          continue;
        }

        nextAnswer += text;
        setAnswer(nextAnswer);

        if (!hasReceivedText) {
          hasReceivedText = true;
          setRequestStatus("streaming");
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async function submitQuestion(value: string) {
    const nextQuestion = value.trim();

    if (!nextQuestion) {
      return;
    }

    if (activeRequestRef.current) {
      if (activeQuestionRef.current === nextQuestion) {
        return;
      }

      activeRequestRef.current.abort();
      activeRequestRef.current = null;
    }

    const requestId = requestSequenceRef.current + 1;

    requestSequenceRef.current = requestId;
    activeQuestionRef.current = nextQuestion;

    const requestBody = {
      locale,
      question: nextQuestion,
    } satisfies WinterApiRequest;
    const controller = new AbortController();
    activeRequestRef.current = controller;

    setAnswer("");
    setQuestion(nextQuestion);
    setRequestErrorCode(undefined);
    setRequestStatus("loading");
    setSubmittedQuestion(nextQuestion);

    try {
      const response = await fetch("/api/winter", {
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      });

      if (controller.signal.aborted) {
        return;
      }

      if (!response.ok) {
        const errorCode = await readWinterErrorCode(response);
        const clientErrorCode =
          errorCode ??
          (response.status === 429 ? "LOCAL_RATE_LIMITED" : undefined);

        if (!isCurrentRequest(controller, requestId)) {
          return;
        }

        setRequestErrorCode(clientErrorCode);
        setRequestStatus("error");
        return;
      }

      await readWinterTextStream({
        controller,
        requestId,
        response,
      });

      if (!isCurrentRequest(controller, requestId)) {
        return;
      }

      setRequestErrorCode(undefined);
    } catch (error) {
      if (!isAbortError(error) && isCurrentRequest(controller, requestId)) {
        setRequestErrorCode(undefined);
        setRequestStatus("error");
      }
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        activeQuestionRef.current = "";
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitQuestion(question);
  }

  function handleClear() {
    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
    setAnswer("");
    setQuestion("");
    setRequestErrorCode(undefined);
    setRequestStatus("idle");
    setSubmittedQuestion("");
    activeQuestionRef.current = "";
  }

  return (
    <div
      className="relative isolate min-w-0 border-l border-white/[0.07] bg-zinc-950/[0.78] px-4 py-5 sm:px-5 sm:py-6 lg:px-7"
      data-reveal=""
      data-reveal-delay="short"
      data-reveal-target="winter-assistant"
    >
      <form onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor={inputId}>
          {labels.inputLabel}
        </label>
        <div className="flex min-h-14 items-center gap-2 border-b border-white/[0.16] pb-3 transition-colors focus-within:border-white/45 motion-reduce:transition-none">
          <input
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-3 text-base text-zinc-50 outline-none placeholder:text-zinc-600 sm:text-lg"
            id={inputId}
            maxLength={winterQuestionMaxLength}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={labels.placeholder}
            type="text"
            value={question}
          />
          {question ? (
            <button
              aria-label={labels.clearInput}
              className="grid size-9 shrink-0 place-items-center text-lg leading-none text-zinc-600 transition-colors hover:text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 motion-reduce:transition-none"
              onClick={handleClear}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          ) : null}
          <button
            aria-label={labels.sendQuestion}
            className="grid size-10 shrink-0 place-items-center text-zinc-400 transition-colors hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-700 motion-reduce:transition-none"
            disabled={
              isRequestActive ||
              !trimmedQuestion ||
              trimmedQuestion.length > winterQuestionMaxLength
            }
            type="submit"
          >
            <SendIcon />
          </button>
        </div>
      </form>

      <div className="mt-8">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
          {labels.suggestionsLabel}
        </p>
        <div className="mt-3 grid gap-y-1">
          {suggestedQuestions.map((suggestedQuestion) => (
            <button
              className="group flex min-h-10 items-center justify-between gap-4 py-1.5 text-left text-sm leading-6 text-zinc-400 transition-colors hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-700 motion-reduce:transition-none"
              disabled={isRequestActive}
              key={suggestedQuestion}
              onClick={() => void submitQuestion(suggestedQuestion)}
              type="button"
            >
              <span>{suggestedQuestion}</span>
              <span
                aria-hidden="true"
                className="shrink-0 text-zinc-700 transition-colors group-hover:text-[rgba(220,38,38,0.82)] group-focus-visible:text-[rgba(220,38,38,0.82)] motion-reduce:transition-none"
              >
                →
              </span>
            </button>
          ))}
        </div>
      </div>

      <div aria-busy={isRequestActive} className="mt-8">
        {submittedQuestion ? (
          <div className="space-y-4">
            <p className="max-w-xl text-sm leading-7 text-zinc-500">
              {submittedQuestion}
            </p>
            <div className="space-y-2">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                {labels.winterLabel}
              </p>
              <div className="max-w-xl text-sm leading-7 text-zinc-300">
                {requestStatus === "loading" && !hasAnswer ? (
                  <p
                    aria-label={labels.loadingMessage}
                    aria-live="polite"
                    className={styles.thinkingMessage}
                    role="status"
                  >
                    <span aria-hidden="true">{thinkingMessageBase}</span>
                    <span aria-hidden="true">
                      <span
                        className={`${styles.thinkingDot} ${styles.thinkingDotOne}`}
                      >
                        .
                      </span>
                      <span
                        className={`${styles.thinkingDot} ${styles.thinkingDotTwo}`}
                      >
                        .
                      </span>
                      <span
                        className={`${styles.thinkingDot} ${styles.thinkingDotThree}`}
                      >
                        .
                      </span>
                    </span>
                  </p>
                ) : null}
                {hasAnswer ? (
                  <p className={styles.answerEnter}>{answer}</p>
                ) : null}
                {requestStatus === "error" ? (
                  <p
                    aria-live="polite"
                    className={hasAnswer ? "mt-3 text-zinc-400" : undefined}
                  >
                    {getWinterErrorMessage(requestErrorCode, labels)}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <p className="max-w-xl text-sm leading-7 text-zinc-500">
            {labels.emptyState}
          </p>
        )}
      </div>
    </div>
  );
}
