import { CheckCircle2 } from "lucide-react";
import type { Course } from "@/data/content";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { COLOR_THEME } from "./color-theme";

export function OutcomeList({
  outcomes,
  color,
  className,
  variant = "list",
}: {
  outcomes: string[];
  color: Course["color"];
  className?: string;
  /** "list" = stacked rows with a check icon. "grid" = numbered 2-col checklist. */
  variant?: "list" | "grid";
}) {
  const theme = COLOR_THEME[color];

  if (variant === "grid") {
    return (
      <ul className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
        {outcomes.map((outcome, i) => (
          <Reveal
            key={outcome}
            delay={i * 0.07}
            as="li"
            className={cn(
              "group flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-ink-soft/50 p-5 transition-colors duration-300 hover:bg-ink-elevated",
              i % 2 === 1 && "sm:mt-8",
            )}
          >
            <span className={cn("font-display text-2xl font-semibold", theme.text)}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-sm leading-relaxed text-paper/85 sm:text-base">{outcome}</span>
          </Reveal>
        ))}
      </ul>
    );
  }

  return (
    <ul className={cn("flex flex-col gap-3 sm:gap-4", className)}>
      {outcomes.map((outcome, i) => (
        <Reveal
          key={outcome}
          delay={i * 0.07}
          as="li"
          className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-ink-soft/50 p-4 transition-colors duration-300 hover:bg-ink-elevated sm:p-5"
        >
          <span className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full", theme.bgSoft)}>
            <CheckCircle2 className={cn("size-4", theme.solidText)} strokeWidth={2.5} />
          </span>
          <span className="text-sm leading-relaxed text-paper/85 sm:text-base">{outcome}</span>
        </Reveal>
      ))}
    </ul>
  );
}
