"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Sparkles, ArrowUpRight } from "lucide-react";
import type { Course } from "@/data/content";
import { COLOR_THEME } from "@/components/courses/color-theme";
import { GlowBorderPanel } from "@/components/about/glow-border-panel";
import { cn } from "@/lib/utils";
import {
  PRICING_GATE_ELEMENT_ID,
  unlockPricing,
  usePricingUnlock,
  onPricingGateOpenRequest,
  type PricingLead,
} from "@/lib/pricing-unlock";

const EASE = [0.16, 1, 0.3, 1] as const;

const initialLead: PricingLead = { name: "", email: "", phone: "" };

const inputClass =
  "w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-paper placeholder:text-muted-soft outline-none transition-colors focus:border-coral/60";

function formatAmount(amount: number, currency: string) {
  return `${currency}${amount.toLocaleString("en-IN")}`;
}

export function PricingGate({ course }: { course: Course }) {
  const unlocked = usePricingUnlock();
  const theme = COLOR_THEME[course.color];
  const [formOpen, setFormOpen] = useState(false);
  const [lead, setLead] = useState<PricingLead>(initialLead);

  useEffect(() => onPricingGateOpenRequest(() => setFormOpen(true)), []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    unlockPricing(lead);
    setFormOpen(false);
  }

  const hasDiscount = course.priceOriginalAmount > course.priceAmount;
  const discountPct = hasDiscount ? Math.round((1 - course.priceAmount / course.priceOriginalAmount) * 100) : 0;

  return (
    <div id={PRICING_GATE_ELEMENT_ID} className="scroll-mt-24">
      <GlowBorderPanel intensity="subtle" className="flex flex-col gap-3 bg-ink/40 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-soft">Program fee</span>
          {hasDiscount && unlocked && (
            <span className={cn("rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-paper", theme.solidBg)}>
              Save {discountPct}%
            </span>
          )}
        </div>

        {unlocked ? (
          <motion.div
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col gap-1"
          >
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className="font-display text-3xl font-medium tracking-tight text-paper">
                {formatAmount(course.priceAmount, course.priceCurrency)}
              </span>
              {hasDiscount && (
                <span className="text-base text-muted-soft line-through">
                  {formatAmount(course.priceOriginalAmount, course.priceCurrency)}
                </span>
              )}
            </div>
            {course.priceNote && <p className="text-xs text-muted">{course.priceNote}</p>}
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="select-none font-display text-3xl font-medium tracking-tight text-paper/70 blur-md">
                {formatAmount(course.priceOriginalAmount || course.priceAmount, course.priceCurrency)}
              </span>
              <Lock className="size-4 shrink-0 text-muted-soft" strokeWidth={2.5} />
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Share a few details to reveal the exact fee and get the full brochure — no spam, ever.
            </p>
            {!formOpen && (
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-paper px-4 py-2 text-xs font-semibold text-ink transition-opacity hover:opacity-90"
              >
                <Sparkles className="size-3.5" strokeWidth={2.5} />
                Unlock pricing &amp; brochure
              </button>
            )}
          </div>
        )}

        <AnimatePresence>
          {!unlocked && formOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-2.5 overflow-hidden pt-1"
            >
              <input
                required
                type="text"
                placeholder="Full name"
                value={lead.name}
                onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))}
                className={inputClass}
              />
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={lead.email}
                  onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                  className={inputClass}
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone"
                  value={lead.phone}
                  onChange={(e) => setLead((p) => ({ ...p, phone: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-paper px-4 py-2.5 text-xs font-semibold text-ink transition-opacity hover:opacity-90"
              >
                Reveal fee &amp; brochure
                <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </GlowBorderPanel>
    </div>
  );
}
