"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Prompt = {
  id: string;
  label: string;
  userLine: string;
  response: string;
};

const PROMPTS: Prompt[] = [
  {
    id: "explain",
    label: "Explain this cohort",
    userLine: "explain_cohort()",
    response:
      "St.School's Python + AI cohort ships 3 real products in 14 weeks: a FastAPI backend, a React frontend, and one AI-integrated feature. 33 seats. Mentor-reviewed every week. No toy exercises.",
  },
  {
    id: "path",
    label: "Generate my learning path",
    userLine: "generate_learning_path()",
    response:
      "Weeks 1-3: Python & DSA -> Weeks 4-7: FastAPI + PostgreSQL -> Weeks 8-11: React -> Weeks 12-14: AI integration + capstone. Path ready. Seats: 7 left this cohort.",
  },
  {
    id: "debug",
    label: "Debug this endpoint",
    userLine: "debug(app.get('/cohort'))",
    response:
      "Found it: missing await on the DB call, line 12. Fixed: `return await db.fetch_cohort(id)`. Tests passing. This is week-4 material, by the way.",
  },
];

const TYPE_SPEED_MS = 14;

export function AiTerminal() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "thinking" | "streaming" | "done">("idle");
  const [streamed, setStreamed] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const active = PROMPTS.find((p) => p.id === activeId) ?? null;

  const runPrompt = (prompt: Prompt) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    setActiveId(prompt.id);
    setPhase("thinking");
    setStreamed("");

    timeoutRef.current = setTimeout(() => {
      setPhase("streaming");
      let i = 0;
      intervalRef.current = setInterval(() => {
        i += 2;
        setStreamed(prompt.response.slice(0, i));
        if (i >= prompt.response.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPhase("done");
        }
      }, TYPE_SPEED_MS);
    }, 650);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-ink-elevated/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
        <span className="size-2.5 rounded-full bg-coral/70" />
        <span className="size-2.5 rounded-full bg-acid/70" />
        <span className="size-2.5 rounded-full bg-violet-light/70" />
        <span className="ml-3 flex items-center gap-1.5 text-xs font-medium text-paper/50">
          <Terminal className="size-3.5" strokeWidth={2.5} />
          ai_playground.py
        </span>
      </div>

      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap gap-2.5">
          {PROMPTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => runPrompt(p)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm",
                activeId === p.id
                  ? "border-violet/50 bg-violet/15 text-violet-light"
                  : "border-white/15 bg-white/5 text-paper/75 hover:border-white/30 hover:text-paper",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="min-h-40 rounded-2xl border border-white/10 bg-ink p-4 font-mono text-[13px] leading-relaxed sm:min-h-44 sm:p-5 sm:text-sm">
          {!active && (
            <p className="text-paper/35">
              <span className="text-acid">$</span> pick a prompt above — this actually runs.
            </p>
          )}

          {active && (
            <div className="flex flex-col gap-3">
              <p className="text-violet-light">
                <span className="text-paper/40">{">"}</span> {active.userLine}
              </p>

              {phase === "thinking" && (
                <p className="flex items-center gap-2 text-paper/50">
                  <Sparkles className="size-3.5 animate-pulse text-coral-light" strokeWidth={2.5} />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                  >
                    thinking…
                  </motion.span>
                </p>
              )}

              {(phase === "streaming" || phase === "done") && (
                <p className="text-paper/90">
                  {streamed}
                  {phase === "streaming" && (
                    <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-acid" />
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
