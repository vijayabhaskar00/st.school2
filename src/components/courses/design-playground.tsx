"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Hand } from "lucide-react";
import { cn } from "@/lib/utils";

type Piece = {
  id: string;
  kind: "swatch" | "button" | "text" | "frame" | "avatar";
  x: number;
  y: number;
  rotate?: number;
};

const PIECES: Piece[] = [
  { id: "swatch-1", kind: "swatch", x: 6, y: 10, rotate: -4 },
  { id: "swatch-2", kind: "swatch", x: 16, y: 62, rotate: 6 },
  { id: "button", kind: "button", x: 30, y: 30 },
  { id: "text", kind: "text", x: 58, y: 12, rotate: -2 },
  { id: "frame", kind: "frame", x: 62, y: 48, rotate: 3 },
  { id: "avatar", kind: "avatar", x: 84, y: 18 },
];

function PieceContent({ kind, index }: { kind: Piece["kind"]; index: number }) {
  const swatchColors = ["bg-coral", "bg-violet", "bg-acid"];

  switch (kind) {
    case "swatch":
      return <div className={cn("size-11 rounded-full shadow-lg", swatchColors[index % swatchColors.length])} />;
    case "button":
      return (
        <div className="rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-ink shadow-lg">
          Apply Now
        </div>
      );
    case "text":
      return (
        <div className="flex w-28 flex-col gap-1.5 rounded-xl border border-white/15 bg-ink-elevated/90 p-3 shadow-lg">
          <div className="h-2 w-full rounded-full bg-paper/30" />
          <div className="h-2 w-2/3 rounded-full bg-paper/20" />
        </div>
      );
    case "frame":
      return (
        <div className="relative size-16 rounded-lg border-2 border-dashed border-coral-light/70 bg-ink-elevated/60 shadow-lg">
          {["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"].map((pos) => (
            <span key={pos} className={cn("absolute size-1.5 rounded-[2px] bg-coral-light", pos)} />
          ))}
        </div>
      );
    case "avatar":
      return (
        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-light to-coral text-sm font-bold text-ink shadow-lg">
          UX
        </div>
      );
  }
}

export function DesignPlayground() {
  const boundsRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={boundsRef}
      className="relative h-72 w-full overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,75,75,0.08),transparent_60%)] sm:h-80"
      style={{
        backgroundImage:
          "linear-gradient(rgba(246,244,251,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(246,244,251,0.05) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="pointer-events-none absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-paper/80 backdrop-blur-sm">
        <Hand className="size-3.5 text-coral-light" strokeWidth={2.5} />
        Drag these around — that&apos;s the job
      </div>

      {PIECES.map((piece, i) => (
        <motion.div
          key={piece.id}
          drag
          dragConstraints={boundsRef}
          dragElastic={0.12}
          dragMomentum={false}
          whileDrag={{ scale: 1.12, zIndex: 30, cursor: "grabbing" }}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, scale: 0.6, rotate: piece.rotate ?? 0 }}
          animate={{ opacity: 1, scale: 1, rotate: piece.rotate ?? 0 }}
          transition={{ delay: 0.15 + i * 0.08, type: "spring", damping: 14 }}
          className="absolute z-10 cursor-grab touch-none select-none active:cursor-grabbing"
          style={{ left: `${piece.x}%`, top: `${piece.y}%` }}
        >
          <PieceContent kind={piece.kind} index={i} />
        </motion.div>
      ))}
    </div>
  );
}
