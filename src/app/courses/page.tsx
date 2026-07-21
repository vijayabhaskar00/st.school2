import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CourseShowcaseCard } from "@/components/courses/course-showcase-card";
import { TrackMatcher } from "@/components/courses-listing/track-matcher";
import { courses, site } from "@/data/content";

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
          <Reveal delay={0.08}>
            <h1 className="font-display max-w-4xl text-balance text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
              Programs built to get you{" "}
              <span className="text-gradient">hired.</span>
            </h1>
          </Reveal>
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
