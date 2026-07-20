"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Course } from "@/data/content";
import { Button } from "@/components/ui/button";
import { BrochureButton } from "@/components/courses/brochure-button";
import { COLOR_THEME } from "@/components/courses/color-theme";
import { cn } from "@/lib/utils";

export function StickyCtaBar({ course }: { course: Course }) {
  const [visible, setVisible] = useState(false);
  const theme = COLOR_THEME[course.color];

  useEffect(() => {
    const onScroll = () => {
      const scrolledPastHero = window.scrollY > 720;
      const nearBottom =
        window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 640;
      setVisible(scrolledPastHero && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/90 backdrop-blur-xl"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-3">
              <span className={cn("hidden size-2 shrink-0 animate-pulse rounded-full sm:block", theme.solidBg)} />
              <p className="text-sm font-semibold text-paper">
                {course.shortName}
                <span className="ml-2 font-normal text-muted">
                  · {Math.max(0, course.seatsTotal - course.seatsClaimed)} seats left
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <BrochureButton
                course={course}
                className="px-4 py-2.5 text-xs sm:text-sm"
              />
              <Button href="/contact" variant="primary" className="px-5 py-2.5 text-xs sm:text-sm">
                Apply Now
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
