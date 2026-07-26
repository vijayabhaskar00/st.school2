"use client";

import { Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { site, heroStats } from "@/data/content";

export function FinalCTA() {
  const reduceMotion = useReducedMotion();

  // Static mid-point of the breathing loop below — used verbatim (no
  // animate loop) when reduced motion is on, so the section still reads as
  // "glowing" rather than snapping back to a flatter default.
  const staticBreath = { scale: 1.04, opacity: 0.85 };

  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-ink-soft px-6 py-20 text-center sm:px-16 sm:py-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(124,92,255,0.35),transparent)]"
              initial={false}
              animate={
                reduceMotion ? staticBreath : { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }
              }
              transition={
                reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }
              }
            />
            {/* Positioning (left-1/2 + -translate-x-1/2) lives on this static
                wrapper — animating scale on the same element as a Tailwind
                translate class would let Framer Motion's inline transform
                clobber the centering, so the breathing motion is isolated
                to an inset-0 child instead. */}
            <div className="absolute -bottom-32 left-1/2 h-72 w-[36rem] -translate-x-1/2">
              <motion.div
                className="absolute inset-0 rounded-full bg-coral/25 blur-[130px]"
                initial={false}
                animate={
                  reduceMotion ? staticBreath : { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(246,244,251,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(246,244,251,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,black,transparent)]" />
          </div>

          <Reveal className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-paper/80 backdrop-blur-sm">
              <Sparkles className="size-3.5 text-acid" strokeWidth={2.5} />
              Applications open now
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="font-display mx-auto mt-8 max-w-3xl text-balance text-4xl font-medium leading-[1.05] tracking-tight text-paper sm:text-6xl">
              {heroStats[1].value} seats. <span className="text-gradient">One cohort.</span>{" "}
              Your move.
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              {site.description}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/contact" variant="primary" className="px-8 py-3.5 text-base">
                {site.ctaLabel}
              </Button>
              <Button href="/courses" variant="secondary" className="px-8 py-3.5 text-base">
                View Programs
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
