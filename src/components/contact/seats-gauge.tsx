"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

type Cohort = {
  label: string;
  claimed: number;
  total: number;
  color: "violet" | "coral";
};

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Live seats gauge for the contact page — a radial companion to the
// headline "33 seats" stat. It sums real `seatsClaimed`/`seatsTotal`
// figures across the currently open cohorts (passed in from content.ts
// via the page) rather than showing any invented number, then fills a
// ring + per-cohort bars with spring physics once scrolled into view.
export function SeatsGauge({
  headline,
  headlineSuffix = "",
  detail,
  cohorts,
}: {
  headline: number;
  headlineSuffix?: string;
  detail: string;
  cohorts: Cohort[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });

  const totalClaimed = cohorts.reduce((sum, c) => sum + c.claimed, 0);
  const totalSeats = cohorts.reduce((sum, c) => sum + c.total, 0);
  const pct = totalSeats > 0 ? Math.min(100, (totalClaimed / totalSeats) * 100) : 0;

  const countTarget = useMotionValue(0);
  const countSpring = useSpring(countTarget, { stiffness: 60, damping: 18, mass: 0.6 });
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (isInView) countTarget.set(totalClaimed);
  }, [isInView, totalClaimed, countTarget]);

  useMotionValueEvent(countSpring, "change", (v) => setDisplayCount(Math.round(v)));

  return (
    <div ref={ref} className="flex flex-col gap-5">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <svg viewBox="0 0 100 100" className="size-24 -rotate-90 sm:size-28">
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={8}
            />
            <motion.circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="url(#seatsGaugeGradient)"
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{
                strokeDashoffset: isInView
                  ? CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE
                  : CIRCUMFERENCE,
              }}
              transition={{ type: "spring", stiffness: 45, damping: 14, mass: 0.9 }}
            />
            <defs>
              <linearGradient id="seatsGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "var(--color-violet-light)" }} />
                <stop offset="60%" style={{ stopColor: "var(--color-violet)" }} />
                <stop offset="100%" style={{ stopColor: "var(--color-coral)" }} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-xl font-semibold tabular-nums text-paper sm:text-2xl">
              {displayCount}
            </span>
            <span className="text-[0.55rem] uppercase tracking-wide text-muted-soft">
              of {totalSeats}
            </span>
          </div>
        </div>

        <div>
          <span className="font-display text-gradient text-4xl font-semibold sm:text-5xl">
            {headline}
            {headlineSuffix}
          </span>
          <p className="mt-2 text-sm leading-relaxed text-muted">{detail}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-white/10 pt-4">
        {cohorts.map((cohort, i) => {
          const cohortPct = cohort.total > 0
            ? Math.min(100, Math.round((cohort.claimed / cohort.total) * 100))
            : 0;
          const barColor = cohort.color === "violet" ? "bg-violet-light" : "bg-coral-light";
          return (
            <div key={cohort.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-paper/80">{cohort.label}</span>
                <span className="tabular-nums text-muted-soft">
                  {cohort.claimed}/{cohort.total}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className={cn("h-full rounded-full", barColor)}
                  initial={{ width: 0 }}
                  animate={{ width: isInView ? `${cohortPct}%` : 0 }}
                  transition={{
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.15 + i * 0.1,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
