"use client";

import dynamic from "next/dynamic";

// Client-only wrapper so the course detail page (a Server Component) can
// lazy-load the Neural Pulse player without prerendering it — matches the
// pattern in lazy-brand-reel.tsx.
export const LazyNeuralPulse = dynamic(
  () => import("@/components/remotion/neural-pulse-player").then((m) => m.NeuralPulsePlayer),
  {
    ssr: false,
    loading: () => (
      <div
        className="aspect-square w-full animate-pulse rounded-full border border-white/10 bg-ink-elevated/60"
        aria-hidden="true"
      />
    ),
  },
);
