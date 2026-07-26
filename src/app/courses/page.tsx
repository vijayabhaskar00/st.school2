import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CourseShowcaseCard } from "@/components/courses/course-showcase-card";
import { StaggerHeadline } from "@/components/about/stagger-headline";
import { TrackFork } from "@/components/courses-listing/track-fork";
import { TrackMatcher } from "@/components/courses-listing/track-matcher";
import { HeroParallaxGlow } from "@/components/courses-listing/hero-parallax-glow";
import { courses, site, coursesPage } from "@/data/content";

// The page's opening line, word-staggered by the same <StaggerHeadline> the
// About hero uses (it renders the <h1> itself, so it drops straight in).
const headlineWords = [
  ...coursesPage.headingPrefix.split(" ").map((text) => ({ text })),
  ...coursesPage.headingHighlight.split(" ").map((text) => ({ text, highlight: true })),
];

export const metadata: Metadata = {
  title: "Programs",
  description: `Explore ${site.name}'s Python Full-Stack + AI and UI/UX Design programs — curriculum, outcomes, and everything it takes to earn one of 33 seats.`,
};

export default function CoursesPage() {
  return (
    <>
      {/* Editorial masthead — left-aligned, no badge pill, rule-framed meta row */}
      <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24">
        <HeroParallaxGlow />

        <Container className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="flex flex-col gap-8">
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-6">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-soft">
                  {coursesPage.eyebrow}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-soft">
                  {site.city} · {courses.length} tracks
                </span>
              </div>
            </Reveal>
            {/* leading-[0.98] + the per-word overflow-hidden masks would clip
                the descenders in "Programs"/"get"/"you" at these sizes (the
                mask box is exactly one line-height tall), so the line-height
                is nudged to 1.02 and the masks get extra bottom padding —
                cancelled again with a matching negative margin so the taller
                paint area doesn't loosen the line spacing. Both are set from
                here rather than in the shared component so the About hero,
                which runs at a smaller size and a roomier line-height, is
                untouched. Sized down from the old full-bleed lg:text-8xl now
                that the hero shares its row with a visual, matching how
                every other two-column hero on the site caps its headline
                size. */}
            <StaggerHeadline
              words={headlineWords}
              className="font-display max-w-xl text-balance text-5xl font-medium leading-[1.02] tracking-tight [&>span]:-mb-3 [&>span]:pb-3 sm:text-6xl lg:text-7xl"
            />
            <Reveal delay={0.14}>
              <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
                {coursesPage.intro}
              </p>
            </Reveal>
          </div>

          {/* The one hero on the site without a visual companion — every other
              page pairs its headline with something (SelectionField on the
              homepage, OriginNetwork on About, SeatsGauge on Contact, a
              bespoke Remotion piece per course detail page). This fills that
              gap with a real, data-driven diagram instead of decoration. */}
          <Reveal delay={0.18}>
            <TrackFork courses={courses} />
          </Reveal>
        </Container>
      </section>

      <section className="relative pb-20 sm:pb-28">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={coursesPage.matcherEyebrow}
            title={
              <>
                {coursesPage.matcherHeadingPrefix}{" "}
                <span className="text-gradient">{coursesPage.matcherHeadingHighlight}</span>
              </>
            }
            description={coursesPage.matcherDescription}
          />
          <Reveal delay={0.1}>
            <TrackMatcher courses={courses} />
          </Reveal>
        </Container>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <Container className="flex flex-col gap-10 sm:gap-14">
          {courses.map((course, i) => (
            <CourseShowcaseCard key={course.slug} course={course} reverse={i % 2 === 1} />
          ))}
        </Container>
      </section>
    </>
  );
}
