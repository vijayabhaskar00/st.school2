"use client";

import { FieldShell } from "./field-shell";

export function TextAreaField({
  label,
  value,
  onChange,
  hint,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
}) {
  return (
    <FieldShell label={label} hint={hint}>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm leading-relaxed text-paper outline-none transition-colors focus:border-coral/60"
      />
    </FieldShell>
  );
}
