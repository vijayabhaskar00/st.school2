"use client";

import { useState } from "react";
import type { Course } from "@/data/content";
import { site } from "@/data/content";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/courses/countdown-timer";
import { SeatsProgress } from "@/components/courses/seats-progress";
import { BrochureButton } from "@/components/courses/brochure-button";
import { PricingGate } from "@/components/courses/pricing-gate";
import { BatchToggle } from "@/components/courses/batch-toggle";
import { COLOR_THEME } from "@/components/courses/color-theme";
import { cn } from "@/lib/utils";

export function ApplyPanel({ course }: { course: Course }) {
  const theme = COLOR_THEME[course.color];
  const hasBatches = course.batches.length > 0;

  const [mode, setMode] = useState(course.batches[0]?.mode ?? "online");
  const activeBatch = hasBatches
    ? (course.batches.find((b) => b.mode === mode) ?? course.batches[0])
    : null;

  // ApplyPanel is the only place batch selection affects anything — every
  // other component here (CountdownTimer, SeatsProgress, PricingGate)
  // still just takes plain props/a Course, unaware that a toggle exists.
  // Shallow-merging the active batch's numbers over `course` lets them
  // stay that way.
  const displayCourse: Course = activeBatch
    ? {
        ...course,
        priceAmount: activeBatch.priceAmount,
        priceOriginalAmount: activeBatch.priceOriginalAmount,
        priceNote: activeBatch.priceNote,
        applicationDeadline: activeBatch.applicationDeadline,
        seatsTotal: activeBatch.seatsTotal,
        seatsClaimed: activeBatch.seatsClaimed,
      }
    : course;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-ink-elevated/60 p-6 backdrop-blur-sm sm:p-8",
        theme.border,
      )}
    >
      <div className={cn("pointer-events-none absolute -right-16 -top-16 size-56 rounded-full blur-[100px] opacity-40", theme.bgGlow)} />

      <div className="relative flex flex-col gap-7">
        {hasBatches && (
          <BatchToggle
            batches={course.batches}
            activeMode={mode}
            onChange={setMode}
            color={course.color}
          />
        )}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <CountdownTimer deadline={displayCourse.applicationDeadline} color={course.color} />
          <div className="w-full max-w-xs sm:w-64">
            <SeatsProgress claimed={displayCourse.seatsClaimed} total={displayCourse.seatsTotal} color={course.color} />
          </div>
        </div>

        <PricingGate course={displayCourse} />

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
