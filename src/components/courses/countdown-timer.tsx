"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(deadline: string): TimeLeft | null {
  const diff = new Date(deadline).getTime() - Date.now();
  // An unparseable CMS-entered deadline makes getTime() return NaN, and
  // NaN <= 0 is false — without this check the countdown would render
  // "NaN" in every digit instead of falling back to the closed state.
  if (!Number.isFinite(diff) || diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Digit({ value, textClassName }: { value: number; textClassName: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    // A tight `em`-based height clips the glyph's ascenders/descenders once
    // you factor in the font's natural line-height — this needs real
    // headroom, not just enough to fit the digit's cap-height.
    <span className="relative inline-flex h-[1.5em] w-[1.5ch] overflow-hidden text-center leading-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={padded}
          initial={{ y: "60%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-60%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "absolute inset-0 flex items-center justify-center leading-none tabular-nums",
            textClassName,
          )}
        >
          {padded}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function CountdownTimer({
  deadline,
  color,
}: {
  deadline: string;
  color: "violet" | "coral";
}) {
  // Render an inert placeholder until mounted so the server-rendered markup
  // (frozen at build time) never disagrees with the client's real clock.
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Synchronizing with the system clock needs an immediate read, not just
    // a subscription — without this the countdown would sit on its "0000"
    // placeholder for a full second after mount before the interval below
    // ever fires.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setTimeLeft(getTimeLeft(deadline));
    const id = setInterval(() => setTimeLeft(getTimeLeft(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const textClassName = color === "violet" ? "text-violet-light" : "text-coral-light";

  if (mounted && !timeLeft) {
    return (
      <p className="text-sm font-semibold text-paper/80">
        Applications for this cohort have closed — apply anyway and we&apos;ll waitlist you for the next one.
      </p>
    );
  }

  const units: { label: string; value: number }[] = [
    { label: "days", value: timeLeft?.days ?? 0 },
    { label: "hrs", value: timeLeft?.hours ?? 0 },
    { label: "min", value: timeLeft?.minutes ?? 0 },
    { label: "sec", value: timeLeft?.seconds ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-coral" />
        </span>
        Applications close in
      </div>
      <div
        className="flex items-end gap-3 font-display text-3xl font-semibold tabular-nums sm:text-4xl"
        suppressHydrationWarning
      >
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-end gap-3">
            <div className="flex flex-col items-center gap-1">
              <Digit value={unit.value} textClassName={textClassName} />
              <span className="text-[0.6rem] font-medium uppercase tracking-wider text-muted-soft">
                {unit.label}
              </span>
            </div>
            {i < units.length - 1 && <span className="pb-4 text-paper/20">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
