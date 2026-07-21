"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award } from "lucide-react";
import { AnimatedStatValue } from "./animated-stat-value";
import { parseStatNumber } from "./stat-format";
import { cn } from "@/lib/utils";

type Stat = { value: string; label: string };

// Replaces the old static "2015" hero number. Renders the founding as the
// origin node of a vertical timeline, then threads a line down through
// parentBrand.stats — each one popping in with spring physics and counting
// up as it enters view, so the founding year and the network stats read as
// one continuous "decade of building this" story instead of two disconnected
// facts.
export function OriginNetwork({
  founded,
  founder,
  hq,
  stats,
}: {
  founded: number;
  founder: string;
  hq: string;
  stats: Stat[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <div ref={ref} className="flex flex-col">
      {/* origin node — the founding year */}
      <div className="flex gap-4 sm:gap-5">
        <div className="flex flex-col items-center">
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: "spring", damping: 14, stiffness: 200 }}
            className="relative z-10 flex size-3.5 shrink-0 rounded-full bg-gradient-to-br from-coral to-coral-light shadow-[0_0_0_5px_rgba(255,75,75,0.15)]"
          />
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            style={{ originY: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-px flex-1 bg-gradient-to-b from-coral/50 via-violet/30 to-white/10"
          />
        </div>
        <div className="pb-8">
          <span className="font-display text-gradient block text-5xl font-semibold leading-none sm:text-6xl">
            {founded}
          </span>
          <p className="mt-2 max-w-[16rem] text-xs uppercase tracking-[0.18em] text-muted-soft">
            Founded by {founder} in {hq}
          </p>
        </div>
      </div>

      {/* the network the founding year grew into */}
      {stats.map((stat, i) => {
        const isNumeric = parseStatNumber(stat.value) !== null;
        const isLast = i === stats.length - 1;
        return (
          <div key={stat.label} className="flex gap-4 sm:gap-5">
            <div className="flex flex-col items-center">
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 220,
                  delay: 0.45 + i * 0.16,
                }}
                className={cn(
                  "relative z-10 flex shrink-0 items-center justify-center rounded-full",
                  isNumeric
                    ? "size-2.5 translate-y-1 bg-violet-light"
                    : "mt-0.5 size-6 bg-acid/15 text-acid ring-1 ring-acid/30",
                )}
              >
                {!isNumeric && <Award className="size-3.5" strokeWidth={2.25} />}
              </motion.span>
              {!isLast && (
                <motion.span
                  aria-hidden
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : {}}
                  style={{ originY: 0 }}
                  transition={{ duration: 0.7, delay: 0.55 + i * 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="w-px flex-1 bg-white/10"
                />
              )}
            </div>
            <div className={cn("pb-7", isLast && "pb-0")}>
              <AnimatedStatValue
                value={stat.value}
                delay={0.45 + i * 0.16}
                className="font-display block text-2xl font-semibold text-paper sm:text-3xl"
              />
              <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
