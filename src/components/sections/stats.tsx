import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { stats } from "@/data/content";
import { cn } from "@/lib/utils";

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="absolute -left-24 top-1/3 size-72 rounded-full bg-violet/15 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 size-80 rounded-full bg-coral/10 blur-[130px]" />
      </div>

      <Container>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="h-full">
              <div
                className={cn(
                  "group relative flex h-full flex-col justify-between gap-6 bg-ink-soft p-8 transition-colors duration-300 hover:bg-ink-elevated sm:p-9",
                )}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(120px 120px at 20% 0%, rgba(224,33,43,0.18), transparent)",
                  }}
                  aria-hidden
                />
                <span className="font-display relative text-4xl font-semibold tracking-tight text-paper sm:text-5xl">
                  <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </span>
                <div className="relative flex flex-col gap-2">
                  <p className="text-sm font-semibold text-paper/90 sm:text-base">
                    {stat.label}
                  </p>
                  <p className="text-sm leading-relaxed text-muted">{stat.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
