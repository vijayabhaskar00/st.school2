"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type IssueId = "contrast" | "alignment" | "target" | "hierarchy";

const ISSUES: { id: IssueId; x: number; y: number; label: string }[] = [
  { id: "hierarchy", x: 8, y: 12, label: "No visual hierarchy — everything competes for attention" },
  { id: "target", x: 90, y: 8, label: "Touch target is 16px — under the 44px accessibility minimum" },
  { id: "contrast", x: 12, y: 58, label: "Text contrast fails WCAG AA against this background" },
  { id: "alignment", x: 60, y: 84, label: "Button is off-grid — 6° rotation, inconsistent margin" },
];

function Hotspot({
  issue,
  onFix,
}: {
  issue: (typeof ISSUES)[number];
  onFix: (id: IssueId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onFix(issue.id)}
      aria-label={`Fix issue: ${issue.label}`}
      className="group absolute z-20 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      style={{ left: `${issue.x}%`, top: `${issue.y}%` }}
    >
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-coral opacity-60" />
      <span className="relative inline-flex size-3.5 rounded-full bg-coral ring-4 ring-coral/20 transition-transform group-hover:scale-125" />
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded-lg border border-white/10 bg-ink px-3 py-2 text-left text-xs leading-relaxed text-paper/85 opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
        {issue.label}
      </span>
    </button>
  );
}

export function DesignAudit() {
  const [fixed, setFixed] = useState<Set<IssueId>>(new Set());

  const handleFix = (id: IssueId) => {
    setFixed((prev) => new Set(prev).add(id));
  };

  const isFixed = (id: IssueId) => fixed.has(id);
  const allFixed = fixed.size === ISSUES.length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-paper/80">
          <Search className="size-4 text-coral-light" strokeWidth={2.5} />
          {fixed.size} of {ISSUES.length} issues fixed
        </div>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10 sm:w-48">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-coral to-coral-light"
            animate={{ width: `${(fixed.size / ISSUES.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="relative min-h-[22rem] overflow-hidden rounded-3xl border border-white/10 bg-ink-elevated/60 p-6 sm:p-9">
        {!allFixed &&
          ISSUES.filter((i) => !isFixed(i.id)).map((issue) => (
            <Hotspot key={issue.id} issue={issue} onFix={handleFix} />
          ))}

        {/* the mockup being audited */}
        <div className="relative flex h-full flex-col gap-6">
          {/* hierarchy: heading vs body */}
          <div className="flex flex-col gap-2">
            <motion.div
              animate={{
                height: isFixed("hierarchy") ? "1.75rem" : "0.85rem",
                width: isFixed("hierarchy") ? "55%" : "70%",
              }}
              className={cn("rounded-full", isFixed("hierarchy") ? "bg-paper" : "bg-paper/40")}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              animate={{ opacity: isFixed("hierarchy") ? 0.5 : 0.9 }}
              className="h-2 w-4/5 rounded-full bg-paper/30"
            />
            <motion.div
              animate={{ opacity: isFixed("hierarchy") ? 0.4 : 0.9 }}
              className="h-2 w-3/5 rounded-full bg-paper/30"
            />
          </div>

          {/* contrast: body text block */}
          <motion.div
            animate={{
              backgroundColor: isFixed("contrast") ? "rgba(33,33,36,1)" : "rgba(33,33,36,0.4)",
            }}
            className="flex-1 rounded-2xl p-4"
          >
            <motion.p
              animate={{ color: isFixed("contrast") ? "var(--color-paper)" : "rgba(168,167,172,0.35)" }}
              className="text-sm leading-relaxed"
            >
              Every cohort reviews accessibility as a first-class requirement, not an
              afterthought — contrast, target size, and hierarchy included.
            </motion.p>
          </motion.div>

          {/* alignment + target: footer row */}
          <div className="flex items-center justify-between">
            <motion.div
              animate={
                isFixed("alignment")
                  ? { rotate: 0, x: 0, y: 0 }
                  : { rotate: -6, x: -4, y: 6 }
              }
              transition={{ type: "spring", damping: 12 }}
              className="rounded-full bg-gradient-to-r from-coral to-coral-light px-5 py-2.5 text-xs font-semibold text-ink shadow-lg"
            >
              Continue
            </motion.div>

            <motion.button
              type="button"
              aria-label="Menu"
              animate={{ width: isFixed("target") ? 44 : 16, height: isFixed("target") ? 44 : 16 }}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-center rounded-full border border-white/15 bg-white/5"
            >
              <span className="h-0.5 w-3 rounded-full bg-paper/60" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {allFixed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-ink/90 text-center backdrop-blur-sm"
            >
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 10, delay: 0.1 }}
                className="flex size-14 items-center justify-center rounded-full bg-coral text-ink"
              >
                <Check className="size-7" strokeWidth={3} />
              </motion.span>
              <p className="font-display text-xl font-medium text-paper">
                Clean audit.
              </p>
              <p className="max-w-xs text-sm text-muted">
                Contrast, hierarchy, alignment, touch targets — that&apos;s a real
                heuristic review. Week 2 material.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
