"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { courses, contact } from "@/data/content";

const EASE = [0.16, 1, 0.3, 1] as const;

// This is a static export with no server of its own, so submissions need a
// third-party destination (e.g. Formspree, Web3Forms) — set this once one is
// chosen. Until then handleSubmit below surfaces an honest error instead of
// the fake "we got it" message it used to show for every submission.
const CONTACT_FORM_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT;

type FormState = {
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
};

type FieldKey = keyof FormState;

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  program: courses[0]?.slug ?? "",
  message: "",
};

// Parent stagger for the fields' initial reveal — each field wrapper below
// carries its own `fieldVariants` and inherits "hidden"/"show" from this
// via React context, without needing its own initial/animate props.
const formVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

// text-base (16px) on mobile prevents iOS Safari from auto-zooming the
// viewport when a field is focused (it zooms any input with font-size
// under 16px); the size steps back down to text-sm at sm: for desktop.
const fieldClass =
  "w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-base sm:text-sm text-paper placeholder:text-muted-soft outline-none transition-all duration-200 focus:border-violet/60 focus:ring-2 focus:ring-violet/30 hover:border-white/20";

const labelClass = "text-xs font-semibold uppercase tracking-[0.14em]";

type Status = "idle" | "submitting" | "submitted" | "error";

export function ApplyForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>("idle");
  const [focusedField, setFocusedField] = useState<FieldKey | null>(null);
  const [shakeField, setShakeField] = useState<FieldKey | null>(null);

  function update<K extends FieldKey>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear any pending shake once the learner starts fixing the field.
    setShakeField((prev) => (prev === key ? null : prev));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!CONTACT_FORM_ENDPOINT) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("submitted");
    } catch {
      setStatus("error");
    }
  }

  // Literal hex values matching the --color-violet-light / --color-muted-soft
  // tokens in globals.css — Framer Motion interpolates "color" by parsing
  // the string as an actual color, so a raw var(...) reference won't tween.
  function labelColor(key: FieldKey) {
    return focusedField === key ? "#f2555c" : "#8c8b92";
  }

  function shakeProps(key: FieldKey) {
    return {
      animate: { x: shakeField === key ? [0, -6, 6, -4, 4, 0] : 0 },
      transition: { duration: 0.4 },
      onAnimationComplete: () => setShakeField((prev) => (prev === key ? null : prev)),
      onFocus: () => setFocusedField(key),
      onBlur: () => setFocusedField((prev) => (prev === key ? null : prev)),
      onInvalid: () => setShakeField(key),
      whileFocus: { scale: 1.01 },
    };
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-elevated p-6 sm:p-9">
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-violet/20 blur-[100px]" aria-hidden />

      <AnimatePresence mode="wait">
        {status === "submitted" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex min-h-[420px] flex-col items-center justify-center gap-5 text-center"
          >
            <motion.span
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.1 }}
              className="flex size-16 items-center justify-center rounded-full bg-acid/15 text-acid"
            >
              <CheckCircle2 className="size-8" strokeWidth={2} />
            </motion.span>
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
                setStatus("idle");
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
            variants={formVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.3, ease: EASE } }}
            onSubmit={handleSubmit}
            className="relative flex flex-col gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <motion.div variants={fieldVariants} className="flex flex-col gap-2">
                <motion.label
                  htmlFor="name"
                  animate={{ color: labelColor("name") }}
                  transition={{ duration: 0.2 }}
                  className={labelClass}
                >
                  Full name
                </motion.label>
                <motion.input
                  id="name"
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ananya Reddy"
                  className={fieldClass}
                  {...shakeProps("name")}
                />
              </motion.div>
              <motion.div variants={fieldVariants} className="flex flex-col gap-2">
                <motion.label
                  htmlFor="phone"
                  animate={{ color: labelColor("phone") }}
                  transition={{ duration: 0.2 }}
                  className={labelClass}
                >
                  Phone
                </motion.label>
                <motion.input
                  id="phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 90000 00000"
                  className={fieldClass}
                  {...shakeProps("phone")}
                />
              </motion.div>
            </div>

            <motion.div variants={fieldVariants} className="flex flex-col gap-2">
              <motion.label
                htmlFor="email"
                animate={{ color: labelColor("email") }}
                transition={{ duration: 0.2 }}
                className={labelClass}
              >
                Email
              </motion.label>
              <motion.input
                id="email"
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className={fieldClass}
                {...shakeProps("email")}
              />
            </motion.div>

            <motion.div variants={fieldVariants} className="flex flex-col gap-2">
              <motion.label
                htmlFor="program"
                animate={{ color: labelColor("program") }}
                transition={{ duration: 0.2 }}
                className={labelClass}
              >
                Program interest
              </motion.label>
              <motion.select
                id="program"
                required
                value={form.program}
                onChange={(e) => update("program", e.target.value)}
                className={cn(fieldClass, "appearance-none bg-ink")}
                {...shakeProps("program")}
              >
                {courses.map((course) => (
                  <option key={course.slug} value={course.slug} className="bg-ink-elevated text-paper">
                    {course.shortName}
                  </option>
                ))}
              </motion.select>
            </motion.div>

            <motion.div variants={fieldVariants} className="flex flex-col gap-2">
              <motion.label
                htmlFor="message"
                animate={{ color: labelColor("message") }}
                transition={{ duration: 0.2 }}
                className={labelClass}
              >
                Tell us a bit about yourself
              </motion.label>
              <motion.textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="What are you working toward, and why now?"
                className={cn(fieldClass, "resize-none")}
                {...shakeProps("message")}
              />
            </motion.div>

            {status === "error" && (
              <motion.div
                variants={fieldVariants}
                className="flex items-start gap-2.5 rounded-xl border border-coral/30 bg-coral/10 p-3.5 text-sm text-coral-light"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <span>
                  Something went wrong sending your application. Please email us directly at{" "}
                  <a href={`mailto:${contact.email}`} className="underline underline-offset-2">
                    {contact.email}
                  </a>{" "}
                  in the meantime.
                </span>
              </motion.div>
            )}

            <motion.button
              variants={fieldVariants}
              type="submit"
              disabled={status === "submitting"}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              className="group relative mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-paper px-6 py-3.5 text-sm font-semibold tracking-tight text-ink transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(246,244,251,0.2),0_12px_30px_-8px_rgba(224,33,43,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet disabled:opacity-60"
            >
              {status === "submitting" ? (
                <>
                  Sending…
                  <Loader2 className="size-4 animate-spin" />
                </>
              ) : (
                <>
                  Submit application
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
                </>
              )}
            </motion.button>

            <motion.p variants={fieldVariants} className="text-center text-xs text-muted-soft">
              33 seats per cohort. We reply to every serious applicant.
            </motion.p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
