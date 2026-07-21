"use client";

import { motion } from "framer-motion";

// Small optional polish for the 5-step application process scroller: a thin
// line that draws in above the cards as they scroll into view, hinting at
// the process being one continuous track rather than five separate cards.
// Desktop-only (lg:) since the mobile layout is a horizontal snap-scroller
// where a full-width line reads as a rendering glitch, not a connector.
export function ProcessProgressLine() {
  return (
    <motion.div
      aria-hidden
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-80px 0px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ originX: 0 }}
      className="hidden h-px w-full bg-gradient-to-r from-coral via-violet-light to-transparent lg:block"
    />
  );
}
