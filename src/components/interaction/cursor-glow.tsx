"use client";

import { useEffect, useRef } from "react";

// A soft light that follows the cursor, desktop-only. Uses CSS custom
// properties + rAF instead of React state so it never triggers a re-render.
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;

    const apply = () => {
      if (ref.current) {
        ref.current.style.background = `radial-gradient(640px circle at ${x}px ${y}px, rgba(124,92,255,0.10), transparent 45%)`;
      }
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] hidden sm:block"
    />
  );
}
