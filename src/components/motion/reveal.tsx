"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Only `div` and `li` are needed today — Reveal defaults to `div`, but a
// couple of call sites (outcome/curriculum lists) render straight into a
// <ul>/<ol> and need their animated wrapper to actually be the <li>,
// otherwise axe's `listitem`/`list` rules fail (an intervening <div> from
// the default motion.div breaks the required ul/ol > li relationship).
const tags = { div: motion.div, li: motion.li } as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: keyof typeof tags;
}) {
  const MotionTag = tags[as];
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      // Vertical-only trigger offset — a single-value margin shrinks the
      // viewport root on all sides, which can push narrow or edge-aligned
      // children entirely outside the horizontal activation window (they'd
      // then stay at `initial` forever, since `once` never re-checks).
      viewport={{ once, margin: "-80px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
