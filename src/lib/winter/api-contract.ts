import type { Locale } from "@/content/portfolio";

export const winterQuestionMaxLength = 500;
export const winterRequestBodyMaxBytes = 4096;

export type WinterApiRequest = {
  locale: Locale;
  question: string;
};

export type WinterApiErrorCode =
  | "ACCESS_DENIED"
  | "AI_MODEL_UNAVAILABLE"
  | "AI_NOT_CONFIGURED"
  | "AI_QUOTA_EXCEEDED"
  | "AI_SERVICE_UNAVAILABLE"
  | "AI_REQUEST_FAILED"
  | "EMPTY_QUESTION"
  | "INTERNAL_ERROR"
  | "INVALID_BODY"
  | "INVALID_LOCALE"
  | "INVALID_QUESTION"
  | "MALFORMED_JSON"
  | "ORIGIN_NOT_ALLOWED"
  | "QUESTION_TOO_LONG"
  | "REQUEST_TOO_LARGE"
  | "SECURITY_CHECK_UNAVAILABLE"
  | "UNSUPPORTED_MEDIA_TYPE";

export type WinterApiErrorResponse = {
  error: {
    code: WinterApiErrorCode;
    message: string;
  };
};
