import type { LiveApiEvidence, Locale } from "@/content/portfolio";

import { ApiLivePreview } from "./api-live-preview";

type BackendLiveApiSurfaceProps = {
  className?: string;
  evidence: LiveApiEvidence;
  liveBaseUrl: string;
  locale: Locale;
};

type LocalizedLiveApiOperation = {
  actionLabel?: string;
  description: string;
  id: string;
  input?: {
    label: string;
    placeholder: string;
  };
  idleState: {
    text: string;
    title: string;
  };
  label: string;
  method: "GET";
  number: string;
  path: string;
};

function buildEndpointUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, "")}${path.replace(/:id$/, "")}`;
}

export function BackendLiveApiSurface({
  className = "",
  evidence,
  liveBaseUrl,
  locale,
}: BackendLiveApiSurfaceProps) {
  const operations = evidence.operations.map((operation) => ({
    actionLabel: operation.actionLabel?.[locale],
    description: operation.description[locale],
    id: operation.id,
    input: operation.input
      ? {
          label: operation.input.label[locale],
          placeholder: operation.input.placeholder[locale],
        }
      : undefined,
    idleState: {
      text: operation.idleState.text[locale],
      title: operation.idleState.title[locale],
    },
    label: operation.label[locale],
    method: operation.method,
    number: operation.number,
    path: operation.path,
  })) satisfies readonly LocalizedLiveApiOperation[];

  return (
    <div
      className={`relative isolate overflow-hidden bg-black/[0.88] px-3 py-5 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/[0.08] before:content-[''] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/[0.045] after:content-[''] sm:px-4 ${className}`}
    >
      <ApiLivePreview
        categoriesLabel={evidence.categoriesLabel[locale]}
        defaultOperationId={evidence.defaultOperationId}
        emptyInputLabel={evidence.emptyInputLabel[locale]}
        errorLabel={evidence.errorLabel[locale]}
        jsonSummaryLabel={evidence.jsonSummaryLabel[locale]}
        label={evidence.label[locale]}
        liveResponseLabel={evidence.liveResponseLabel[locale]}
        loadingLabel={evidence.loadingLabel[locale]}
        numberLocale={locale}
        operationBaseUrl={buildEndpointUrl(liveBaseUrl, "")}
        operations={operations}
        priceLabel={evidence.priceLabel[locale]}
        resultPluralLabel={evidence.resultPluralLabel[locale]}
        resultSingularLabel={evidence.resultSingularLabel[locale]}
        searchEmptyText={evidence.searchEmptyText[locale]}
        searchEmptyTitle={evidence.searchEmptyTitle[locale]}
        suggestionLabel={evidence.suggestionLabel[locale]}
      />
    </div>
  );
}
