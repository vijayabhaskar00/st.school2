import { Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { testimonials } from "@/data/content";
import { cn } from "@/lib/utils";

const gradients = [
  "from-violet to-violet-dark",
  "from-coral to-coral-light",
  "from-acid to-acid-dark",
  "from-violet-light to-coral",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-ink-soft py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="From the cohort"
          title={
            <>
              Don&apos;t take our word — <span className="text-gradient">take theirs.</span>
            </>
          }
          description="Students from batches that were hand-picked out of thousands of applicants."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="h-full">
              <figure className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-3xl border border-white/10 bg-ink p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 sm:p-9">
                <Quote
                  className="size-8 text-white/10 transition-colors duration-300 group-hover:text-violet/40"
                  strokeWidth={1.5}
                />
                <blockquote className="text-balance text-lg leading-relaxed text-paper/90 sm:text-xl">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-ink",
                      gradients[i % gradients.length],
                    )}
                  >
                    {initials(t.name)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-paper">{t.name}</span>
                    <span className="text-xs text-muted">{t.role}</span>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
