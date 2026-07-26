"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { COLOR_THEME } from "@/components/courses/color-theme";
import { cn } from "@/lib/utils";
import type { Course } from "@/data/content";

/**
 * Detail hero's ambient blob, in the course's brand color. Used to be a
 * static blob with a generic `animate-float` loop, same as every other hero
 * on the site — this ties it to scroll instead, matching the About page's
 * hero. A tiny client leaf so the (async, server) course detail page can
 * opt into scroll-linked motion without itself becoming a client component.
 */
export function HeroParallaxGlow({ color }: { color: Course["color"] }) {
  const theme = COLOR_THEME[color];
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const blobY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const blobX = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,rgba(224,33,43,0.28),transparent)]" />
      <motion.div
        style={reduceMotion ? undefined : { y: blobY, x: blobX }}
        className={cn("absolute right-[8%] top-[24%] size-96 rounded-full blur-[130px]", theme.bgGlow)}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(246,244,251,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(246,244,251,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
    </div>
  );
}
