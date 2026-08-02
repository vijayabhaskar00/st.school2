"use client";

import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { assetBasePath } from "@/lib/base-path";

export function MascotBanner() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <Container className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
        <Reveal className="order-2 flex flex-col items-start gap-6 lg:order-1">
          <h2 className="font-display max-w-lg text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
            Could be you, <span className="text-gradient">33 seats from now.</span>
          </h2>
          <p className="max-w-md text-balance text-base leading-relaxed text-muted sm:text-lg">
            No lecture halls, no filler. Just a hand-picked cohort building the kind of
            work that gets you hired — starting the day you get selected.
          </p>
          <Button href="/courses" variant="primary" className="px-7 py-3.5 text-base">
            Explore Programs
          </Button>
        </Reveal>

        <Reveal delay={0.12} className="relative order-1 mx-auto w-full max-w-sm lg:order-2">
          <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-gradient-to-br from-coral/25 via-transparent to-violet/20 blur-3xl" />
          <Image
            src={`${assetBasePath}/images/mascot/homepage.webp`}
            alt="A St.School student, confident and ready to build"
            width={928}
            height={1152}
            className="mx-auto h-auto w-full max-w-[22rem]"
            priority={false}
          />
        </Reveal>
      </Container>
    </section>
  );
}
