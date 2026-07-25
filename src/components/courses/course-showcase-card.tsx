import type { Course } from "@/data/content";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShowcaseCardShell } from "@/components/courses-listing/showcase-card-shell";
import { OutcomeChecklist } from "@/components/courses-listing/outcome-checklist";
import { COLOR_THEME } from "./color-theme";
import { CourseStatRow } from "./stat-row";
import { StackChips } from "./stack-chips";

// This stays a Server Component: only the card's chrome (cursor spotlight,
// tilt, hover-reactive border/glow) and the outcomes list actually need
// client JS, and both are isolated into small "use client" leaves. The copy,
// badges, stats, stack chips and CTA are still rendered on the server.
export function CourseShowcaseCard({ course, reverse = false }: { course: Course; reverse?: boolean }) {
  const theme = COLOR_THEME[course.color];

  return (
    <ShowcaseCardShell color={course.color} reverse={reverse}>
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
          <OutcomeChecklist outcomes={course.outcomes.slice(0, 4)} color={course.color} />
        </div>
      </div>
    </ShowcaseCardShell>
  );
}
