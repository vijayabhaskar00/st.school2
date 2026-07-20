import type { Metadata } from "next";
import { Building2, UserRound, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { site, parentBrand, whyUs, process, contact } from "@/data/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: parentBrand.description,
};

export default function AboutPage() {
  return (
    <>
      {/* Intro — asymmetric: pull-quote headline against an oversized founding year */}
      <section className="relative overflow-hidden pt-40 pb-24 sm:pt-48 sm:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_50%_at_50%_0%,rgba(255,91,61,0.22),transparent)]" />
          <div className="absolute left-[10%] top-[10%] size-72 rounded-full bg-coral/20 blur-[110px] animate-float" aria-hidden />
          <div className="absolute right-[8%] top-[28%] size-80 rounded-full bg-violet/25 blur-[120px] animate-float [animation-delay:-4s]" aria-hidden />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(246,244,251,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(246,244,251,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
        </div>

        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-10">
            <div>
              <Reveal>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-soft">
                  About {site.name}
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="font-display mt-6 max-w-2xl text-balance text-4xl font-medium leading-[1.12] tracking-tight sm:text-6xl lg:text-[3.6rem]">
                  &ldquo;A {site.parentBrand} initiative, built to{" "}
                  <span className="text-gradient">launch careers, not just courses.</span>&rdquo;
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-8 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
                  {site.description}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.14} className="flex flex-col items-start gap-3 border-t border-white/10 pt-6 lg:items-end lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0 lg:text-right">
              <span className="font-display text-gradient text-[5rem] font-semibold leading-none sm:text-[7rem] lg:text-[6.5rem]">
                {parentBrand.founded}
              </span>
              <p className="max-w-[16rem] text-xs uppercase tracking-[0.18em] text-muted-soft">
                Founded by {parentBrand.founder} in {parentBrand.hq}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Brand story */}
      <section className="relative py-24 sm:py-32">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="The story"
            title={
              <>
                Everything St.School runs on{" "}
                <span className="text-gradient">Student Tribe&apos;s decade of work.</span>
              </>
            }
            description={parentBrand.description}
          />

          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-6 text-sm">
              <span className="flex items-center gap-2.5 text-paper/85">
                <UserRound className="size-4 text-violet-light" strokeWidth={2.25} />
                Founded by <span className="font-medium text-paper">{parentBrand.founder}</span>
              </span>
              <span className="flex items-center gap-2.5 text-paper/85">
                <MapPin className="size-4 text-coral-light" strokeWidth={2.25} />
                Headquartered in <span className="font-medium text-paper">{parentBrand.hq}</span>
              </span>
              <span className="flex items-center gap-2.5 text-paper/85">
                <Building2 className="size-4 text-acid" strokeWidth={2.25} />
                Runs today as <span className="font-medium text-paper">{site.name}</span>
              </span>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Stats band — horizontal strip, alternating scale for rhythm instead of a uniform grid */}
      <section className="relative overflow-hidden border-y border-white/10 bg-ink-soft py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(124,92,255,0.12),transparent)]" />
        <Container>
          <div className="flex snap-x snap-mandatory gap-10 overflow-x-auto pb-2 sm:gap-0 sm:divide-x sm:divide-white/10 sm:overflow-visible sm:pb-0">
            {parentBrand.stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 0.08}
                className={cn(
                  "flex shrink-0 snap-start flex-col gap-2 sm:flex-1 sm:px-6 sm:first:pl-0 sm:last:pr-0",
                  i % 2 === 0 ? "sm:pb-0" : "sm:pt-8",
                )}
              >
                <span
                  className={cn(
                    "font-display text-gradient font-semibold leading-none",
                    i % 2 === 0 ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl",
                  )}
                >
                  {stat.value}
                </span>
                <span className="max-w-[12rem] text-xs text-muted sm:text-sm">{stat.label}</span>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Why we exist */}
      <section className="relative py-24 sm:py-32">
        <Container className="flex flex-col gap-14">
          <SectionHeading
            eyebrow="Why we exist"
            title={
              <>
                We turn away more students than{" "}
                <span className="text-gradient">we accept. On purpose.</span>
              </>
            }
            description="Student Tribe built the network — 1M+ students, 500+ campuses, a decade of hiring relationships. St.School exists to funnel that network into a small, mentor-dense cohort instead of a mass-market course."
          />

          <div className="flex flex-col divide-y divide-white/10 border-t border-white/10">
            {whyUs.map((item, i) => {
              const alt = i % 2 === 1;
              return (
                <Reveal key={item.title} delay={i * 0.07}>
                  <div
                    className={cn(
                      "group flex flex-col gap-4 py-8 transition-colors sm:flex-row sm:items-center sm:gap-10",
                      alt && "sm:flex-row-reverse",
                    )}
                  >
                    <span className="font-display shrink-0 text-3xl font-semibold text-muted-soft transition-colors group-hover:text-violet-light sm:w-24 sm:text-4xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-display text-xl font-medium text-paper sm:text-2xl">{item.title}</h3>
                      <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* How we work / process */}
      <section className="relative py-24 sm:py-32">
        <Container className="flex flex-col gap-14">
          <SectionHeading
            eyebrow="How we operate"
            title={
              <>
                From application to offer letter —{" "}
                <span className="text-gradient">five deliberate steps.</span>
              </>
            }
            description="The same process runs for every cohort, every program. It's designed to keep the bar high and the attention per student even higher."
          />

          <div className="flex flex-col gap-3">
            <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 sm:gap-6 lg:overflow-visible lg:pb-0">
              {process.map((step, i) => (
                <Reveal
                  key={step.step}
                  delay={i * 0.08}
                  className={cn(
                    "w-[15rem] shrink-0 snap-start sm:w-[16rem] lg:w-auto lg:flex-1",
                    i % 2 === 1 && "lg:mt-10",
                  )}
                >
                  <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-ink-elevated p-6">
                    <span className="font-display text-3xl font-semibold text-muted-soft">{step.step}</span>
                    <h3 className="font-display text-lg font-medium text-paper">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{step.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="text-xs text-muted-soft lg:hidden">Swipe to see the full process →</p>
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="relative pb-28 sm:pb-36">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-elevated px-8 py-16 text-center sm:px-16 sm:py-20">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_80%_at_50%_0%,rgba(124,92,255,0.3),transparent)]" />
              <div className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-coral/20 blur-[110px]" aria-hidden />

              <h2 className="font-display mx-auto max-w-2xl text-balance text-3xl font-medium leading-[1.1] tracking-tight text-paper sm:text-4xl">
                Ready to see if you&apos;re one of the 33?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
                Explore the programs, or go straight to the application — {contact.email} is
                always open if you have questions first.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button href="/courses" variant="primary" className="px-7 py-3.5 text-base">
                  Explore Programs
                </Button>
                <Button href="/contact" variant="secondary" className="px-7 py-3.5 text-base">
                  Apply for a seat
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
