import type { Course } from "@/data/content";
import { site } from "@/data/content";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/courses/countdown-timer";
import { SeatsProgress } from "@/components/courses/seats-progress";
import { BrochureButton } from "@/components/courses/brochure-button";
import { PricingGate } from "@/components/courses/pricing-gate";
import { COLOR_THEME } from "@/components/courses/color-theme";
import { cn } from "@/lib/utils";

export function ApplyPanel({ course }: { course: Course }) {
  const theme = COLOR_THEME[course.color];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-ink-elevated/60 p-6 backdrop-blur-sm sm:p-8",
        theme.border,
      )}
    >
      <div className={cn("pointer-events-none absolute -right-16 -top-16 size-56 rounded-full blur-[100px] opacity-40", theme.bgGlow)} />

      <div className="relative flex flex-col gap-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <CountdownTimer deadline={course.applicationDeadline} color={course.color} />
          <div className="w-full max-w-xs sm:w-64">
            <SeatsProgress claimed={course.seatsClaimed} total={course.seatsTotal} color={course.color} />
          </div>
        </div>

        <PricingGate course={course} />

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Button href="/contact" variant="primary" className="justify-center px-7 py-3.5 text-base">
            {site.ctaLabel}
          </Button>
          <BrochureButton course={course} className="justify-center" />
        </div>
      </div>
    </div>
  );
}
