"use client";

import type { Batch } from "@/data/content";
import { COLOR_THEME } from "@/components/courses/color-theme";
import { cn } from "@/lib/utils";

// A small segmented control letting a visitor pick which cohort's
// price/deadline/seats ApplyPanel shows. Presentational only — the caller
// owns which mode is active and what happens when it changes.
export function BatchToggle({
  batches,
  activeMode,
  onChange,
  color,
}: {
  batches: Batch[];
  activeMode: Batch["mode"];
  onChange: (mode: Batch["mode"]) => void;
  color: "violet" | "coral";
}) {
  const theme = COLOR_THEME[color];

  return (
    <div
      role="tablist"
      aria-label="Batch mode"
      className="inline-flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1"
    >
      {batches.map((batch) => {
        const active = batch.mode === activeMode;
        return (
          <button
            key={batch.mode}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(batch.mode)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              active ? cn(theme.solidBg, "text-ink") : "text-paper/70 hover:text-paper",
            )}
          >
            {batch.label}
          </button>
        );
      })}
    </div>
  );
}
