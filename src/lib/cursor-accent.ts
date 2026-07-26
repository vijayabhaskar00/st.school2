"use client";

import { useEffect, useState } from "react";

// Lets CursorGlow tint itself to match whatever the visitor is currently
// looking at (a course's brand color) instead of always glowing the same
// generic violet — a small thing that makes the cursor feel like part of
// the page rather than a fixed overlay on top of it. Same pub-sub shape as
// pricing-unlock.ts: a module-level value plus a window event, since these
// are independent client islands with no shared React tree to lift state
// into.

export type CursorAccent = "default" | "violet" | "coral";

const ACCENT_EVENT = "stschool:cursor-accent";
let currentAccent: CursorAccent = "default";

export function setCursorAccent(accent: CursorAccent) {
  if (typeof window === "undefined") return;
  currentAccent = accent;
  window.dispatchEvent(new CustomEvent<CursorAccent>(ACCENT_EVENT, { detail: accent }));
}

export function useCursorAccent(): CursorAccent {
  const [accent, setAccent] = useState<CursorAccent>("default");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the module-level value can only be read once mounted; there's no way to know it during SSR/prerender.
    setAccent(currentAccent);
    const handler = (e: Event) => setAccent((e as CustomEvent<CursorAccent>).detail);
    window.addEventListener(ACCENT_EVENT, handler);
    return () => window.removeEventListener(ACCENT_EVENT, handler);
  }, []);

  return accent;
}

/** A page (e.g. a course detail page) claims the accent for as long as it's mounted, and releases it back to the default on unmount. */
export function useClaimCursorAccent(accent: CursorAccent) {
  useEffect(() => {
    setCursorAccent(accent);
    return () => setCursorAccent("default");
  }, [accent]);
}
