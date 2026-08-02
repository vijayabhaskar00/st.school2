import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { CourseStatRow } from "@/components/courses/stat-row";
import { StackChips } from "@/components/courses/stack-chips";
import { OutcomeList } from "@/components/courses/outcome-list";
import { CurriculumTimeline } from "@/components/courses/curriculum-timeline";
import { HighlightGrid } from "@/components/courses/highlight-grid";
import { ClassroomGallery } from "@/components/courses/classroom-gallery";
import { CourseCrossLink } from "@/components/courses/cross-link-card";
import { ApplyPanel } from "@/components/courses/apply-panel";
import { StickyCtaBar } from "@/components/courses/sticky-cta-bar";
import { DesignAudit } from "@/components/courses/design-audit";
import { CurriculumBuildStepper } from "@/components/courses/curriculum-build-stepper";
import { AiTerminal } from "@/components/courses/ai-terminal";
import { ProgramEmblem } from "@/components/courses/program-emblem";
import { ClaimCursorAccent } from "@/components/courses/cursor-accent-claim";
import { HeroParallaxGlow } from "@/components/courses/hero-parallax-glow";
import { TiltCard } from "@/components/motion/tilt-card";
import { LazyNeuralPulse } from "@/components/remotion/lazy-neural-pulse";
import { LazyDesignSystemBuild } from "@/components/remotion/lazy-design-system-build";
import { COLOR_THEME } from "@/components/courses/color-theme";
import { courses, site, courseTemplate } from "@/data/content";
import { cn } from "@/lib/utils";

