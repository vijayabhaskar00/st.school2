"use client";

// The "you'll walk away able to" column of a CourseShowcaseCard.
//
// Previously every row was an identical `Reveal` fade-up, so four rows landed
// as one undifferentiated block. Here the list owns the choreography: a single
// in-view trigger on the <ul> drives a staggered spring per row, so they snap
// in one after another, and each row has its own hover state (the check badge
// fills with the course color and the row nudges toward the reader). The
// content is fully legible at rest — the hover is a reward, never a reveal —
// so touch devices lose nothing.

import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import type { Course } from "@/data/content";
import { cn } from "@/lib/utils";
import { COLOR_THEME } from "@/components/courses/color-theme";

// Hover/idle tokens COLOR_THEME doesn't carry, written out as literal class
// strings so Tailwind's static scanner can find them.
const ROW_THEME: Record<
  Course["color"],
  { hoverBorder: string; hoverBg: string; badgeBg: string; badgeHoverBg: string }
> = {
  violet: {
    hoverBorder: "hover:border-violet/45",
    hoverBg: "hover:bg-violet/[0.07]",
    badgeBg: "bg-violet/15",
    badgeHoverBg: "group-hover/row:bg-violet",
  },
  coral: {
    hoverBorder: "hover:border-coral/45",
    hoverBg: "hover:bg-coral/[0.07]",
    badgeBg: "bg-coral/15",
    badgeHoverBg: "group-hover/row:bg-coral",
  },
};

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.14 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 230, damping: 20, mass: 0.7 },
  },
};

export function OutcomeChecklist({
  outcomes,
  color,
}: {
  outcomes: string[];
  color: Course["color"];
}) {
  const theme = COLOR_THEME[color];
  const row = ROW_THEME[color];

  return (
    <motion.ul
      variants={listVariants}
      initial="hidden"
      whileInView="show"
      // Vertical-only offset, matching Reveal — a single-value margin shrinks
      // the root on all sides and can leave narrow columns stuck at `hidden`.
      viewport={{ once: true, margin: "-60px 0px" }}
      className="flex list-none flex-col gap-3"
    >
      {outcomes.map((outcome) => (
        <motion.li
          key={outcome}
          variants={rowVariants}
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className={cn(
            "group/row flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors duration-300",
            row.hoverBorder,
            row.hoverBg,
          )}
        >
          <span
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
              row.badgeBg,
              row.badgeHoverBg,
            )}
          >
            <Check
              className={cn("size-3.5 transition-colors duration-300", theme.solidText, "group-hover/row:text-ink")}
              strokeWidth={3}
            />
          </span>
          <span className="text-sm leading-relaxed text-paper/85 transition-colors duration-300 group-hover/row:text-paper">
            {outcome}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
