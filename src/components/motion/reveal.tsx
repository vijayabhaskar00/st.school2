"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  return (
    <motion.div
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
    </motion.div>
  );
}
