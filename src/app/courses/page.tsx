import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CourseShowcaseCard } from "@/components/courses/course-showcase-card";
import { StaggerHeadline } from "@/components/about/stagger-headline";
import { TrackMatcher } from "@/components/courses-listing/track-matcher";
import { courses, site } from "@/data/content";

// The page's opening line, word-staggered by the same <StaggerHeadline> the
// About hero uses (it renders the <h1> itself, so it drops straight in).
const headlineWords = [
  { text: "Programs" },
  { text: "built" },
  { text: "to" },
  { text: "get" },
  { text: "you" },
  { text: "hired.", highlight: true },
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
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,rgba(124,92,255,0.3),transparent)]" />
          <div className="absolute right-[10%] top-[30%] size-80 rounded-full bg-coral/20 blur-[120px] animate-float [animation-delay:-2s]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(246,244,251,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(246,244,251,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
        </div>

        <Container className="flex flex-col gap-8">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-6">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-soft">
                St.School Programs
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-soft">
                {site.city} · {courses.length} tracks
              </span>
            </div>
          </Reveal>
          {/* leading-[0.98] + the per-word overflow-hidden masks would clip the
              descenders in "Programs"/"get"/"you" at these sizes (the mask box
              is exactly one line-height tall), so the line-height is nudged to
              1.02 and the masks get extra bottom padding — cancelled again with
              a matching negative margin so the taller paint area doesn't loosen
              the line spacing. Both are set from here rather than in the shared
              component so the About hero, which runs at a smaller size and a
              roomier line-height, is untouched. */}
          <StaggerHeadline
            words={headlineWords}
            className="font-display max-w-4xl text-balance text-5xl font-medium leading-[1.02] tracking-tight [&>span]:-mb-3 [&>span]:pb-3 sm:text-7xl lg:text-8xl"
          />
          <Reveal delay={0.14}>
            <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              Two hand-built tracks, one standard: real projects, live mentors, and a
              cohort of 33 small enough that nobody falls through the cracks. Pick
              your path below.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="relative pb-20 sm:pb-28">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Not sure which track?"
            title={
              <>
                Answer 4 quick picks.{" "}
                <span className="text-gradient">See which track fits.</span>
              </>
            }
            description="Every option below is pulled straight from each program's real stack, outcomes, and curriculum — not a generic quiz."
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
