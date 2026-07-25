"use client";

import { FieldShell } from "./field-shell";

export function TextField({
  label,
  value,
  onChange,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <FieldShell label={label} hint={hint}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm text-paper outline-none transition-colors focus:border-coral/60"
      />
    </FieldShell>
  );
}
