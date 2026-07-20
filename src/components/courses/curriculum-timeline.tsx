"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Course } from "@/data/content";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { COLOR_THEME } from "./color-theme";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CurriculumTimeline({
  curriculum,
  color,
}: {
  curriculum: Course["curriculum"];
  color: Course["color"];
}) {
  const theme = COLOR_THEME[color];
  const railRef = useRef<HTMLDivElement>(null);
  const railInView = useInView(railRef, { once: true, margin: "-100px" });

  return (
    <div className="relative">
      <div
        ref={railRef}
        className="absolute left-[27px] top-2 bottom-2 w-px bg-white/10 sm:left-[31px]"
        aria-hidden
      >
        <motion.div
          initial={{ scaleY: 0 }}
          animate={railInView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.4, ease: EASE }}
          style={{ transformOrigin: "top" }}
          className={cn("h-full w-px bg-gradient-to-b", theme.gradient)}
        />
      </div>

      <ol className="relative flex flex-col gap-10 sm:gap-12">
        {curriculum.map((phase, i) => (
          <Reveal key={phase.title} delay={i * 0.12}>
            <li className="relative pl-16 sm:pl-24">
              <span
                className={cn(
                  "font-display absolute left-0 top-0 flex size-14 shrink-0 items-center justify-center rounded-full border text-lg font-semibold sm:size-16 sm:text-xl",
                  theme.border,
                  theme.bgSoft,
                  theme.solidText,
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="rounded-3xl border border-white/10 bg-ink-soft/60 p-6 transition-colors duration-300 hover:bg-ink-elevated sm:p-8">
                <p className={cn("text-xs font-semibold uppercase tracking-[0.18em]", theme.text)}>
                  {phase.phase}
                </p>
                <h3 className="font-display mt-2 text-2xl font-medium tracking-tight text-paper sm:text-3xl">
                  {phase.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                  {phase.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {phase.topics.map((topic) => (
                    <span
                      key={topic}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-tight",
                        theme.chipBorder,
                        theme.chipBg,
                        theme.chipText,
                      )}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
