"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { process } from "@/data/content";
import { cn } from "@/lib/utils";

// The number badge next to each step "activates" (muted -> brand color +
// glow) as the scroll-drawn timeline line reaches it, so the line reads as
// powering each step rather than just sitting next to an independently
// revealed card. `progress` is the same spring-driven motion value that
// drives the line's scaleY — step i activates as it crosses (i+1)/total.
function ProcessStepMarker({
  stepNumber,
  index,
  total,
  progress,
  reduceMotion,
}: {
  stepNumber: number | string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const start = Math.max(0, index / total - 0.08);
  const end = (index + 1) / total;
  const activation = useTransform(progress, [start, end], [0, 1]);
  const background = useTransform(activation, [0, 1], ["#212124", "#ff4b4b"]);
  const borderColor = useTransform(activation, [0, 1], ["rgba(255,255,255,0.15)", "rgba(255,75,75,0.9)"]);
  const glowOpacity = useTransform(activation, [0, 1], [0, 1]);

  if (reduceMotion) {
    return (
      <span className="font-display absolute left-0 z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-coral bg-coral text-sm font-semibold text-paper shadow-[0_0_0_6px_var(--color-ink)] md:left-1/2 md:-translate-x-1/2">
        {stepNumber}
      </span>
    );
  }

  return (
    <motion.span
      style={{ background, borderColor }}
      className="font-display absolute left-0 z-10 flex size-12 shrink-0 items-center justify-center rounded-full border text-sm font-semibold text-paper shadow-[0_0_0_6px_var(--color-ink)] md:left-1/2 md:-translate-x-1/2"
    >
      <motion.span
        aria-hidden
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute inset-[-6px] rounded-full bg-coral/50 blur-md"
      />
      <span className="relative">{stepNumber}</span>
    </motion.span>
  );
}

export function Process() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const reduceMotion = useReducedMotion();

  return (
    <section id="process" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/8 blur-[160px]" />
      </div>

      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="The process"
          align="center"
          title={
            <>
              From application to <span className="text-gradient">offer letter.</span>
            </>
          }
          description="Five stages, one bar. Every cohort moves through the same rigor — no shortcuts, no skipped steps."
          className="mx-auto items-center text-center"
        />

        <div ref={trackRef} className="relative mx-auto w-full max-w-4xl">
          <div className="absolute left-6 top-0 h-full w-px bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <motion.div
              style={{ scaleY: progress }}
              className="absolute inset-0 origin-top bg-gradient-to-b from-violet via-coral to-acid"
            />
          </div>

          <div className="flex flex-col gap-10 md:gap-14">
            {process.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={step.step}
                  className={cn(
                    "relative grid grid-cols-1 md:grid-cols-2 md:items-center md:gap-x-14",
                  )}
                >
                  <ProcessStepMarker
                    stepNumber={step.step}
                    index={i}
                    total={process.length}
                    progress={progress}
                    reduceMotion={reduceMotion}
                  />

                  <Reveal
                    delay={i * 0.05}
                    className={cn(
                      "pl-20 md:pl-0",
                      isEven ? "md:col-start-1 md:pr-16 md:text-right" : "md:col-start-2 md:pl-16",
                    )}
                  >
                    <div
                      className={cn(
                        "group rounded-2xl border border-white/10 bg-ink-soft p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 sm:p-7",
                      )}
                    >
                      <h3 className="font-display text-xl font-medium tracking-tight text-paper sm:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </Reveal>

                  <div className={cn("hidden md:block", isEven ? "md:col-start-2" : "md:col-start-1 md:row-start-1")} />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
