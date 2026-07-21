"use client";

// A real, data-driven "which track fits you" quiz for the /courses listing
// page. Every question option and every field shown in the live result
// panel is read straight off the two `Course` records in
// src/data/content.ts (stack, outcomes, highlights, curriculum, seats) —
// nothing here is fabricated copy.

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCircle2, Flame, Sparkles } from "lucide-react";
import type { Course } from "@/data/content";
import { cn } from "@/lib/utils";
import { COLOR_THEME } from "@/components/courses/color-theme";
import { StackChips } from "@/components/courses/stack-chips";
import { Button } from "@/components/ui/button";

type Option = {
  courseSlug: string;
  courseColor: Course["color"];
  tag: string;
  label: string;
};

type Question = {
  id: string;
  prompt: string;
  options: [Option, Option];
};

/** Index into an array safely, falling back to the first item — keeps this
 * generic against any future edit to content.ts without ever inventing data. */
function at<T>(arr: T[], i: number): T {
  return arr[i] ?? arr[0];
}

function buildQuestions(courseA: Course, courseB: Course): Question[] {
  return [
    {
      id: "stack",
      prompt: "Which set of tools pulls you in more?",
      options: [
        {
          courseSlug: courseA.slug,
          courseColor: courseA.color,
          tag: "Program stack",
          label: courseA.stack.slice(0, 3).join(" · "),
        },
        {
          courseSlug: courseB.slug,
          courseColor: courseB.color,
          tag: "Program stack",
          label: courseB.stack.slice(0, 3).join(" · "),
        },
      ],
    },
    {
      id: "outcome",
      prompt: "Which outcome matters more to you?",
      options: [
        {
          courseSlug: courseA.slug,
          courseColor: courseA.color,
          tag: "Outcome",
          label: at(courseA.outcomes, 3),
        },
        {
          courseSlug: courseB.slug,
          courseColor: courseB.color,
          tag: "Outcome",
          label: at(courseB.outcomes, 2),
        },
      ],
    },
    {
      id: "highlight",
      prompt: "Which weekly rhythm sounds more like you?",
      options: [
        {
          courseSlug: courseA.slug,
          courseColor: courseA.color,
          tag: "Program highlight",
          label: `${at(courseA.highlights, 2).title} — ${at(courseA.highlights, 2).description}`,
        },
        {
          courseSlug: courseB.slug,
          courseColor: courseB.color,
          tag: "Program highlight",
          label: `${at(courseB.highlights, 2).title} — ${at(courseB.highlights, 2).description}`,
        },
      ],
    },
    {
      id: "curriculum",
      prompt: "Which curriculum phase excites you most?",
      options: [
        {
          courseSlug: courseA.slug,
          courseColor: courseA.color,
          tag: "Curriculum phase",
          label: `${at(courseA.curriculum, 1).title} — ${at(courseA.curriculum, 1).description}`,
        },
        {
          courseSlug: courseB.slug,
          courseColor: courseB.color,
          tag: "Curriculum phase",
          label: `${at(courseB.curriculum, 1).title} — ${at(courseB.curriculum, 1).description}`,
        },
      ],
    },
  ];
}

