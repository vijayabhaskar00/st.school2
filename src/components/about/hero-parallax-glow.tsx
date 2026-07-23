"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// The intro section's two ambient blobs used to just sit there with a
// generic `animate-float` loop, same as every other hero on the site.
// Tying them to scroll position instead gives the about page's opening
// moment its own sense of depth — the glows drift apart as you scroll
// past, rather than looping in place forever.
export function HeroParallaxGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const leftY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const rightY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const leftX = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const rightX = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_50%_at_50%_0%,rgba(255,91,61,0.22),transparent)]" />
      <motion.div
        style={{ y: leftY, x: leftX }}
        className="absolute left-[10%] top-[10%] size-72 rounded-full bg-coral/20 blur-[110px]"
        aria-hidden
      />
      <motion.div
        style={{ y: rightY, x: rightX }}
        className="absolute right-[8%] top-[28%] size-80 rounded-full bg-violet/25 blur-[120px]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(246,244,251,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(246,244,251,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
    </div>
  );
}
