"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "python-ai" | "ui-ux";

const GRADIENTS: Record<"violet" | "coral", { from: string; to: string; glow: string }> = {
  violet: { from: "var(--color-violet-light)", to: "var(--color-violet-dark)", glow: "bg-violet/25" },
  coral: { from: "var(--color-coral-light)", to: "var(--color-brand-red-dark)", glow: "bg-coral/25" },
};

function Mascot({ color, variant }: { color: "violet" | "coral"; variant: Variant }) {
  const g = GRADIENTS[color];
  const gradId = `mascotGrad-${variant}`;

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="relative z-10 h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
      animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={g.from} />
          <stop offset="100%" stopColor={g.to} />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="100" cy="182" rx="55" ry="9" fill="black" opacity="0.25" />

      {/* body */}
      <path
        d="M100,22 C132,22 166,38 176,72 C186,106 178,146 146,168 C114,190 76,190 44,168 C12,146 4,106 14,72 C24,38 68,22 100,22 Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M100,22 C132,22 166,38 176,72 C186,106 178,146 146,168 C114,190 76,190 44,168 C12,146 4,106 14,72 C24,38 68,22 100,22 Z"
        fill="white"
        opacity="0.06"
      />

      {/* cheeks */}
      <circle cx="66" cy="112" r="9" fill="white" opacity="0.18" />
      <circle cx="134" cy="112" r="9" fill="white" opacity="0.18" />

      {/* eyes */}
      <g>
        <circle cx="76" cy="96" r="10" fill="var(--color-ink)" />
        <circle cx="124" cy="96" r="10" fill="var(--color-ink)" />
        <circle cx="79" cy="92" r="3" fill="white" />
        <circle cx="127" cy="92" r="3" fill="white" />
      </g>

      {/* smile */}
      <path d="M82,120 Q100,136 118,120" stroke="var(--color-ink)" strokeWidth="4" fill="none" strokeLinecap="round" />
    </motion.svg>
  );
}

function FloatChip({
  className,
  delay = 0,
  duration = 5,
  children,
}: {
  className?: string;
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={cn("absolute", className)}
      animate={{ y: [0, -14, 0], rotate: [0, 3, 0, -3, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function CodeChip({ color }: { color: "violet" | "coral" }) {
  const theme = color === "violet" ? "border-violet/40 bg-violet/10" : "border-coral/40 bg-coral/10";
  return (
    <div className={cn("flex flex-col gap-1.5 rounded-xl border px-3 py-2.5 backdrop-blur-sm", theme)}>
      <div className="flex gap-1">
        <span className="size-1.5 rounded-full bg-coral/70" />
        <span className="size-1.5 rounded-full bg-acid/70" />
        <span className="size-1.5 rounded-full bg-violet-light/70" />
      </div>
      <div className="h-1.5 w-14 rounded-full bg-paper/30" />
      <div className="h-1.5 w-9 rounded-full bg-paper/20" />
    </div>
  );
}

function SwatchChip() {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-ink-elevated/70 px-3 py-2 backdrop-blur-sm">
      <span className="size-3.5 rounded-full bg-violet" />
      <span className="size-3.5 rounded-full bg-coral" />
      <span className="size-3.5 rounded-full bg-acid" />
    </div>
  );
}

function FrameChip() {
  return (
    <div className="relative size-14 rounded-lg border-2 border-dashed border-coral/50">
      {["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"].map((pos) => (
        <span key={pos} className={cn("absolute size-1.5 rounded-[2px] bg-coral", pos)} />
      ))}
    </div>
  );
}

function SparkChip({ color }: { color: "violet" | "coral" }) {
  const fill = color === "violet" ? "var(--color-violet-light)" : "var(--color-coral-light)";
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill={fill} />
    </svg>
  );
}

export function CourseIllustration({
  variant,
  color,
}: {
  variant: Variant;
  color: "violet" | "coral";
}) {
  const glow = GRADIENTS[color].glow;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className={cn("absolute inset-8 -z-10 rounded-full blur-[90px] opacity-50", glow)} />
      <div className="absolute inset-0 flex items-center justify-center p-14">
        <Mascot color={color} variant={variant} />
      </div>

      {variant === "python-ai" ? (
        <>
          <FloatChip className="left-0 top-4" duration={5.5}>
            <CodeChip color={color} />
          </FloatChip>
          <FloatChip className="bottom-6 right-0" delay={0.6} duration={6.5}>
            <CodeChip color={color} />
          </FloatChip>
          <FloatChip className="right-4 top-10" delay={1.2} duration={4.5}>
            <SparkChip color={color} />
          </FloatChip>
          <FloatChip className="bottom-16 left-2" delay={0.3} duration={5}>
            <span className="font-display text-3xl font-bold text-violet-light/70">{"{ }"}</span>
          </FloatChip>
        </>
      ) : (
        <>
          <FloatChip className="left-0 top-8" duration={5.5}>
            <SwatchChip />
          </FloatChip>
          <FloatChip className="bottom-8 right-0" delay={0.6} duration={6}>
            <FrameChip />
          </FloatChip>
          <FloatChip className="right-6 top-4" delay={1} duration={4.5}>
            <SparkChip color={color} />
          </FloatChip>
          <FloatChip className="bottom-20 left-4" delay={0.4} duration={5}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--color-coral-light)" strokeWidth="2">
              <path d="M3 21l3-1 11-11a2 2 0 0 0-3-3L3 17l-1 3z" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </FloatChip>
        </>
      )}
    </div>
  );
}
