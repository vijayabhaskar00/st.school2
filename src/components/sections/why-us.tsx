import { Users, Hammer, Network, UserCheck, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { whyUs } from "@/data/content";
import { cn } from "@/lib/utils";

const icons: LucideIcon[] = [Users, Hammer, Network, UserCheck];

const accents = [
  "from-violet/25 via-violet/5 to-transparent",
  "from-coral/25 via-coral/5 to-transparent",
  "from-acid/20 via-acid/5 to-transparent",
  "from-violet/20 via-coral/10 to-transparent",
];

const iconColors = ["text-violet-light", "text-coral-light", "text-acid", "text-violet-light"];

export function WhyUs() {
  return (
    <section id="why-us" className="relative overflow-hidden bg-ink-soft py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="absolute right-[10%] top-1/4 size-96 rounded-full bg-violet/10 blur-[140px]" />
      </div>

      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Why St.School"
          title={
            <>
              Built small, on purpose —{" "}
              <span className="text-gradient">so it actually works.</span>
            </>
          }
          description="Everything about St.School is designed to resist the thing most bootcamps optimize for: scale. Here's what that trade-off buys you."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
          {whyUs.map((item, i) => {
            const Icon = icons[i % icons.length];
            const isFeatured = i === 0;
            return (
              <Reveal
                key={item.title}
                delay={i * 0.08}
                className={cn(
                  "h-full",
                  isFeatured ? "md:col-span-4" : "md:col-span-2",
                )}
              >
                <div
                  className={cn(
                    "group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-3xl border border-white/10 bg-ink p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 sm:p-9",
                    isFeatured && "sm:flex-row sm:items-end",
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70 transition-opacity duration-500 group-hover:opacity-100",
                      accents[i % accents.length],
                    )}
                    aria-hidden
                  />

                  <div className={cn("relative flex flex-col gap-5", isFeatured && "sm:max-w-md")}>
                    <span
                      className={cn(
                        "flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5",
                        iconColors[i % iconColors.length],
                      )}
                    >
                      <Icon className="size-6" strokeWidth={1.75} />
                    </span>
                    <h3 className="font-display text-2xl font-medium tracking-tight text-paper">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted sm:text-base">
                      {item.description}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "font-display relative select-none text-7xl font-semibold text-white/[0.06] transition-colors duration-500 group-hover:text-white/[0.1] sm:text-8xl",
                      isFeatured ? "self-end" : "self-start",
                    )}
                    aria-hidden
                  >
                    0{i + 1}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
