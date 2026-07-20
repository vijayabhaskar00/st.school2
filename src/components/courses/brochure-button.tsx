"use client";

import { useState } from "react";
import { Download, Loader2, Check } from "lucide-react";
import type { Course } from "@/data/content";
import { downloadBrochure } from "@/lib/generate-brochure";
import { cn } from "@/lib/utils";

export function BrochureButton({
  course,
  className,
}: {
  course: Course;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleClick = async () => {
    if (status === "loading") return;
    setStatus("loading");
    try {
      await downloadBrochure(course);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("idle");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === "loading"}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-tight text-paper ring-1 ring-inset ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:ring-white/40 disabled:cursor-wait disabled:opacity-70",
        className,
      )}
    >
      {status === "loading" ? (
        <Loader2 className="size-4 animate-spin" strokeWidth={2.5} />
      ) : status === "done" ? (
        <Check className="size-4 text-acid" strokeWidth={2.5} />
      ) : (
        <Download className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" strokeWidth={2.5} />
      )}
      {status === "loading" ? "Preparing PDF…" : status === "done" ? "Downloaded" : "Download Brochure"}
    </button>
  );
}
