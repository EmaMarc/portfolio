"use client";

import { useState, type FormEvent } from "react";

type LiveApiOperation = {
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

type ApiRequestState =
  | { notice?: string; operationId?: string; status: "idle" }
  | { endpointPath: string; operationId: string; status: "loading" }
  | {
      endpointPath: string;
      operationId: string;
      query: string;
      status: "empty";
    }
  | {
      endpointPath: string;
      httpStatus: number;
      json: unknown;
      operationId: string;
      sample: string;
      status: "success";
    }
  | {
      endpointPath: string;
      httpStatus?: number;
      operationId: string;
      status: "error";
    };

type ProductSummary = {
  categories?: string;
  id?: string;
  name?: string;
  price?: string;
};

type ApiLivePreviewProps = {
  categoriesLabel: string;
  defaultOperationId: string;
  emptyInputLabel: string;
  errorLabel: string;
  jsonSummaryLabel: string;
  label: string;
  liveResponseLabel: string;
  loadingLabel: string;
  numberLocale: string;
  operationBaseUrl: string;
  operations: readonly LiveApiOperation[];
  priceLabel: string;
  resultPluralLabel: string;
  resultSingularLabel: string;
  searchEmptyText: string;
  searchEmptyTitle: string;
  suggestionLabel: string;
};

const statusOperationId = "status";
const listOperationId = "list";
const searchOperationId = "search";
const maxArrayItems = 3;
const maxObjectEntries = 6;
const maxStringLength = 180;
const maxDepth = 3;
const maxSuggestions = 2;

function limitJson(value: unknown, depth = 0): unknown {
  if (typeof value === "string") {
    return value.length > maxStringLength
      ? `${value.slice(0, maxStringLength - 1)}…`
      : value;
  }

  if (
    value === null ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, maxArrayItems)
      .map((item) => limitJson(item, depth + 1));
  }

  if (typeof value === "object") {
    if (depth >= maxDepth) {
      return "[Object]";
    }

    const entries = Object.entries(value as Record<string, unknown>);
    const limitedEntries = entries
      .slice(0, maxObjectEntries)
      .map(([key, entryValue]) => [key, limitJson(entryValue, depth + 1)]);
    return Object.fromEntries(limitedEntries);
  }

  return String(value);
}

function parseResponse(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function formatResponseSample(json: unknown) {
  return typeof json === "string"
    ? json.length > maxStringLength
      ? `${json.slice(0, maxStringLength - 1)}…`
      : json
    : JSON.stringify(limitJson(json), null, 2);
}

function getTextValue(value: unknown) {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : undefined;
}

function formatCategories(value: unknown) {
  if (Array.isArray(value)) {
    const categories = value
      .map((category) => getTextValue(category))
      .filter((category): category is string => Boolean(category));

    return categories.length > 0 ? categories.join(" · ") : undefined;
  }

  return getTextValue(value);
}

function formatPrice(value: unknown, locale: string) {
  return typeof value === "number"
    ? new Intl.NumberFormat(locale, {
        maximumFractionDigits: 2,
      }).format(value)
    : getTextValue(value);
}

function getProductSummary(value: unknown, locale: string): ProductSummary {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const product = value as Record<string, unknown>;

  return {
    categories: formatCategories(product.categories),
    id: getTextValue(product.id),
    name: getTextValue(product.name),
    price: formatPrice(product.price, locale),
  };
}

function getProducts(json: unknown, locale: string) {
  if (!Array.isArray(json)) {
    return [];
  }

  return json
    .slice(0, maxArrayItems)
    .map((item) => getProductSummary(item, locale));
}

function getSuggestions(json: unknown, locale: string) {
  if (!Array.isArray(json)) {
    return [];
  }

  return Array.from(
    new Set(
      json
        .map((item) => getProductSummary(item, locale).name)
        .filter((name): name is string => Boolean(name)),
    ),
  ).slice(0, maxSuggestions);
}

function getProductTitle(product: ProductSummary) {
  return product.name ?? product.id ?? "";
}

function getEndpointPath(
  operation: LiveApiOperation,
  searchTerm: string,
) {
  if (operation.id === searchOperationId) {
    const query = searchTerm.trim();

    return query
      ? `${operation.path}${encodeURIComponent(query)}`
      : operation.path;
  }

  return operation.path;
}

function getResultCountLabel(
  count: number,
  singularLabel: string,
  pluralLabel: string,
) {
  return `${count} ${count === 1 ? singularLabel : pluralLabel}`;
}

function formatSearchEmptyText(template: string, query: string) {
  return template.replace("{query}", query);
}

function getStatusMessage(json: unknown) {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    return undefined;
  }

  const message = (json as Record<string, unknown>).message;

  return typeof message === "string" && message.length > 0
    ? message
    : undefined;
}

