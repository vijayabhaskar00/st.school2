"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { courses } from "@/data/content";

const EASE = [0.16, 1, 0.3, 1] as const;

type FormState = {
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  program: courses[0]?.slug ?? "",
  message: "",
};

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-paper placeholder:text-muted-soft outline-none transition-all duration-200 focus:border-violet/60 focus:ring-2 focus:ring-violet/30 hover:border-white/20";

const labelClass = "text-xs font-semibold uppercase tracking-[0.14em] text-muted-soft";

export function ApplyForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-elevated p-6 sm:p-9">
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-violet/20 blur-[100px]" aria-hidden />

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex min-h-[420px] flex-col items-center justify-center gap-5 text-center"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-acid/15 text-acid">
              <CheckCircle2 className="size-8" strokeWidth={2} />
            </span>
            <h3 className="font-display text-2xl font-medium text-paper">
              Thanks, {form.name.split(" ")[0] || "there"} — we&apos;ll be in touch.
            </h3>
            <p className="max-w-sm text-balance text-sm leading-relaxed text-muted">
              Your application has landed with our admissions team. We review every
              submission personally and typically respond within 2–3 business days.
            </p>
            <button
              type="button"
              onClick={() => {
                setForm(initialState);
                setSubmitted(false);
              }}
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-paper/80 transition-colors hover:text-paper"
            >
              Submit another application
              <ArrowUpRight className="size-4" />
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: EASE }}
            onSubmit={handleSubmit}
            className="relative flex flex-col gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className={labelClass}>
                  Full name
                </label>
                <input
                  id="name"
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ananya Reddy"
                  className={fieldClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className={labelClass}>
                  Phone
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 90000 00000"
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="program" className={labelClass}>
                Program interest
              </label>
              <select
                id="program"
                required
                value={form.program}
                onChange={(e) => update("program", e.target.value)}
                className={cn(fieldClass, "appearance-none bg-ink")}
              >
                {courses.map((course) => (
                  <option key={course.slug} value={course.slug} className="bg-ink-elevated text-paper">
                    {course.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className={labelClass}>
                Tell us a bit about yourself
              </label>
              <textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="What are you working toward, and why now?"
                className={cn(fieldClass, "resize-none")}
              />
            </div>

            <button
              type="submit"
              className="group relative mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-paper px-6 py-3.5 text-sm font-semibold tracking-tight text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(246,244,251,0.2),0_12px_30px_-8px_rgba(124,92,255,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
            >
              Submit application
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
            </button>

            <p className="text-center text-xs text-muted-soft">
              33 seats per cohort. We reply to every serious applicant.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
