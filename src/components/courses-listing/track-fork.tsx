"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Award } from "lucide-react";
import type { Course } from "@/data/content";
import { heroStats } from "@/data/content";
import { COLOR_THEME } from "@/components/courses/color-theme";
import { cn } from "@/lib/utils";

// Every other hero on the site pairs its headline with a visual companion
// (SelectionField on the homepage, OriginNetwork on About, SeatsGauge on
// Contact, a Remotion piece per course on the detail pages) — this masthead
// was the one exception, just text against a gradient blob. This fills that
// gap with a "fork" diagram: one applicant, two real tracks, one outcome —
// which also previews the choice the TrackMatcher quiz below asks you to
// make, rather than just decorating the top of the page.
const placementStat = heroStats.find((s) => s.suffix === "%");

// Two adjacent rounded-corner boxes read as a single branching bar: the
// classic CSS org-chart connector, no SVG or absolute positioning needed.
function BranchOut() {
  return (
    <div className="flex w-full max-w-xs justify-between">
      <div className="h-6 w-1/2 rounded-tr-2xl border-r border-t border-white/15" />
      <div className="h-6 w-1/2 rounded-tl-2xl border-l border-t border-white/15" />
    </div>
  );
}

function BranchIn() {
  return (
    <div className="flex w-full max-w-xs justify-between">
      <div className="h-6 w-1/2 rounded-br-2xl border-b border-r border-white/15" />
      <div className="h-6 w-1/2 rounded-bl-2xl border-b border-l border-white/15" />
    </div>
  );
}

function Stub({ isInView, delay }: { isInView: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={isInView ? { scaleY: 1 } : {}}
      style={{ originY: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="h-6 w-px bg-white/15"
    />
  );
}

function TrackCard({ course, isInView, delay }: { course: Course; isInView: boolean; delay: number }) {
  const theme = COLOR_THEME[course.color];
  const seatsLeft = course.seatsTotal - course.seatsClaimed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ type: "spring", damping: 14, stiffness: 190, delay }}
      className={cn(
        "flex flex-1 flex-col gap-2 rounded-2xl border bg-ink-elevated/70 p-4",
        theme.border,
      )}
    >
      <span className={cn("size-2 rounded-full", theme.solidBg)} aria-hidden />
      <span className="font-display text-sm font-semibold leading-tight text-paper sm:text-base">
        {course.shortName}
      </span>
      <span className="text-xs text-muted-soft">{course.duration}</span>
      <span className={cn("text-xs font-medium", theme.text)}>{seatsLeft} seats left</span>
    </motion.div>
  );
}

export function TrackFork({ courses }: { courses: [Course, Course] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [first, second] = courses;

  return (
    <div
      ref={ref}
      className="flex flex-col items-center rounded-3xl border border-white/10 bg-ink-soft/60 px-6 py-8 sm:px-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: "spring", damping: 14, stiffness: 220 }}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-paper/80"
      >
        You apply
      </motion.div>

      <Stub isInView={isInView} delay={0.15} />
      <BranchOut />

      <div className="flex w-full gap-3 sm:gap-4">
        <TrackCard course={first} isInView={isInView} delay={0.3} />
        <TrackCard course={second} isInView={isInView} delay={0.38} />
      </div>

      <BranchIn />
      <Stub isInView={isInView} delay={0.55} />

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: "spring", damping: 12, stiffness: 220, delay: 0.65 }}
        className="flex flex-wrap items-center justify-center gap-2 rounded-full bg-gradient-to-r from-coral to-coral-light px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-ink"
      >
        <Award className="size-3.5 shrink-0" strokeWidth={2.5} />
        Hired
        {placementStat && (
          <span className="inline-flex items-center gap-1 border-l border-ink/20 pl-2">
            <ArrowRight className="size-3 shrink-0" strokeWidth={2.5} />
            {placementStat.value}
            {placementStat.suffix} track record
          </span>
        )}
      </motion.div>
    </div>
  );
}
