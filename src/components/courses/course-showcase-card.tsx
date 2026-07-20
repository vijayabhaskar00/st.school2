import { CheckCircle2 } from "lucide-react";
import type { Course } from "@/data/content";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COLOR_THEME } from "./color-theme";
import { CourseStatRow } from "./stat-row";
import { StackChips } from "./stack-chips";

export function CourseShowcaseCard({ course, reverse = false }: { course: Course; reverse?: boolean }) {
  const theme = COLOR_THEME[course.color];

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border bg-ink-soft/60 p-8 sm:p-12 lg:p-16",
        theme.border,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -top-24 size-96 rounded-full blur-[130px] opacity-40",
          theme.bgGlow,
          reverse ? "-right-24" : "-left-24",
        )}
        aria-hidden
      />

      <div
        className={cn(
          "relative flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16",
          reverse && "lg:flex-row-reverse",
        )}
      >
        <div className="flex max-w-xl flex-col gap-6">
          <Reveal>
            <Badge>
              {course.level} · {course.mode}
            </Badge>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display text-3xl font-medium leading-[1.08] tracking-tight text-paper sm:text-4xl lg:text-[2.75rem]">
              {course.name}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={cn("text-lg font-medium leading-snug sm:text-xl", theme.text)}>
              {course.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="text-balance text-sm leading-relaxed text-muted sm:text-base">
              {course.summary}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <CourseStatRow course={course} />
          </Reveal>
          <Reveal delay={0.22}>
            <StackChips stack={course.stack} color={course.color} />
          </Reveal>
          <Reveal delay={0.26} className="pt-2">
            <Button href={`/courses/${course.slug}`} variant="primary">
              Explore the {course.shortName} program
            </Button>
          </Reveal>
        </div>

        <div className="flex w-full max-w-md flex-col gap-4 lg:pt-2">
          <Reveal delay={0.16}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-soft">
              You&apos;ll walk away able to
            </p>
          </Reveal>
          <div className="flex flex-col gap-3">
            {course.outcomes.slice(0, 4).map((outcome, i) => (
              <Reveal key={outcome} delay={0.2 + i * 0.06}>
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 className={cn("mt-0.5 size-5 shrink-0", theme.solidText)} strokeWidth={2.5} />
                  <span className="text-sm leading-relaxed text-paper/85">{outcome}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
