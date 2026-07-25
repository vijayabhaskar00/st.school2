"use client";

import { FieldShell } from "./field-shell";

export function NumberField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
}) {
  return (
    <FieldShell label={label} hint={hint}>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(e.target.valueAsNumber || 0)}
        className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm text-paper outline-none transition-colors focus:border-coral/60"
      />
    </FieldShell>
  );
}
