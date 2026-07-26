import type { Metadata } from "next";
import { Building2, UserRound, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { OriginNetwork } from "@/components/about/origin-network";
import { StatsThread } from "@/components/about/stats-thread";
import { ProcessProgressLine } from "@/components/about/process-progress-line";
import { StaggerHeadline } from "@/components/about/stagger-headline";
import { HeroParallaxGlow } from "@/components/about/hero-parallax-glow";
import { WhyUsRow } from "@/components/about/why-us-row";
import { GlowBorderPanel } from "@/components/about/glow-border-panel";
import { site, parentBrand, whyUs, process, contact, aboutPage } from "@/data/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: parentBrand.description,
};

const headlineWords = [
  ...aboutPage.heroQuotePrefix
    .replace("{parentBrand}", site.parentBrand)
    .split(" ")
    .map((text) => ({ text })),
  ...aboutPage.heroQuoteHighlight.split(" ").map((text) => ({ text, highlight: true })),
];

export default function AboutPage() {
  return (
    <>
      {/* Intro — asymmetric: pull-quote headline against an oversized founding year */}
      <section className="relative overflow-hidden pt-40 pb-24 sm:pt-48 sm:pb-32">
        <HeroParallaxGlow />

        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-10">
            <div>
              <Reveal>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-soft">
                  {aboutPage.heroEyebrowPrefix} {site.name}
                </span>
              </Reveal>
              <StaggerHeadline
                words={headlineWords}
                className="font-display mt-6 max-w-2xl text-balance text-4xl font-medium leading-[1.12] tracking-tight sm:text-6xl lg:text-[3.6rem]"
              />
              <Reveal delay={0.16}>
                <p className="mt-8 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
                  {site.description}
                </p>
              </Reveal>
            </div>

            <Reveal
              delay={0.14}
              className="border-t border-white/10 pt-8 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0"
            >
              <OriginNetwork
                founded={parentBrand.founded}
                founder={parentBrand.founder}
                hq={parentBrand.hq}
                stats={parentBrand.stats}
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Brand story */}
      <section className="relative py-24 sm:py-32">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow={aboutPage.storyEyebrow}
            title={
              <>
                {aboutPage.storyHeadingPrefix}{" "}
                <span className="text-gradient">{aboutPage.storyHeadingHighlight}</span>
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
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(224,33,43,0.12),transparent)]" />
        <Container>
          <StatsThread stats={parentBrand.stats} />
        </Container>
      </section>

      {/* Why we exist */}
      <section className="relative py-24 sm:py-32">
        <Container className="flex flex-col gap-14">
          <SectionHeading
            eyebrow={aboutPage.whyEyebrow}
            title={
              <>
                {aboutPage.whyHeadingPrefix}{" "}
                <span className="text-gradient">{aboutPage.whyHeadingHighlight}</span>
              </>
            }
            description={aboutPage.whyDescription}
          />

          <div className="flex flex-col divide-y divide-white/10 border-t border-white/10">
            {whyUs.map((item, i) => (
              <WhyUsRow
                key={item.title}
                index={i}
                title={item.title}
                description={item.description}
                reverse={i % 2 === 1}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* How we work / process */}
      <section className="relative py-24 sm:py-32">
        <Container className="flex flex-col gap-14">
          <SectionHeading
            eyebrow={aboutPage.processEyebrow}
            title={
              <>
                {aboutPage.processHeadingPrefix}{" "}
                <span className="text-gradient">{aboutPage.processHeadingHighlight}</span>
              </>
            }
            description={aboutPage.processDescription}
          />

          <div className="flex flex-col gap-3">
            <ProcessProgressLine />
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
                  <TiltCard intensity={8} className="h-full">
                    <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-ink-elevated p-6 transition-colors duration-300 hover:border-white/20">
                      <span className="font-display text-3xl font-semibold text-muted-soft">{step.step}</span>
                      <h3 className="font-display text-lg font-medium text-paper">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-muted">{step.description}</p>
                    </div>
                  </TiltCard>
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
            <GlowBorderPanel className="bg-ink-elevated px-8 py-16 text-center sm:px-16 sm:py-20">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_80%_at_50%_0%,rgba(224,33,43,0.3),transparent)]" />
              <div className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-coral/20 blur-[110px]" aria-hidden />

              <h2 className="font-display mx-auto max-w-2xl text-balance text-3xl font-medium leading-[1.1] tracking-tight text-paper sm:text-4xl">
                {aboutPage.ctaHeading}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
                Explore the programs, or go straight to the application — {contact.email} is
                always open if you have questions first.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button href="/courses" variant="primary" className="px-7 py-3.5 text-base">
                  {aboutPage.ctaExploreLabel}
                </Button>
                <Button href="/contact" variant="secondary" className="px-7 py-3.5 text-base">
                  {aboutPage.ctaApplyLabel}
                </Button>
              </div>
            </GlowBorderPanel>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
