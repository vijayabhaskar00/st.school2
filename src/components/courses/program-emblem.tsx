"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap } from "lucide-react";
import type { Course } from "@/data/content";
import { COLOR_THEME } from "@/components/courses/color-theme";
import { cn } from "@/lib/utils";

// The hero visual for any course whose `template` is "generic" — i.e. every
// course beyond the two bespoke ones (Python's NeuralPulse Remotion piece,
// UI/UX's DesignSystemBuild). Adding a third program used to mean either
// hand-building a new Remotion composition (expensive) or silently
// inheriting whichever bespoke template the slug string happened to match
// (wrong). This is deliberately simpler than the Remotion pieces — a
// lightweight Framer Motion badge, not a bespoke animation — but it's real,
// on-brand, and every element traces to actual course data: the orbiting
// dot count is the course's real curriculum phase count, not decoration.
export function ProgramEmblem({ course }: { course: Course }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" });
  const theme = COLOR_THEME[course.color];
  const phaseCount = course.curriculum.length;

  return (
    <div ref={ref} className="flex flex-col items-center gap-5">
      <div className="relative aspect-square w-full overflow-hidden rounded-full border border-white/10 bg-ink-elevated/60">
        <div
          className={cn("pointer-events-none absolute inset-0 opacity-40 blur-2xl", theme.bgGlow)}
          aria-hidden
        />

        {/* slow-rotating ring the orbit dots ride on. Each dot's position is
            computed as a percentage of this ring's own box (not a fixed px
            translate — that wouldn't scale across breakpoints, since this
            hero slot is a different real size on mobile vs. desktop), and
            each dot is a plain positioning wrapper around a *separate*
            motion.span for its entrance pop — animating scale directly on
            the positioned element would fight with the static rotate/
            translate transform this positioning otherwise needs. */}
        <div className="animate-spin-slow absolute inset-[12%]" aria-hidden>
          {Array.from({ length: phaseCount }, (_, i) => {
            const angle = (i / phaseCount) * 2 * Math.PI;
            const x = 50 + 50 * Math.cos(angle);
            const y = 50 + 50 * Math.sin(angle);
            return (
              <div
                key={i}
                className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.3 + i * 0.1 }}
                  className={cn("block size-2.5 rounded-full", theme.solidBg)}
                />
              </div>
            );
          })}
        </div>

        {/* center badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: "spring", damping: 14, stiffness: 180, delay: 0.1 }}
            className={cn(
              "flex size-[28%] items-center justify-center rounded-full border",
              theme.border,
              theme.bgSoft,
            )}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <GraduationCap className={cn("size-[45%]", theme.text)} strokeWidth={1.75} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <p className="text-center text-xs uppercase tracking-[0.18em] text-muted-soft">
        {phaseCount}-phase curriculum · {course.duration} · mentor-reviewed every week
      </p>
    </div>
  );
}