export function ApiLivePreview({
  categoriesLabel,
  defaultOperationId,
  emptyInputLabel,
  errorLabel,
  jsonSummaryLabel,
  label,
  liveResponseLabel,
  loadingLabel,
  numberLocale,
  operationBaseUrl,
  operations,
  priceLabel,
  resultPluralLabel,
  resultSingularLabel,
  searchEmptyText,
  searchEmptyTitle,
  suggestionLabel,
}: ApiLivePreviewProps) {
  const initialOperationId = operations.some(
    (operation) => operation.id === defaultOperationId,
  )
    ? defaultOperationId
    : operations[0]?.id ?? "";
  const [activeOperationId, setActiveOperationId] =
    useState(initialOperationId);
  const [requestState, setRequestState] = useState<ApiRequestState>({
    status: "idle",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<readonly string[]>([]);
  const activeOperation =
    operations.find((operation) => operation.id === activeOperationId) ??
    operations[0];
  const isLoading = requestState.status === "loading";
  const relevantState =
    "operationId" in requestState &&
    requestState.operationId === activeOperation?.id
      ? requestState
      : undefined;

  if (!activeOperation) {
    return null;
  }

  const endpointPath = getEndpointPath(activeOperation, searchTerm);

  async function executeRequest(operation: LiveApiOperation) {
    const path = getEndpointPath(operation, searchTerm);

    if (operation.id === searchOperationId && searchTerm.trim() === "") {
      setRequestState({
        notice: emptyInputLabel,
        operationId: operation.id,
        status: "idle",
      });
      return;
    }

    setRequestState({
      endpointPath: path,
      operationId: operation.id,
      status: "loading",
    });

    try {
      const response = await fetch(`${operationBaseUrl}${path}`, {
        cache: "no-store",
        credentials: "omit",
        headers: {
          Accept: "application/json",
        },
        method: operation.method,
      });
      const json = parseResponse(await response.text());

      if (!response.ok) {
        if (operation.id === searchOperationId && response.status === 404) {
          setRequestState({
            endpointPath: path,
            operationId: operation.id,
            query: searchTerm.trim(),
            status: "empty",
          });
          return;
        }

        setRequestState({
          endpointPath: path,
          httpStatus: response.status,
          operationId: operation.id,
          status: "error",
        });
        return;
      }

      if (operation.id === listOperationId) {
        setSuggestions(getSuggestions(json, numberLocale));
      }

      setRequestState({
        endpointPath: path,
        httpStatus: response.status,
        json,
        operationId: operation.id,
        sample: formatResponseSample(json),
        status: "success",
      });
    } catch {
      setRequestState({
        endpointPath: path,
        operationId: operation.id,
        status: "error",
      });
    }
  }

  function handleOperationSelect(operationId: string) {
    setActiveOperationId(operationId);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void executeRequest(activeOperation);
  }

  function handleSuggestionSelect(suggestion: string) {
    setSearchTerm(suggestion);
    setRequestState({ status: "idle" });
  }

  function renderProductMeta(product: ProductSummary) {
    return (
      <dl className="mt-3 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 text-sm leading-6 text-zinc-400">
        {product.categories ? (
          <div className="min-w-0">
            <dt className="sr-only">{categoriesLabel}</dt>
            <dd>{product.categories}</dd>
          </div>
        ) : null}
        {product.price ? (
          <div className="shrink-0">
            <dt className="sr-only">{priceLabel}</dt>
            <dd className="font-medium text-zinc-300">{product.price}</dd>
          </div>
        ) : null}
      </dl>
    );
  }

  function renderProductList(json: unknown) {
    const products = getProducts(json, numberLocale);

    return (
      <ol className="divide-y divide-white/[0.07]">
        {products.map((product, index) => {
          const title = getProductTitle(product);

          return (
            <li className="py-4 first:pt-0 last:pb-0" key={product.id ?? index}>
              <div className="min-w-0">
                {title ? (
                  <p className="text-base font-semibold leading-7 text-zinc-50">
                    {title}
                  </p>
                ) : null}
                {renderProductMeta(product)}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  function renderSuccess(state: Extract<ApiRequestState, { status: "success" }>) {
    const products = getProducts(state.json, numberLocale);
    const hasProductResults =
      state.operationId === listOperationId ||
      state.operationId === searchOperationId;
    const statusMessage =
      state.operationId === statusOperationId
        ? getStatusMessage(state.json)
        : undefined;

    return (
      <div className="space-y-5">
        {statusMessage ? (
          <p className="max-w-xl text-base font-medium leading-7 text-zinc-50 sm:text-lg sm:leading-8">
            {statusMessage}
          </p>
        ) : null}

        <p className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs leading-5 text-zinc-400">
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-mono text-zinc-300">
              {state.httpStatus}
            </span>
            <span aria-hidden="true" className="text-zinc-700">
              ·
            </span>
            <span>{liveResponseLabel}</span>
          </span>
          {hasProductResults ? (
            <span>
              {getResultCountLabel(
                products.length,
                resultSingularLabel,
                resultPluralLabel,
              )}
            </span>
          ) : null}
        </p>

        {hasProductResults ? renderProductList(state.json) : null}

        <details className="group pt-1">
          <summary className="inline-flex min-h-9 cursor-pointer list-none items-center border-b border-white/[0.1] text-xs font-medium text-zinc-500 transition-colors hover:border-white/30 hover:text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
            <span>{jsonSummaryLabel}</span>
            <span aria-hidden="true" className="ml-2 text-zinc-600">
              +
            </span>
          </summary>
          <pre className="mt-3 max-h-40 overflow-hidden whitespace-pre-wrap break-words border-l border-white/[0.06] pl-3 font-mono text-[0.6875rem] leading-5 text-zinc-400">
            {state.sample}
          </pre>
        </details>
      </div>
    );
  }

  function renderSearchSuggestions() {
    if (activeOperation.id !== searchOperationId || suggestions.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-5 text-zinc-500">
        <span>{suggestionLabel}:</span>
        {suggestions.map((suggestion) => (
          <button
            className="min-h-8 border-b border-white/[0.1] text-zinc-300 transition-colors hover:border-white/35 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 motion-reduce:transition-none"
            key={suggestion}
            onClick={() => handleSuggestionSelect(suggestion)}
            type="button"
          >
            {suggestion}
          </button>
        ))}
      </div>
    );
  }

  function renderSearchEmpty(
    state: Extract<ApiRequestState, { status: "empty" }>,
  ) {
    return (
      <div className="space-y-2 py-2">
        <p className="text-base font-semibold leading-7 text-zinc-50">
          {searchEmptyTitle}
        </p>
        <p className="max-w-xl text-sm leading-7 text-zinc-300">
          {formatSearchEmptyText(searchEmptyText, state.query)}
        </p>
        {renderSearchSuggestions()}
      </div>
    );
  }

  function renderIdleState(notice?: string) {
    return (
      <div className="space-y-2 py-1">
        <p className="text-base font-semibold leading-7 text-zinc-50">
          {activeOperation.idleState.title}
        </p>
        <p className="max-w-xl text-sm leading-7 text-zinc-300">
          {activeOperation.idleState.text}
        </p>
        {notice ? (
          <p className="max-w-xl text-sm leading-7 text-zinc-400">
            {notice}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-6">
      <div className="flex items-center gap-3">
        <p className="text-xs font-medium leading-5 text-zinc-400">{label}</p>
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-white/[0.07]"
        />
      </div>

      <div className="grid grid-cols-3 gap-x-5 gap-y-5">
        {operations.map((operation) => {
          const isActive = operation.id === activeOperation.id;

          return (
            <button
              aria-pressed={isActive}
              className={`group min-h-[5rem] min-w-0 border-b px-0 pb-4 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 motion-reduce:transition-none ${
                isActive
                  ? "border-[rgba(127,29,29,0.78)] text-zinc-50"
                  : "border-transparent text-zinc-300 hover:border-white/[0.18] hover:text-zinc-50"
              }`}
              key={operation.id}
              onClick={() => handleOperationSelect(operation.id)}
              type="button"
            >
              <span
                className={`block text-xs font-medium leading-5 transition-colors duration-150 motion-reduce:transition-none ${
                  isActive ? "text-zinc-300" : "text-zinc-500"
                }`}
              >
                {operation.number}
              </span>
              <span className="mt-1.5 block text-base font-semibold leading-6 text-inherit">
                {operation.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-5">
        <div className="space-y-3">
          <p className="font-mono text-[1.15rem] font-semibold leading-8 text-zinc-50 sm:text-2xl sm:leading-8">
            <span className="mr-2 text-xs font-medium leading-5 text-zinc-500">
              {activeOperation.method}
            </span>
            <span>{endpointPath}</span>
          </p>
          <p className="max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
            {activeOperation.description}
          </p>
        </div>

        {activeOperation.input ? (
          <form className="space-y-4" onSubmit={handleSearchSubmit}>
            <label
              className="block text-sm font-medium leading-6 text-zinc-300"
              htmlFor="api-live-search"
            >
              {activeOperation.input.label}
            </label>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <input
                className="min-h-11 border-b border-white/[0.16] bg-transparent px-0 py-2.5 text-base text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 disabled:text-zinc-500 motion-reduce:transition-none"
                disabled={isLoading}
                id="api-live-search"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={activeOperation.input.placeholder}
                type="search"
                value={searchTerm}
              />
              <button
                className="inline-flex min-h-11 items-center border-b border-white/[0.2] text-sm font-semibold text-zinc-100 transition-colors hover:border-white/50 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 disabled:cursor-wait disabled:border-white/[0.08] disabled:text-zinc-500 motion-reduce:transition-none"
                disabled={isLoading}
                type="submit"
              >
                <span>
                  {isLoading ? loadingLabel : activeOperation.actionLabel}
                </span>
                <span aria-hidden="true" className="ml-2 text-zinc-500">
                  →
                </span>
              </button>
            </div>
            {renderSearchSuggestions()}
          </form>
        ) : null}

        {!activeOperation.input && activeOperation.actionLabel ? (
          <button
            className="inline-flex min-h-11 items-center border-b border-white/[0.2] text-sm font-semibold text-zinc-100 transition-colors hover:border-white/50 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 disabled:cursor-wait disabled:border-white/[0.08] disabled:text-zinc-500 motion-reduce:transition-none"
            disabled={isLoading}
            onClick={() => void executeRequest(activeOperation)}
            type="button"
          >
            <span>{isLoading ? loadingLabel : activeOperation.actionLabel}</span>
            <span aria-hidden="true" className="ml-2 text-zinc-500">
              →
            </span>
          </button>
        ) : null}
      </div>

      <div
        aria-busy={isLoading}
        aria-live="polite"
        className="min-h-24 border-t border-white/[0.07] pt-5"
      >
        {relevantState?.status === "loading" ? (
          <p className="text-sm leading-7 text-zinc-400">{loadingLabel}</p>
        ) : null}

        {relevantState?.status === "success" ? (
          renderSuccess(relevantState)
        ) : null}

        {relevantState?.status === "empty" ? (
          renderSearchEmpty(relevantState)
        ) : null}

        {relevantState?.status === "error" ? (
          <p className="text-sm leading-7 text-zinc-300">
            {errorLabel}
            {relevantState.httpStatus ? (
              <span className="ml-2 font-mono text-xs text-zinc-500">
                {relevantState.httpStatus}
              </span>
            ) : null}
          </p>
        ) : null}

        {relevantState?.status === "idle" && relevantState.notice ? (
          renderIdleState(relevantState.notice)
        ) : null}

        {(!relevantState ||
          (relevantState.status === "idle" && !relevantState.notice)) ? (
          renderIdleState()
        ) : null}
      </div>
    </div>
  );
}
