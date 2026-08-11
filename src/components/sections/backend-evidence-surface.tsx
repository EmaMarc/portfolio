import type { Locale, TechnicalEvidence } from "@/content/portfolio";

import {
  BackendSystemTrace,
  type SystemTraceStage,
} from "./backend-system-trace";

type BackendEvidenceSurfaceProps = {
  className?: string;
  evidence: TechnicalEvidence;
  locale: Locale;
};

export function BackendEvidenceSurface({
  className = "",
  evidence,
  locale,
}: BackendEvidenceSurfaceProps) {
  const stages = evidence.stages.map((stage) => ({
    detailText: stage.detailText[locale],
    detailTitle: stage.detailTitle[locale],
    id: stage.id,
    items: stage.items.map((item) => item[locale]),
    label: stage.label[locale],
  })) satisfies readonly SystemTraceStage[];

  return (
    <div
      className={`relative isolate overflow-hidden bg-black/[0.88] px-3 py-5 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/[0.08] before:content-[''] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/[0.045] after:content-[''] sm:px-4 ${className}`}
    >
      <p className="sr-only">{evidence.ariaLabel[locale]}</p>
      <BackendSystemTrace
        defaultStageId={evidence.defaultStageId}
        label={evidence.label[locale]}
        panelId={`${evidence.id}-detail`}
        stages={stages}
      />
    </div>
  );
}
