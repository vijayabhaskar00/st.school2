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
import { CourseCrossLink } from "@/components/courses/cross-link-card";
import { ApplyPanel } from "@/components/courses/apply-panel";
import { StickyCtaBar } from "@/components/courses/sticky-cta-bar";
import { CourseIllustration } from "@/components/courses/course-illustration";
import { COLOR_THEME } from "@/components/courses/color-theme";
import { courses, site } from "@/data/content";
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
  // The two programs share this template, so give each a distinct reading
  // rhythm across outcomes / curriculum / highlights — not just a color swap.
  const isAlt = course.color === "coral";
  const illustrationVariant = course.slug === "ui-ux-design" ? "ui-ux" : "python-ai";

  return (
    <>
      {/* a. Detail hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,rgba(124,92,255,0.28),transparent)]" />
          <div
            className={cn(
              "absolute right-[8%] top-[24%] size-96 rounded-full blur-[130px] animate-float [animation-delay:-2s]",
              theme.bgGlow,
            )}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(246,244,251,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(246,244,251,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
        </div>

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
              <CourseIllustration variant={illustrationVariant} color={course.color} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* b. Outcomes */}
      <section className="relative py-20 sm:py-28">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Outcomes"
            title="What you'll walk away able to do"
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

      {/* c. Curriculum timeline */}
      <section className="relative overflow-hidden bg-ink-soft/40 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className={cn("absolute -left-24 top-1/4 size-72 rounded-full blur-[130px] opacity-30", theme.bgGlow)} />
        </div>
        <Container className="flex flex-col gap-14">
          <SectionHeading
            eyebrow="Curriculum"
            title="The roadmap, phase by phase"
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
            title="Built different, on purpose"
          />
          <HighlightGrid
            highlights={course.highlights}
            color={course.color}
            variant={isAlt ? "stagger" : "grid"}
          />
        </Container>
      </section>

      {/* e. Closing CTA */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className={cn("absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] opacity-30", theme.bgGlow)} />
        </div>
        <Container className="flex flex-col items-center gap-6 text-center">
          <Reveal>
            <h2 className="font-display max-w-2xl text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
              Ready to apply for{" "}
              <span className="text-gradient">{course.shortName}?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              Seats are hand-picked, not first-come-first-served. Tell us where
              you&apos;re starting from — the {course.shortName} team will take it
              from there.
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
