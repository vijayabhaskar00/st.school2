"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const pct = Math.min(100, Math.round((claimed / total) * 100));
  const remaining = Math.max(0, total - claimed);

  const barGradient = color === "violet" ? "from-violet-dark via-violet to-violet-light" : "from-coral to-coral-light";

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-paper">
          {claimed} of {total} seats claimed
        </span>
        <span className="font-medium text-muted">only {remaining} left</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", barGradient)}
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${pct}%` : 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
