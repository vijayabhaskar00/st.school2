import Link from "next/link";
import { ArrowUpRight, Clock, MonitorSmartphone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { courses } from "@/data/content";
import { cn } from "@/lib/utils";

const colorMap = {
  violet: {
    glow: "bg-violet/25",
    ring: "hover:border-violet/40",
    chip: "border-violet/30 bg-violet/10 text-violet-light",
    text: "text-violet-light",
    line: "from-violet to-violet-light",
  },
  coral: {
    glow: "bg-coral/25",
    ring: "hover:border-coral/40",
    chip: "border-coral/30 bg-coral/10 text-coral-light",
    text: "text-coral-light",
    line: "from-coral to-coral-light",
  },
} as const;

export function ProgramsPreview() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Programs"
            title={
              <>
                Two paths in. <span className="text-gradient">One bar to clear.</span>
              </>
            }
            description="Pick the craft, not just the course — both programs share the same mentor rigor, project depth, and placement support."
          />
          <Reveal delay={0.16} className="shrink-0">
            <Button href="/courses" variant="secondary" className="hidden sm:inline-flex">
              View all programs
            </Button>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {courses.map((course, i) => {
            const c = colorMap[course.color];
            return (
              <Reveal key={course.slug} delay={i * 0.1} className="h-full">
                <Link
                  href={`/courses/${course.slug}`}
                  className={cn(
                    "group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-3xl border border-white/10 bg-ink-soft p-8 transition-all duration-300 hover:-translate-y-1 sm:p-10",
                    c.ring,
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-24 -top-24 size-72 rounded-full blur-[110px] transition-opacity duration-500 group-hover:opacity-100",
                      c.glow,
                    )}
                    aria-hidden
                  />

                  <div className="relative flex flex-col gap-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className={cn("h-1 w-10 rounded-full bg-gradient-to-r", c.line)} />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-soft">
                        {course.level}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <h3 className="font-display text-3xl font-medium leading-tight tracking-tight text-paper sm:text-4xl">
                        {course.shortName}
                      </h3>
                      <p className="max-w-lg text-balance text-base leading-relaxed text-muted">
                        {course.tagline}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 text-sm text-paper/70">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-4" strokeWidth={2} />
                        {course.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MonitorSmartphone className="size-4" strokeWidth={2} />
                        {course.mode}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {course.stack.map((s) => (
                        <span
                          key={s}
                          className={cn(
                            "rounded-full border px-3 py-1 text-xs font-medium",
                            c.chip,
                          )}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span
                    className={cn(
                      "relative inline-flex items-center gap-2 text-sm font-semibold",
                      c.text,
                    )}
                  >
                    View program
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2.5}
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="flex justify-center sm:hidden">
          <Button href="/courses" variant="secondary">
            View all programs
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
