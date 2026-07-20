"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/motion/counter";
import { heroStats, site } from "@/data/content";

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
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,rgba(124,92,255,0.35),transparent)]" />
        <motion.div
          className="absolute left-[8%] top-[18%] size-72 rounded-full bg-violet/30 blur-[100px] animate-float"
          aria-hidden
        />
        <motion.div
          className="absolute right-[6%] top-[38%] size-96 rounded-full bg-coral/25 blur-[120px] animate-float [animation-delay:-3s]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(246,244,251,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(246,244,251,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
      </div>

      <Container className="flex flex-col items-center text-center">
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
          className="font-display mt-8 max-w-4xl text-balance text-[2.75rem] font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Turn ambition into{" "}
          <span className="text-gradient">employable skill.</span>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-7 max-w-2xl text-balance text-lg leading-relaxed text-muted sm:text-xl"
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
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
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
          className="mt-20 grid w-full max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-10"
        >
          {heroStats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="font-display text-3xl font-semibold text-paper sm:text-4xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-xs text-muted sm:text-sm">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