type CourseParams = { slug: string };

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CourseParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    return { title: "Program not found" };
  }

  return {
    title: course.shortName,
    description: course.summary,
    openGraph: {
      title: `${course.name} · ${site.name}`,
      description: course.summary,
      url: `${site.url}/courses/${course.slug}`,
      siteName: site.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.name} · ${site.name}`,
      description: course.summary,
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<CourseParams>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  const otherCourse = courses.find((c) => c.slug !== course.slug) ?? null;
  const theme = COLOR_THEME[course.color];
  // Every program shares this page shell, so give each a distinct reading
  // rhythm across outcomes / curriculum / highlights — not just a color swap.
  const isAlt = course.color === "coral";
  // Which bespoke hero + bonus interactive section this course gets — set
  // explicitly per course in the CMS (Course.template), not guessed from
  // the slug. A course beyond the two bespoke ones gets "generic": a real,
  // on-brand hero (ProgramEmblem) without being force-fit into either the
  // Python or UI/UX template.
  const template = course.template;
  // The closing CTA heading and body are shared, CMS-editable copy (see
  // content/course-template.json) that render on every course's page —
  // each contains a literal "{shortName}" token marking where this
  // course's short name gets substituted in. The heading additionally
  // renders that substituted portion (and anything after it, like the
  // trailing "?") in the accent gradient, matching how this heading was
  // originally hardcoded.
  const [closingCtaHeadingPrefix, closingCtaHeadingSuffix] =
    courseTemplate.closingCtaHeading.split("{shortName}");
  const closingCtaBody = courseTemplate.closingCtaBody.replace("{shortName}", course.shortName);

  return (
    <>
      <ClaimCursorAccent accent={course.color} />
      {/* a. Detail hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
        <HeroParallaxGlow color={course.color} />

        <Container className="flex flex-col gap-10">
          <Reveal>
            <Link
              href="/courses"
              className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-paper/70 transition-colors hover:text-paper"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              All programs
            </Link>
          </Reveal>

          <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <Reveal delay={0.04}>
                  <Badge>
                    <Sparkles className="size-3.5 text-acid" strokeWidth={2.5} />
                    {course.level} · {course.mode}
                  </Badge>
                </Reveal>
                <Reveal delay={0.09}>
                  <h1 className="font-display max-w-xl text-balance text-[2.5rem] font-medium leading-[1.05] tracking-tight sm:text-6xl">
                    {course.name}
                  </h1>
                </Reveal>
                <Reveal delay={0.14}>
                  <p className={cn("max-w-lg text-balance text-lg font-medium leading-snug sm:text-xl", theme.text)}>
                    {course.tagline}
                  </p>
                </Reveal>
                <Reveal delay={0.18}>
                  <p className="max-w-lg text-balance text-base leading-relaxed text-muted sm:text-lg">
                    {course.summary}
                  </p>
                </Reveal>
              </div>

              <Reveal delay={0.22}>
                <CourseStatRow course={course} />
              </Reveal>

              <Reveal delay={0.26}>
                <StackChips stack={course.stack} color={course.color} />
              </Reveal>

              <Reveal delay={0.3}>
                <ApplyPanel course={course} />
              </Reveal>
            </div>

            <Reveal delay={0.35} className="lg:sticky lg:top-28">
              {template === "python-ai" ? (
                <TiltCard>
                  <LazyNeuralPulse className="overflow-hidden rounded-full" />
                  <p className="mt-5 text-center text-xs uppercase tracking-[0.18em] text-muted-soft">
                    Live — a model training, mid-cohort
                  </p>
                </TiltCard>
              ) : template === "ui-ux" ? (
                <TiltCard>
                  <LazyDesignSystemBuild className="overflow-hidden rounded-full" />
                  <p className="mt-5 text-center text-xs uppercase tracking-[0.18em] text-muted-soft">
                    Live — a design system assembling itself, redlines and all
                  </p>
                </TiltCard>
              ) : (
                <TiltCard>
                  <ProgramEmblem course={course} />
                </TiltCard>
              )}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* b. Outcomes */}
      <section className="relative py-20 sm:py-28">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Outcomes"
            title={courseTemplate.outcomesHeading}
            description={`Every ${course.shortName} cohort is built around outcomes you can put on a resume, not a syllabus.`}
            align={isAlt ? "center" : "left"}
          />
          <OutcomeList
            outcomes={course.outcomes}
            color={course.color}
            variant={isAlt ? "grid" : "list"}
          />
        </Container>
      </section>

      {/* b.5 Hands-on moment — different per program, since "try it" means
          something different for each craft. Not every course needs a
          bespoke mini-game though: "generic" skips this section entirely
          rather than being force-fit into the Python or UI/UX version of
          "try it yourself". */}
      {template === "ui-ux" ? (
        <section className="relative py-20 sm:py-28">
          <Container className="flex flex-col gap-12">
            <SectionHeading
              eyebrow="Try it yourself"
              title="Find what's broken. Fix it."
              description="This card has 4 real UX problems — the kind a heuristic review catches. Click the flagged spots to fix each one."
            />
            <Reveal delay={0.1}>
              <DesignAudit />
            </Reveal>
          </Container>
        </section>
      ) : template === "python-ai" ? (
        <section className="relative py-20 sm:py-28">
          <Container className="flex flex-col gap-12">
            <SectionHeading
              eyebrow="Try it yourself"
              title="This is the actual craft."
              description="Pick a prompt below — it streams a real response. This is week-12 territory: wiring AI into a working backend, not just chatting with it."
            />
            <Reveal delay={0.1}>
              <AiTerminal />
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* c. Curriculum timeline */}
      <section className="relative overflow-hidden bg-ink-soft/40 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className={cn("absolute -left-24 top-1/4 size-72 rounded-full blur-[130px] opacity-30", theme.bgGlow)} />
        </div>
        <Container className="flex flex-col gap-14">
          <SectionHeading
            eyebrow="Curriculum"
            title={courseTemplate.roadmapHeading}
            description={`A ${course.duration} path from first principles to a portfolio you can defend in an interview.`}
          />
          <CurriculumTimeline curriculum={course.curriculum} color={course.color} stagger={isAlt} />
        </Container>
      </section>

      {/* d. Highlights */}
      <section className="relative py-20 sm:py-28">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Why this program"
            title={courseTemplate.highlightsHeading}
          />
          <HighlightGrid
            highlights={course.highlights}
            color={course.color}
            variant={isAlt ? "stagger" : "grid"}
          />
        </Container>
      </section>

      {/* d.7 Real classroom photos — UI/UX only for now; a trust-building
          beat right before the closing CTA, not stock photography. */}
      {template === "ui-ux" && (
        <section className="relative py-20 sm:py-28">
          <Container className="flex flex-col gap-12">
            <SectionHeading
              eyebrow="Inside the room"
              title="Real cohorts, real sessions"
              description="Inside a real St.School session — full room, real mentors, no stock photos."
            />
            <ClassroomGallery />
          </Container>
        </section>
      )}

      {/* d.5 The actual build, phase by phase — UI/UX only, replaces a
          generic before/after with the real curriculum driving a mockup
          through the same 4 stages a student's project actually goes
          through, so it's specific to this course, not stock content */}
      {template === "ui-ux" && (
        <section className="relative py-20 sm:py-28">
          <Container className="flex flex-col gap-12">
            <SectionHeading
              eyebrow="The transformation"
              title="Same card. Four weeks apart."
              description="Click through the phases — this is the same project, staged exactly the way your cohort will actually build it."
            />
            <Reveal delay={0.1}>
              <CurriculumBuildStepper curriculum={course.curriculum} />
            </Reveal>
          </Container>
        </section>
      )}

      {/* e. Closing CTA */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className={cn("absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] opacity-30", theme.bgGlow)} />
        </div>
        <Container className="flex flex-col items-center gap-6 text-center">
          <Reveal>
            <h2 className="font-display max-w-2xl text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
              {closingCtaHeadingPrefix}
              {closingCtaHeadingSuffix !== undefined ? (
                <span className="text-gradient">
                  {course.shortName}
                  {closingCtaHeadingSuffix}
                </span>
              ) : null}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              {closingCtaBody}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <Button href="/contact" variant="primary" className="px-7 py-3.5 text-base">
              Apply for this program
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Cross-link to the other program */}
      {otherCourse && (
        <section className="relative pb-24 sm:pb-32">
          <Container>
            <CourseCrossLink course={otherCourse} />
          </Container>
        </section>
      )}

      <StickyCtaBar course={course} />
    </>
  );
}
