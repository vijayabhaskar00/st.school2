"use client";

import { cn } from "@/lib/utils";

// The closing CTA used to be a static bordered panel — the same treatment
// used to close nearly every section on the site. As the page's final
// pitch it gets one thing nothing else has: a slowly rotating conic-
// gradient ring living behind a 1px inset, the classic "living border"
// premium-SaaS treatment. Pure CSS (reuses the existing --animate-spin-slow
// keyframe) so it costs nothing on the main thread.
export function GlowBorderPanel({
  children,
  className,
  intensity = "full",
}: {
  children: React.ReactNode;
  className?: string;
  // "subtle" is for secondary-but-still-important moments (e.g. the pricing
  // gate) that deserve the "living border" signal without competing with
  // the one true full-strength treatment on the About page's closing CTA.
  intensity?: "full" | "subtle";
}) {
  const isSubtle = intensity === "subtle";
  return (
    <div className="relative overflow-hidden rounded-3xl p-px">
      <div
        aria-hidden
        className={cn("animate-spin-slow absolute inset-[-60%]", isSubtle && "opacity-40")}
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, var(--color-coral) 12%, transparent 28%, transparent 60%, var(--color-violet-light) 74%, transparent 88%)",
          animationDuration: isSubtle ? "20s" : undefined,
        }}
      />
      <div className={cn("relative overflow-hidden rounded-[calc(1.5rem-1px)]", className)}>
        {children}
      </div>
    </div>
  );
}
