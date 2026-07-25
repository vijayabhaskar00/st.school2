"use client";

// Shared label/hint chrome so every field primitive looks consistent
// without each one re-implementing the same wrapper markup.
export function FieldShell({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-soft">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-soft">{hint}</span>}
    </label>
  );
}
