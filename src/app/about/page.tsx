import type { Metadata } from "next";
import { Sparkles, Building2, CalendarDays, UserRound, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { site, parentBrand, whyUs, process, contact } from "@/data/content";

export const metadata: Metadata = {
  title: "About",
  description: parentBrand.description,
};

export default function AboutPage() {
  return (
    <>
      {/* Intro */}
      <section className="relative overflow-hidden pt-40 pb-24 sm:pt-48 sm:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_50%_at_50%_0%,rgba(255,91,61,0.22),transparent)]" />
          <div className="absolute left-[10%] top-[10%] size-72 rounded-full bg-coral/20 blur-[110px] animate-float" aria-hidden />
          <div className="absolute right-[8%] top-[28%] size-80 rounded-full bg-violet/25 blur-[120px] animate-float [animation-delay:-4s]" aria-hidden />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(246,244,251,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(246,244,251,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
        </div>

        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <Badge>
              <Sparkles className="size-3.5 text-acid" strokeWidth={2.5} />
              About {site.name}
            </Badge>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="font-display mt-8 max-w-4xl text-balance text-[2.5rem] font-medium leading-[1.08] tracking-tight sm:text-6xl">
              A {site.parentBrand} initiative, built to{" "}
              <span className="text-gradient">launch careers, not just courses.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-balance text-lg leading-relaxed text-muted sm:text-xl">
              {site.description}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Brand story */}
      <section className="relative py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-10">
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

          <Reveal delay={0.1} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-elevated p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet/15 text-violet-light">
                <CalendarDays className="size-5" strokeWidth={2.25} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-soft">Founded</p>
                <p className="font-display mt-1 text-lg font-medium text-paper">{parentBrand.founded}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-elevated p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-coral/15 text-coral-light">
                <UserRound className="size-5" strokeWidth={2.25} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-soft">Founder</p>
                <p className="font-display mt-1 text-lg font-medium text-paper">{parentBrand.founder}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-elevated p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-acid/15 text-acid">
                <MapPin className="size-5" strokeWidth={2.25} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-soft">Headquartered</p>
                <p className="font-display mt-1 text-lg font-medium text-paper">{parentBrand.hq}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-elevated p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet/15 text-violet-light">
                <Building2 className="size-5" strokeWidth={2.25} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-soft">Runs as</p>
                <p className="font-display mt-1 text-lg font-medium text-paper">{site.name}</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Stats band */}
      <section className="relative overflow-hidden border-y border-white/10 bg-ink-soft py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(124,92,255,0.12),transparent)]" />
        <Container>
          <div className="grid grid-cols-2 gap-y-12 gap-x-6 sm:grid-cols-4">
            {parentBrand.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08} className="flex flex-col items-center gap-2 text-center">
                <span className="font-display text-gradient text-4xl font-semibold sm:text-5xl">
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

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-ink-elevated p-6 transition-colors hover:border-white/20">
                  <h3 className="font-display text-lg font-medium text-paper">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
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

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-ink-elevated p-6">
                  <span className="font-display text-3xl font-semibold text-muted-soft">{step.step}</span>
                  <h3 className="font-display text-lg font-medium text-paper">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{step.description}</p>
                </div>
              </Reveal>
            ))}
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
