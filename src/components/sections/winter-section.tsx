import { WinterAssistant } from "@/components/sections/winter-assistant";
import type { Locale } from "@/content/portfolio";

const winterCopy = {
  es: {
    clearInput: "Limpiar pregunta",
    emptyState:
      "Elegí una pregunta sugerida o escribí una consulta breve sobre Ema.",
    errorMessage: "Winter no pudo responder en este momento. Intentá nuevamente.",
    heading: "Preguntame sobre Ema",
    inputLabel: "Pregunta para Winter AI",
    intro:
      "Winter es un asistente de IA integrado al portfolio para explorar la experiencia, proyectos, tecnologías y formación de Ema.",
    loadingMessage: "Winter está pensando...",
    placeholder: "¿Qué hizo Ema en Innova Lab?",
    quotaErrorMessage:
      "Winter alcanzó temporalmente su límite de consultas. Probá nuevamente más tarde.",
    rateLimitErrorMessage:
      "Winter recibió demasiadas consultas en poco tiempo. Probá nuevamente en unos minutos.",
    sendQuestion: "Enviar pregunta",
    serviceUnavailableErrorMessage:
      "Winter está temporalmente indisponible porque el servicio de Gemini no respondió. Probá nuevamente en unos segundos.",
    suggestionsLabel: "Preguntas sugeridas",
    winterLabel: "Winter AI",
  },
  en: {
    clearInput: "Clear question",
    emptyState:
      "Choose a suggested question or write a short query about Ema.",
    errorMessage: "Winter couldn't respond right now. Please try again.",
    heading: "Ask me about Ema",
    inputLabel: "Question for Winter AI",
    intro:
      "Winter is an AI assistant integrated into the portfolio for exploring Ema's experience, projects, technologies, and background.",
    loadingMessage: "Winter is thinking...",
    placeholder: "What did Ema do at Innova Lab?",
    quotaErrorMessage:
      "Winter has temporarily reached its request limit. Please try again later.",
    rateLimitErrorMessage:
      "Winter received too many requests in a short period. Please try again in a few minutes.",
    sendQuestion: "Send question",
    serviceUnavailableErrorMessage:
      "Winter is temporarily unavailable because the Gemini service didn't respond. Please try again in a few seconds.",
    suggestionsLabel: "Suggested questions",
    winterLabel: "Winter AI",
  },
} satisfies Record<
  Locale,
  {
    clearInput: string;
    emptyState: string;
    errorMessage: string;
    heading: string;
    inputLabel: string;
    intro: string;
    loadingMessage: string;
    placeholder: string;
    quotaErrorMessage: string;
    rateLimitErrorMessage: string;
    sendQuestion: string;
    serviceUnavailableErrorMessage: string;
    suggestionsLabel: string;
    winterLabel: string;
  }
>;

const suggestedQuestions = {
  es: [
    "¿Por qué te llamás Winter AI?",
    "¿Qué tecnologías utiliza Ema?",
    "¿Cuál es su experiencia frontend?",
    "¿Qué proyectos construyó?",
  ],
  en: [
    "Why are you called Winter AI?",
    "What technologies does Ema use?",
    "What frontend experience does Ema have?",
    "What projects has Ema built?",
  ],
} satisfies Record<Locale, readonly string[]>;

export function WinterSection({ locale }: { locale: Locale }) {
  const labels = winterCopy[locale];

  return (
    <section
      aria-labelledby="winter-title"
      className="mx-auto w-full max-w-6xl scroll-mt-28 border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8"
      id="winter"
    >
      <div className="grid gap-9 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:items-start lg:gap-14">
        <div
          className="min-w-0 lg:pt-3"
          data-reveal=""
          data-reveal-target="winter-copy"
        >
          <p className="inline-flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
            <span
              aria-hidden="true"
              className="size-1.5 bg-[rgba(220,38,38,0.82)]"
            />
            <span>WINTER AI</span>
          </p>
          <h2
            className="mt-5 text-4xl font-semibold tracking-normal text-zinc-50 sm:text-5xl"
            id="winter-title"
          >
            {labels.heading}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg sm:leading-9">
            {labels.intro}
          </p>
        </div>

        <WinterAssistant
          labels={{
            clearInput: labels.clearInput,
            emptyState: labels.emptyState,
            errorMessage: labels.errorMessage,
            inputLabel: labels.inputLabel,
            loadingMessage: labels.loadingMessage,
            placeholder: labels.placeholder,
            quotaErrorMessage: labels.quotaErrorMessage,
            rateLimitErrorMessage: labels.rateLimitErrorMessage,
            sendQuestion: labels.sendQuestion,
            serviceUnavailableErrorMessage:
              labels.serviceUnavailableErrorMessage,
            suggestionsLabel: labels.suggestionsLabel,
            winterLabel: labels.winterLabel,
          }}
          locale={locale}
          suggestedQuestions={suggestedQuestions[locale]}
        />
      </div>
    </section>
  );
}
