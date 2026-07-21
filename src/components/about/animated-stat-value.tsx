"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { parseStatNumber } from "./stat-format";

// Count-up for a single parentBrand.stats value. Mirrors the spring-driven
// approach in src/components/motion/counter.tsx, but works off the raw
// string values in parentBrand.stats ("1M+", "500+", "10+") instead of a
// pre-split number/prefix/suffix shape — and falls back to rendering
// non-numeric values ("Forbes") as-is rather than counting to nothing.
export function AnimatedStatValue({
  value,
  className,
  delay = 0,
}: {
  value: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });
  const parsed = parseStatNumber(value);

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1600, bounce: 0.12 });

  useEffect(() => {
    if (!isInView || !parsed) return;
    const timeout = setTimeout(() => motionValue.set(parsed.number), delay * 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  useEffect(() => {
    if (!parsed) return;
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${Math.floor(latest).toLocaleString()}${parsed.suffix}`;
      }
    });
  }, [spring, parsed]);

  if (!parsed) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      0{parsed.suffix}
    </span>
  );
}
