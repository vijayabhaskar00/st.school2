"use client";

import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/motion/counter";
import { TiltCard } from "@/components/motion/tilt-card";
import { heroStats, site } from "@/data/content";

const SelectionFieldPlayer = dynamic(
  () => import("@/components/remotion/selection-field-player").then((m) => m.SelectionFieldPlayer),
  {
    ssr: false,
    loading: () => (
      <div
        className="aspect-square w-full animate-pulse rounded-full border border-white/10 bg-ink-elevated/60"
        aria-hidden="true"
      />
    ),
  },
);

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.1 + i * 0.1, ease: EASE },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,rgba(124,92,255,0.28),transparent)]" />
        <motion.div
          className="absolute right-[4%] top-[8%] size-80 rounded-full bg-coral/15 blur-[130px] animate-float"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(246,244,251,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(246,244,251,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
      </div>

      <Container className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="flex flex-col items-start text-left">
          <motion.div
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-paper/80 backdrop-blur-sm"
          >
            <Sparkles className="size-3.5 text-acid" strokeWidth={2.5} />
            A {site.parentBrand} initiative · {site.city}
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="font-display mt-8 max-w-xl text-balance text-[2.5rem] font-medium leading-[1.05] tracking-tight sm:text-6xl"
          >
            Turn ambition into{" "}
            <span className="text-gradient">employable skill.</span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-7 max-w-lg text-balance text-lg leading-relaxed text-muted"
          >
            Python Full-Stack + AI and UI/UX Design programs — real projects, live
            mentorship, and a hand-picked cohort of 33. No fluff, no filler,
            just the work that gets you hired.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <Button href="/courses" variant="primary" className="px-7 py-3.5 text-base">
              Explore Programs
            </Button>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-2 py-3.5 text-base font-semibold text-paper/85 transition-colors hover:text-paper"
            >
              Apply for a seat
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-16 grid w-full max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-start gap-1">
                <span className="font-display text-2xl font-semibold text-paper sm:text-3xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-xs text-muted sm:text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="relative"
        >
          <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-violet/20 via-transparent to-coral/20 blur-2xl" />
          <TiltCard intensity={10}>
            <SelectionFieldPlayer className="overflow-hidden rounded-full" />
          </TiltCard>
          <p className="mt-5 text-center text-xs uppercase tracking-[0.18em] text-muted-soft">
            1,000+ apply. 33 selected. 95% placed.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
