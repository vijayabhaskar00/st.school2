"use client";

import dynamic from "next/dynamic";

// Client-only wrapper so the course detail page (a Server Component) can
// lazy-load the Design System Build player without prerendering it —
// `next/dynamic` with `ssr: false` is only allowed inside a Client Component.
export const LazyDesignSystemBuild = dynamic(
  () =>
    import("@/components/remotion/design-system-build-player").then(
      (m) => m.DesignSystemBuildPlayer,
    ),
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
