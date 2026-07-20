// Shared color theming for course pages. `Course.color` is only ever
// "violet" | "coral", so every class name below is a literal string —
// keeping them fully spelled out (never string-interpolated) so
// Tailwind's compiler can find them at build time.

import type { Course } from "@/data/content";

export const COLOR_THEME: Record<
  Course["color"],
  {
    text: string;
    solidText: string;
    bgSoft: string;
    bgGlow: string;
    border: string;
    gradient: string;
    gradientText: string;
    chipBg: string;
    chipBorder: string;
    chipText: string;
    ring: string;
  }
> = {
  violet: {
    text: "text-violet-light",
    solidText: "text-violet",
    bgSoft: "bg-violet/10",
    bgGlow: "bg-violet/25",
    border: "border-violet/30",
    gradient: "from-violet to-violet-dark",
    gradientText: "from-violet-light via-violet to-paper",
    chipBg: "bg-violet/10",
    chipBorder: "border-violet/25",
    chipText: "text-violet-light",
    ring: "ring-violet/40",
  },
  coral: {
    text: "text-coral-light",
    solidText: "text-coral",
    bgSoft: "bg-coral/10",
    bgGlow: "bg-coral/25",
    border: "border-coral/30",
    gradient: "from-coral to-coral-light",
    gradientText: "from-coral-light via-coral to-paper",
    chipBg: "bg-coral/10",
    chipBorder: "border-coral/25",
    chipText: "text-coral-light",
    ring: "ring-coral/40",
  },
};
