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
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-px">
      <div
        aria-hidden
        className="animate-spin-slow absolute inset-[-60%]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, var(--color-coral) 12%, transparent 28%, transparent 60%, var(--color-violet-light) 74%, transparent 88%)",
        }}
      />
      <div className={cn("relative overflow-hidden rounded-[calc(1.5rem-1px)]", className)}>
        {children}
      </div>
    </div>
  );
}
