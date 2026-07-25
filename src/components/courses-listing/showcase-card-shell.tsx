"use client";

// The interactive chrome for a `CourseShowcaseCard` on the /courses listing.
//
// The card content itself stays a Server Component and is handed in as
// `children` — only the shell (cursor spotlight, tilt, hover-reactive border
// and glow) needs to run on the client, so nothing in the card's copy,
// badges, stats or CTA ships as client JS.
//
// The spotlight reuses the pattern established in
// src/components/about/why-us-row.tsx: mouse position lives in motion values
// that are written straight to CSS custom properties from a ref-callback
// subscription (with cleanup), so tracking the cursor never triggers a React
// re-render. Everything else is CSS `group-hover:`, which means it costs no
// state at all and degrades to "just visible" on touch.

import { type MouseEvent } from "react";
import { useMotionValue } from "framer-motion";
import type { Course } from "@/data/content";
import { cn } from "@/lib/utils";
import { TiltCard } from "@/components/motion/tilt-card";
import { COLOR_THEME } from "@/components/courses/color-theme";

// Hover-only tokens that COLOR_THEME doesn't carry. Spelled out as literal
// class strings for the same reason COLOR_THEME is — Tailwind's scanner never
// sees a constructed class name. The rgba spotlight colors mirror
// --color-violet-light (#f2555c) and --color-coral-light (#ff8a8a).
const HOVER_THEME: Record<
  Course["color"],
  { hoverBorder: string; hoverShadow: string; spotlight: string }
> = {
  violet: {
    hoverBorder: "hover:border-violet/60",
    hoverShadow: "hover:shadow-[0_40px_120px_-60px_rgba(224,33,43,0.7)]",
    spotlight: "rgba(242,85,92,0.13)",
  },
  coral: {
    hoverBorder: "hover:border-coral/60",
    hoverShadow: "hover:shadow-[0_40px_120px_-60px_rgba(255,75,75,0.7)]",
    spotlight: "rgba(255,138,138,0.13)",
  },
};

export function ShowcaseCardShell({
  color,
  reverse = false,
  children,
}: {
  color: Course["color"];
  reverse?: boolean;
  children: React.ReactNode;
}) {
  const theme = COLOR_THEME[color];
  const hover = HOVER_THEME[color];
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <section className="relative">
      {/* Low intensity on purpose: a card this large tilting hard reads cheap. */}
      <TiltCard intensity={3.5}>
        <div
          onMouseMove={handleMouseMove}
          className={cn(
            "group relative overflow-hidden rounded-[2rem] border bg-ink-soft/60 p-8 shadow-[0_0_0_0_transparent] transition-[border-color,box-shadow] duration-500 sm:p-12 lg:p-16",
            theme.border,
            hover.hoverBorder,
            hover.hoverShadow,
          )}
        >
          {/* Corner glow — present at rest, brightens on hover so what reacts
              is the card's own color identity, keeping the two tracks distinct.
              Opacity only: animating transform on a 130px blur forces a full
              re-raster of a very large layer. */}
          <div
            className={cn(
              "pointer-events-none absolute -top-24 size-96 rounded-full opacity-40 blur-[130px] transition-opacity duration-700 group-hover:opacity-75",
              theme.bgGlow,
              reverse ? "-right-24" : "-left-24",
            )}
            aria-hidden
          />

          {/* Cursor-tracked spotlight. --x/--y are written imperatively below. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              backgroundImage: `radial-gradient(460px circle at var(--x, 50%) var(--y, 50%), ${hover.spotlight}, transparent 72%)`,
            }}
            ref={(el) => {
              if (!el) return;
              const unsubX = mouseX.on("change", (v) => el.style.setProperty("--x", `${v}%`));
              const unsubY = mouseY.on("change", (v) => el.style.setProperty("--y", `${v}%`));
              return () => {
                unsubX();
                unsubY();
              };
            }}
          />

          {children}
        </div>
      </TiltCard>
    </section>
  );
}
