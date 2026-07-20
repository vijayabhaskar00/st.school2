import type { Course } from "@/data/content";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { COLOR_THEME } from "./color-theme";

export function HighlightGrid({
  highlights,
  color,
  className,
}: {
  highlights: Course["highlights"];
  color: Course["color"];
  className?: string;
}) {
  const theme = COLOR_THEME[color];
  return (
    <div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2", className)}>
      {highlights.map((highlight, i) => (
        <Reveal key={highlight.title} delay={i * 0.08} className="h-full">
          <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-ink-soft/60 p-6 transition-colors duration-300 hover:bg-ink-elevated sm:p-7">
            <div
              className={cn(
                "pointer-events-none absolute -right-10 -top-10 size-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
                theme.bgGlow,
              )}
              aria-hidden
            />
            <h3 className="font-display relative text-lg font-medium tracking-tight text-paper">
              {highlight.title}
            </h3>
            <p className="relative mt-2.5 text-sm leading-relaxed text-muted">
              {highlight.description}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
