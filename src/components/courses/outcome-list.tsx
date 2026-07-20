import { CheckCircle2 } from "lucide-react";
import type { Course } from "@/data/content";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { COLOR_THEME } from "./color-theme";

export function OutcomeList({
  outcomes,
  color,
  className,
}: {
  outcomes: string[];
  color: Course["color"];
  className?: string;
}) {
  const theme = COLOR_THEME[color];
  return (
    <ul className={cn("flex flex-col gap-3 sm:gap-4", className)}>
      {outcomes.map((outcome, i) => (
        <Reveal key={outcome} delay={i * 0.07}>
          <li className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-ink-soft/50 p-4 transition-colors duration-300 hover:bg-ink-elevated sm:p-5">
            <span className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full", theme.bgSoft)}>
              <CheckCircle2 className={cn("size-4", theme.solidText)} strokeWidth={2.5} />
            </span>
            <span className="text-sm leading-relaxed text-paper/85 sm:text-base">{outcome}</span>
          </li>
        </Reveal>
      ))}
    </ul>
  );
}
