"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// The masthead's single ambient blob used to just sit there with a generic
// `animate-float` loop, same as every other hero on the site before the
// About page's hero got scroll-linked depth. Tying it to scroll position
// instead gives this listing page's opening moment the same sense of depth.
export function HeroParallaxGlow() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const blobY = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const blobX = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,rgba(224,33,43,0.3),transparent)]" />
      <motion.div
        style={reduceMotion ? undefined : { y: blobY, x: blobX }}
        className="absolute right-[10%] top-[30%] size-80 rounded-full bg-coral/20 blur-[120px]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(246,244,251,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(246,244,251,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
    </div>
  );
}
