"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useCursorAccent } from "@/lib/cursor-accent";

// Same brand-red family used by course.color ("violet" resolves to the
// brand red token, "coral" to the warmer red) — see color-theme.ts. Kept
// as literal RGB triples here (not CSS var lookups) because this writes
// directly into an inline gradient string on every frame; resolving a CSS
// custom property from JS on a hot path isn't worth it for two colors.
const ACCENT_RGB: Record<string, [number, number, number]> = {
  default: [224, 33, 43],
  violet: [224, 33, 43],
  coral: [255, 75, 75],
};

/** A soft light that follows the cursor, tinted toward whatever the visitor is
 * currently looking at and brightening slightly over primary CTAs. Desktop-only.
 * Uses a plain object + rAF instead of React state so it never triggers a
 * re-render — position, color, and intensity are all lerped by hand and
 * written straight to the element's style. */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const accent = useCursorAccent();
  const accentRef = useRef(accent);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    accentRef.current = accent;
  }, [accent]);

  useEffect(() => {
    if (reduceMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    let hovered = false;
    let color: [number, number, number] = [...ACCENT_RGB.default];
    let radius = 640;
    let opacity = 0.1;

    const tick = () => {
      const target = ACCENT_RGB[accentRef.current] ?? ACCENT_RGB.default;
      // Manual lerp toward the current target color/intensity each frame —
      // CSS transitions don't interpolate gradient strings reliably across
      // browsers, and this glow already bypasses React for perf, so it's
      // simplest to ease everything by hand alongside it.
      color = [
        color[0] + (target[0] - color[0]) * 0.06,
        color[1] + (target[1] - color[1]) * 0.06,
        color[2] + (target[2] - color[2]) * 0.06,
      ];
      const targetRadius = hovered ? 760 : 640;
      const targetOpacity = hovered ? 0.17 : 0.1;
      radius += (targetRadius - radius) * 0.15;
      opacity += (targetOpacity - opacity) * 0.15;

      if (ref.current) {
        const [r, g, b] = color.map(Math.round);
        ref.current.style.background = `radial-gradient(${radius.toFixed(0)}px circle at ${x}px ${y}px, rgba(${r},${g},${b},${opacity.toFixed(3)}), transparent 45%)`;
      }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      // Cheap hit-test bound to real pointer events (not every animation
      // frame) — any primary CTA opts in via the data attribute, so this
      // stays a one-line addition per component rather than a new prop.
      hovered = Boolean((e.target as Element | null)?.closest("[data-cursor-glow]"));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] hidden sm:block"
    />
  );
}
