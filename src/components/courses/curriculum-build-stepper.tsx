"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Course } from "@/data/content";
import { cn } from "@/lib/utils";

type Fidelity = {
  border: string;
  bodyBg: string;
  avatar: string;
  chip: string;
  cta: string;
  ctaText: string;
  shadow: boolean;
  badge?: string;
};

const STAGES: Fidelity[] = [
  {
    border: "border-2 border-dashed border-white/20",
    bodyBg: "bg-transparent",
    avatar: "border-2 border-dashed border-white/25 bg-transparent",
    chip: "border border-dashed border-white/20 bg-transparent",
    cta: "border-2 border-dashed border-white/25 bg-transparent text-paper/40",
    ctaText: "[ button ]",
    shadow: false,
  },
  {
    border: "border border-white/15",
    bodyBg: "bg-white/[0.03]",
    avatar: "border border-white/20 bg-white/10",
    chip: "border border-white/15 bg-white/[0.04]",
    cta: "border border-white/20 bg-white/5 text-paper/60",
    ctaText: "Continue",
    shadow: false,
  },
  {
    border: "border border-violet/25",
    bodyBg: "bg-ink/50",
    avatar: "bg-gradient-to-br from-violet-light to-violet",
    chip: "border border-violet/25 bg-violet/10",
    cta: "bg-violet/20 border border-violet/40 text-violet-light",
    ctaText: "Continue",
    shadow: false,
  },
  {
    border: "border border-coral/30",
    bodyBg: "bg-ink/70",
    avatar: "bg-gradient-to-br from-violet-light to-coral",
    chip: "border border-coral/25 bg-coral/10",
    cta: "bg-gradient-to-r from-coral to-coral-light text-ink",
    ctaText: "Ship it",
    shadow: true,
    badge: "Shipped",
  },
];

export function CurriculumBuildStepper({ curriculum }: { curriculum: Course["curriculum"] }) {
  const [stage, setStage] = useState(0);
  const preset = STAGES[Math.min(stage, STAGES.length - 1)];
  const phase = curriculum[Math.min(stage, curriculum.length - 1)];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {curriculum.map((p, i) => (
          <button
            key={p.phase}
            type="button"
            onClick={() => setStage(i)}
            className={cn(
              "rounded-full border px-4 py-2 text-left text-xs font-semibold transition-all duration-200 sm:text-sm",
              stage === i
                ? "border-coral/50 bg-coral/15 text-coral-light"
                : "border-white/15 bg-white/5 text-paper/70 hover:border-white/30 hover:text-paper",
            )}
          >
            {p.phase}
            <span className="ml-1.5 hidden font-normal text-paper/50 sm:inline">· {p.title}</span>
          </button>
        ))}
      </div>

      <div
        className={cn(
          "relative flex min-h-[20rem] flex-col gap-5 overflow-hidden rounded-3xl p-6 transition-colors duration-500 sm:p-8",
          preset.border,
          preset.shadow && "shadow-[0_30px_60px_-20px_rgba(255,75,75,0.25)]",
        )}
      >
        {preset.badge && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-6 top-6 rounded-full bg-acid/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-acid"
          >
            {preset.badge}
          </motion.span>
        )}

        <div className="flex items-center gap-3">
          <motion.div layout className={cn("size-11 shrink-0 rounded-full transition-colors duration-500", preset.avatar)} />
          <div className="flex flex-col gap-2">
            <div className={cn("h-2.5 w-32 rounded-full transition-colors duration-500", preset.bodyBg === "bg-transparent" ? "bg-transparent border border-dashed border-white/20" : "bg-paper/50")} />
            <div className={cn("h-2 w-20 rounded-full transition-colors duration-500", preset.bodyBg === "bg-transparent" ? "bg-transparent border border-dashed border-white/15" : "bg-paper/25")} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn("flex flex-col gap-1.5 rounded-xl p-3 transition-colors duration-500", preset.chip)}>
              <div className={cn("h-3 w-8 rounded-full transition-colors duration-500", preset.bodyBg === "bg-transparent" ? "border border-dashed border-white/20" : "bg-paper/40")} />
              <div className={cn("h-1.5 w-10 rounded-full transition-colors duration-500", preset.bodyBg === "bg-transparent" ? "border border-dashed border-white/15" : "bg-paper/15")} />
            </div>
          ))}
        </div>

        <div className={cn("flex-1 rounded-2xl transition-colors duration-500", preset.bodyBg)} />

        <motion.div
          layout
          className={cn(
            "mt-auto w-fit rounded-full px-5 py-2.5 text-xs font-semibold transition-colors duration-500",
            preset.cta,
          )}
        >
          {preset.ctaText}
        </motion.div>
      </div>

      <p className="text-sm leading-relaxed text-muted sm:text-base">
        <span className="font-semibold text-paper">{phase.phase} — {phase.title}.</span>{" "}
        {phase.description}
      </p>
    </div>
  );
}
