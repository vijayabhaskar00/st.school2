import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Course } from "@/data/content";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { COLOR_THEME } from "./color-theme";

export function CourseCrossLink({ course }: { course: Course }) {
  const theme = COLOR_THEME[course.color];

  return (
    <Reveal>
      <Link
        href={`/courses/${course.slug}`}
        className={cn(
          "group relative flex flex-col gap-6 overflow-hidden rounded-3xl border bg-ink-soft/60 p-8 transition-all duration-300 hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between sm:p-10",
          theme.border,
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-40 blur-[100px] transition-opacity duration-500 group-hover:opacity-70",
            theme.bgGlow,
          )}
          aria-hidden
        />
        <div className="relative flex flex-col gap-2">
          <span className={cn("text-xs font-semibold uppercase tracking-[0.18em]", theme.text)}>
            Explore the other program
          </span>
          <span className="font-display text-2xl font-medium tracking-tight text-paper sm:text-3xl">
            {course.name}
          </span>
          <span className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            {course.tagline}
          </span>
        </div>
        <span
          className={cn(
            "relative flex size-14 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1",
            theme.border,
            theme.bgSoft,
          )}
        >
          <ArrowUpRight className={cn("size-6", theme.solidText)} strokeWidth={2.25} />
        </span>
      </Link>
    </Reveal>
  );
}
