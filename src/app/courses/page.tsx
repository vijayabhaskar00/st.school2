import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { CourseShowcaseCard } from "@/components/courses/course-showcase-card";
import { courses, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Programs",
  description: `Explore ${site.name}'s Python Full-Stack + AI and UI/UX Design programs — curriculum, outcomes, and everything it takes to earn one of 33 seats.`,
};

export default function CoursesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,rgba(124,92,255,0.3),transparent)]" />
          <div className="absolute right-[10%] top-[30%] size-80 rounded-full bg-coral/20 blur-[120px] animate-float [animation-delay:-2s]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(246,244,251,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(246,244,251,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
        </div>

        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <Badge>
              <Sparkles className="size-3.5 text-acid" strokeWidth={2.5} />
              {courses.length} programs · {site.city}
            </Badge>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-display mt-8 max-w-3xl text-balance text-[2.5rem] font-medium leading-[1.08] tracking-tight sm:text-6xl">
              Programs built to get you{" "}
              <span className="text-gradient">hired.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              Two hand-built tracks, one standard: real projects, live mentors, and a
              cohort of 33 small enough that nobody falls through the cracks. Pick
              your path below.
            </p>
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
