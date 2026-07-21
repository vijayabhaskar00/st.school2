"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award } from "lucide-react";
import { AnimatedStatValue } from "./animated-stat-value";
import { parseStatNumber } from "./stat-format";
import { cn } from "@/lib/utils";

type Stat = { value: string; label: string };

// The recap of parentBrand.stats further down the page (the old flat
// typography strip). Deliberately a different shape from OriginNetwork's
// vertical timeline above — a horizontal thread that draws left-to-right
// behind a row of markers, so the same four numbers don't just repeat the
// same visualization twice.
export function StatsThread({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <div ref={ref} className="relative">
      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
        className="pointer-events-none absolute inset-x-0 top-[0.3rem] hidden h-px bg-gradient-to-r from-coral/50 via-violet/40 to-transparent sm:block"
      />

      <div className="flex snap-x snap-mandatory gap-10 overflow-x-auto pb-2 sm:gap-0 sm:divide-x sm:divide-white/10 sm:overflow-visible sm:pb-0">
        {stats.map((stat, i) => {
          const isNumeric = parseStatNumber(stat.value) !== null;
          return (
            <div
              key={stat.label}
              className="flex shrink-0 snap-start flex-col gap-3 sm:flex-1 sm:px-6 sm:first:pl-0 sm:last:pr-0"
            >
              <motion.span
                aria-hidden
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ type: "spring", damping: 12, stiffness: 220, delay: 0.3 + i * 0.12 }}
                className={cn(
                  "flex items-center justify-center rounded-full",
                  isNumeric
                    ? "size-2 ring-4 ring-ink-soft"
                    : "size-5 bg-acid/15 text-acid ring-4 ring-ink-soft",
                  isNumeric && (i % 2 === 0 ? "bg-coral" : "bg-violet-light"),
                )}
              >
                {!isNumeric && <Award className="size-3" strokeWidth={2.25} />}
              </motion.span>
              <AnimatedStatValue
                value={stat.value}
                delay={0.3 + i * 0.12}
                className="font-display text-gradient text-4xl font-semibold leading-none sm:text-5xl"
              />
              <span className="max-w-[12rem] text-xs text-muted sm:text-sm">{stat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
