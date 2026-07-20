"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { faqs } from "@/data/content";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Questions"
          title={
            <>
              Everything you&apos;re <span className="text-gradient">wondering.</span>
            </>
          }
          description="Still unsure? Reach out — we'd rather answer a direct question than let it decide for you."
        />

        <div className="mx-auto flex w-full max-w-3xl flex-col divide-y divide-white/10 border-t border-white/10">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={faq.question} delay={Math.min(i, 4) * 0.05}>
                <div className="py-2">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span
                      className={cn(
                        "font-display text-lg font-medium tracking-tight text-paper transition-colors sm:text-xl",
                        isOpen && "text-transparent bg-clip-text bg-gradient-to-r from-violet-light to-coral-light",
                      )}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-paper transition-transform duration-300",
                        isOpen && "rotate-45 border-violet/40 bg-violet/15",
                      )}
                    >
                      <Plus className="size-4" strokeWidth={2.5} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-6 text-sm leading-relaxed text-muted sm:text-base">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
