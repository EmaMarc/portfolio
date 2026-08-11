"use client";

import { useState } from "react";

export type SystemTraceStage = {
  id: string;
  label: string;
  items: readonly string[];
  detailTitle: string;
  detailText: string;
};

type BackendSystemTraceProps = {
  defaultStageId: string;
  label: string;
  panelId: string;
  stages: readonly SystemTraceStage[];
};

function isEndpointItem(item: string) {
  return item.startsWith("/");
}

export function BackendSystemTrace({
  defaultStageId,
  label,
  panelId,
  stages,
}: BackendSystemTraceProps) {
  const initialStageId = stages.some((stage) => stage.id === defaultStageId)
    ? defaultStageId
    : stages[0]?.id ?? "";
  const [activeStageId, setActiveStageId] = useState(initialStageId);
  const activeStage =
    stages.find((stage) => stage.id === activeStageId) ?? stages[0];

  if (!activeStage) {
    return null;
  }

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-6">
      <div className="flex items-center gap-3">
        <p className="text-xs font-medium leading-5 text-zinc-400">
          {label}
        </p>
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-white/[0.07]"
        />
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
        {stages.map((stage) => {
          const isActive = stage.id === activeStage.id;

          return (
            <button
              aria-controls={panelId}
              aria-pressed={isActive}
              className={`group flex min-h-[5.75rem] min-w-0 flex-col border-b px-0 pb-4 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 motion-reduce:transition-none ${
                isActive
                  ? "border-[rgba(127,29,29,0.78)] text-zinc-50"
                  : "border-transparent text-zinc-300 hover:border-white/[0.18] hover:text-zinc-50"
              }`}
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              onFocus={() => setActiveStageId(stage.id)}
              onPointerEnter={() => setActiveStageId(stage.id)}
              type="button"
            >
              <span className="block text-base font-semibold leading-6 text-inherit">
                {stage.label}
              </span>
              <span
                className={`mt-3 grid gap-1 text-xs leading-5 transition-colors duration-150 motion-reduce:transition-none ${
                  isActive ? "text-zinc-300" : "text-zinc-400"
                }`}
              >
                {stage.items.map((item) => (
                  <span
                    className={`min-w-0 break-words ${
                      isEndpointItem(item) ? "font-mono" : "font-medium"
                    }`}
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="border-t border-white/[0.07] pt-5"
        id={panelId}
      >
        <div className="min-w-0 space-y-3">
          <p className="text-base font-semibold leading-7 text-zinc-50">
            {activeStage.detailTitle}
          </p>
          <p className="max-w-xl text-sm leading-7 text-zinc-300">
            {activeStage.detailText}
          </p>
        </div>
      </div>
    </div>
  );
}
