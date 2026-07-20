import { Sparkle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/motion/marquee";
import { Reveal } from "@/components/motion/reveal";
import { trustLogos } from "@/data/content";

export function TrustMarquee() {
  return (
    <section className="relative border-y border-white/10 bg-ink-soft py-10 sm:py-12">
      <Container>
        <Reveal className="mb-6 flex items-center justify-center">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-soft">
            Backed by the network behind{" "}
            <span className="text-muted">1M+</span> students
          </p>
        </Reveal>
      </Container>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink-soft to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink-soft to-transparent sm:w-32" />

        <Marquee>
          {trustLogos.map((logo) => (
            <div
              key={logo}
              className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold tracking-tight text-paper/70 transition-colors hover:border-white/20 hover:text-paper"
            >
              <Sparkle className="size-3.5 text-acid" strokeWidth={2.5} />
              <span className="font-display whitespace-nowrap">{logo}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
