"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// Past this fraction of seats claimed, the bar switches from the course's
// normal theme color to the site's coral urgency tone and gets a slow pulse
// — a soft "this is nearly gone" signal rather than a hard alarm.
const URGENCY_THRESHOLD = 0.85;

export function SeatsProgress({
  claimed,
  total,
  color,
}: {
  claimed: number;
  total: number;
  color: "violet" | "coral";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });
  const reduceMotion = useReducedMotion();
  const pct = Math.min(100, Math.round((claimed / total) * 100));
  const remaining = Math.max(0, total - claimed);
  const isUrgent = total > 0 && claimed / total >= URGENCY_THRESHOLD;

  const barGradient = isUrgent
    ? "from-coral via-coral to-coral-light"
    : color === "violet"
      ? "from-violet-dark via-violet to-violet-light"
      : "from-coral to-coral-light";

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-paper">
          {claimed} of {total} seats claimed
        </span>
        <span className={cn("font-medium", isUrgent ? "text-coral-light" : "text-muted")}>
          only {remaining} left
        </span>
      </div>
      <motion.div
        className={cn(
          "h-2 w-full overflow-hidden rounded-full bg-white/10",
          isUrgent && "shadow-[0_0_10px_-1px_var(--color-coral)]",
        )}
        animate={isUrgent && !reduceMotion ? { opacity: [1, 0.8, 1] } : { opacity: 1 }}
        transition={
          isUrgent && !reduceMotion
            ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0 }
        }
      >
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", barGradient)}
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${pct}%` : 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </div>
  );
}