export function TrackMatcher({ courses }: { courses: Course[] }) {
  const courseA = courses[0];
  const courseB = courses[1];

  const questions = useMemo(
    () => (courseA && courseB ? buildQuestions(courseA, courseB) : []),
    [courseA, courseB],
  );

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeIndex, setActiveIndex] = useState(0);

  if (!courseA || !courseB || questions.length === 0) return null;

  const activeQuestion = questions[Math.min(activeIndex, questions.length - 1)];
  const totalAnswered = Object.keys(answers).length;

  const scoreFor = (slug: string) =>
    Object.values(answers).filter((picked) => picked === slug).length;

  const scoreA = scoreFor(courseA.slug);
  const scoreB = scoreFor(courseB.slug);
  const leaderSlug =
    totalAnswered === 0 ? null : scoreA === scoreB ? "tie" : scoreA > scoreB ? courseA.slug : courseB.slug;
  const leader = leaderSlug === courseA.slug ? courseA : leaderSlug === courseB.slug ? courseB : null;
  const leaderTheme = leader ? COLOR_THEME[leader.color] : null;
  const allAnswered = totalAnswered === questions.length;

  const handleAnswer = (questionId: string, slug: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: slug }));
    const nextIndex = questions.findIndex((q) => q.id === questionId) + 1;
    if (nextIndex < questions.length) {
      window.setTimeout(() => setActiveIndex(nextIndex), 320);
    }
  };

  const reset = () => {
    setAnswers({});
    setActiveIndex(0);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
      {/* Quiz card */}
      <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-ink-elevated/60 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => {
              const answeredSlug = answers[q.id];
              const isActive = i === activeIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Question ${i + 1}${answeredSlug ? " (answered)" : ""}`}
                  aria-current={isActive}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-200",
                    isActive
                      ? "border-paper/40 bg-white/10 text-paper"
                      : answeredSlug
                        ? "border-white/20 bg-white/5 text-paper/70"
                        : "border-white/10 bg-transparent text-paper/40 hover:border-white/25 hover:text-paper/70",
                  )}
                >
                  {answeredSlug ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                </button>
              );
            })}
          </div>
          {totalAnswered > 0 && (
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-soft transition-colors hover:text-paper"
            >
              Retake
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuestion.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-soft">
              Question {activeIndex + 1} of {questions.length}
            </p>
            <h3 className="font-display text-xl font-medium leading-snug text-paper sm:text-2xl">
              {activeQuestion.prompt}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {activeQuestion.options.map((option) => {
                const theme = COLOR_THEME[option.courseColor];
                const selected = answers[activeQuestion.id] === option.courseSlug;
                return (
                  <button
                    key={option.courseSlug}
                    type="button"
                    onClick={() => handleAnswer(activeQuestion.id, option.courseSlug)}
                    aria-pressed={selected}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5",
                      selected
                        ? cn(theme.chipBorder, theme.chipBg)
                        : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/5",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[0.65rem] font-semibold uppercase tracking-[0.14em]",
                        selected ? theme.chipText : "text-muted-soft",
                      )}
                    >
                      {option.tag}
                    </span>
                    <span className="text-sm leading-relaxed text-paper/90 sm:text-base">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live match panel */}
      <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-paper/80">
          <Sparkles className="size-4 text-acid" strokeWidth={2.5} />
          Your live match
        </div>

        <div className="flex flex-col gap-4" aria-live="polite">
          {[courseA, courseB].map((course) => {
            const theme = COLOR_THEME[course.color];
            const score = scoreFor(course.slug);
            const pct = totalAnswered ? Math.round((score / totalAnswered) * 100) : 50;
            return (
              <div key={course.slug} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-paper/85">{course.shortName}</span>
                  <span className={cn("font-semibold", theme.text)}>{pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={cn("h-full rounded-full", theme.solidBg)}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {totalAnswered === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm leading-relaxed text-muted"
            >
              Answer a question on the left and this updates live.
            </motion.p>
          ) : leaderSlug === "tie" ? (
            <motion.div
              key="tie"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3 border-t border-white/10 pt-5"
            >
              <p className="text-sm leading-relaxed text-muted">
                Dead even so far — both tracks are pulling equally. Explore either below.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href={`/courses/${courseA.slug}`} variant="secondary" withArrow={false}>
                  {courseA.shortName}
                </Button>
                <Button href={`/courses/${courseB.slug}`} variant="secondary" withArrow={false}>
                  {courseB.shortName}
                </Button>
              </div>
            </motion.div>
          ) : (
            leader &&
            leaderTheme && (
              <motion.div
                key={leader.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4 border-t border-white/10 pt-5"
              >
                <span
                  className={cn(
                    "w-fit rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em]",
                    leaderTheme.chipBorder,
                    leaderTheme.chipBg,
                    leaderTheme.chipText,
                  )}
                >
                  {allAnswered ? "Your match" : "Leaning toward"}
                </span>
                <h4 className="font-display text-2xl font-medium leading-snug text-paper">
                  {leader.shortName}
                </h4>
                <p className={cn("text-sm font-medium leading-snug", leaderTheme.text)}>
                  {leader.tagline}
                </p>
                <StackChips stack={leader.stack.slice(0, 3)} color={leader.color} />
                <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
                  <CheckCircle2
                    className={cn("mt-0.5 size-4 shrink-0", leaderTheme.solidText)}
                    strokeWidth={2.5}
                  />
                  <span className="text-sm leading-relaxed text-paper/85">{leader.outcomes[0]}</span>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-paper/60">
                  <Flame className="size-3.5" strokeWidth={2.5} />
                  Only {Math.max(0, leader.seatsTotal - leader.seatsClaimed)} seats left this cohort
                </span>
                <Button href={`/courses/${leader.slug}`} variant="primary" className="w-fit">
                  Explore the {leader.shortName} program
                </Button>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
