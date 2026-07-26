"use client";

import Link from "next/link";
import { type MouseEvent, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MotionLink = motion(Link);

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  withArrow?: boolean;
  external?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  withArrow = true,
  external = false,
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 18, mass: 0.4 });

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet";

  const variants = {
    primary:
      "bg-paper text-ink shadow-[0_0_0_1px_rgba(246,244,251,0.08)] hover:shadow-[0_0_0_1px_rgba(246,244,251,0.2),0_12px_30px_-8px_rgba(124,92,255,0.55)]",
    secondary: "bg-transparent text-paper ring-1 ring-inset ring-white/20 hover:ring-white/40",
    ghost: "bg-transparent text-paper/80 hover:text-paper px-2 py-1",
  };

  return (
    <MotionLink
      ref={ref}
      href={href}
      className={cn(base, variants[variant], className)}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      // Primary CTAs get a brighter cursor glow (see CursorGlow) — every
      // "main ask" on the site picks this up for free without individually
      // opting in.
      data-cursor-glow={variant === "primary" ? "" : undefined}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
    >
      <span>{children}</span>
      {withArrow && (
        <ArrowUpRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2.5}
        />
      )}
    </MotionLink>
  );
}
