"use client";

import { useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

function MockupCard({ variant }: { variant: "before" | "after" }) {
  const isAfter = variant === "after";
  return (
    <div className={cn("flex h-full w-full flex-col gap-5 p-6 sm:p-8", isAfter ? "bg-ink-elevated" : "bg-ink-soft")}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "size-12 shrink-0 rounded-full",
            isAfter ? "bg-gradient-to-br from-violet-light to-coral" : "border border-white/15 bg-white/10",
          )}
        />
        <div className="flex flex-col gap-2">
          <div className={cn("h-2.5 w-28 rounded-full", isAfter ? "bg-paper/80" : "bg-white/15")} />
          <div className={cn("h-2 w-20 rounded-full", isAfter ? "bg-coral-light/70" : "bg-white/10")} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col gap-1.5 rounded-xl p-3",
              isAfter ? "border border-white/10 bg-ink/60 shadow-lg" : "border border-white/10 bg-white/[0.02]",
            )}
          >
            <div className={cn("h-3 w-8 rounded-full", isAfter ? "bg-violet-light" : "bg-white/15")} />
            <div className={cn("h-1.5 w-10 rounded-full", isAfter ? "bg-paper/40" : "bg-white/10")} />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className={cn("h-2 w-full rounded-full", isAfter ? "bg-paper/25" : "bg-white/10")} />
        <div className={cn("h-2 w-4/5 rounded-full", isAfter ? "bg-paper/15" : "bg-white/[0.06]")} />
      </div>

      <div
        className={cn(
          "mt-auto w-fit rounded-full px-5 py-2.5 text-xs font-semibold",
          isAfter
            ? "bg-gradient-to-r from-coral to-coral-light text-ink shadow-lg"
            : "border border-dashed border-white/20 text-paper/35",
        )}
      >
        {isAfter ? "Ship it" : "button"}
      </div>
    </div>
  );
}

export function RedesignSlider() {
  const [value, setValue] = useState(38);

  return (
    <div className="relative aspect-[16/10] w-full touch-none select-none overflow-hidden rounded-3xl border border-white/10">
      <div className="absolute inset-0">
        <MockupCard variant="before" />
      </div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <MockupCard variant="after" />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-paper/80"
        style={{ left: `${value}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-lg">
          <MoveHorizontal className="size-4" strokeWidth={2.5} />
        </div>
      </div>

      <span className="pointer-events-none absolute left-4 top-4 z-20 rounded-full border border-coral/30 bg-coral/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-coral-light backdrop-blur-sm">
        After
      </span>
      <span className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-white/15 bg-ink/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-paper/60 backdrop-blur-sm">
        Before
      </span>

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label="Drag to compare the wireframe and the finished design"
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
