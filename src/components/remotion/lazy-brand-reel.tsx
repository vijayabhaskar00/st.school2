"use client";

import dynamic from "next/dynamic";

// Client-only wrapper so Server Components (e.g. the course detail page)
// can lazy-load the Remotion player without prerendering it — `next/dynamic`
// with `ssr: false` is only allowed inside a Client Component.
export const LazyBrandReel = dynamic(
  () => import("@/components/remotion/brand-reel-player").then((m) => m.BrandReelPlayer),
  {
    ssr: false,
    loading: () => (
      <div
        className="aspect-[8/5] w-full animate-pulse rounded-2xl border border-white/10 bg-ink-elevated/60"
        aria-hidden="true"
      />
    ),
  },
);
