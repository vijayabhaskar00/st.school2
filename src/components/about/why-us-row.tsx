"use client";

import { type MouseEvent, useRef } from "react";
import { motion, useInView, useMotionValue } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Each row used to be a plain fade-up with a CSS group-hover color swap on
// the index number — the only page-wide component with zero hover payoff.
// Adds a cursor-tracked spotlight (a radial gradient pinned to the mouse
// position via motion values written straight to CSS custom properties, so
// tracking the mouse never triggers a React re-render) and a spring pop on
// the index number as it enters view.
export function WhyUsRow({
  index,
  title,
  description,
  icon,
  reverse,
}: {
  index: number;
  title: string;
  description: string;
  icon: string;
  reverse: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden py-8 sm:flex-row sm:items-center sm:gap-10",
        reverse && "sm:flex-row-reverse",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(320px circle at var(--x, 50%) var(--y, 50%), rgba(255,75,75,0.08), transparent 70%)",
        }}
        ref={(el) => {
          if (!el) return;
          const unsubX = mouseX.on("change", (v) => el.style.setProperty("--x", `${v}%`));
          const unsubY = mouseY.on("change", (v) => el.style.setProperty("--y", `${v}%`));
          return () => {
            unsubX();
            unsubY();
          };
        }}
      />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 + index * 0.07 }}
        className="relative flex shrink-0 items-center gap-3 sm:w-24 sm:flex-col sm:items-start sm:gap-2"
      >
        <Image src={icon} alt="" width={48} height={48} className="size-10 object-contain sm:size-12" />
        <span className="font-display text-2xl font-semibold text-muted-soft transition-colors group-hover:text-violet-light sm:text-3xl">
          {String(index + 1).padStart(2, "0")}
        </span>
      </motion.div>
      <div className="relative flex flex-col gap-2">
        <h3 className="font-display text-xl font-medium text-paper sm:text-2xl">{title}</h3>
        <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">{description}</p>
      </div>
    </motion.div>
  );
}
