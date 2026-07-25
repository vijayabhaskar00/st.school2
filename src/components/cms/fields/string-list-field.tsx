"use client";

import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

// A plain list of strings — stack tags, curriculum topics, trust logos.
// Deliberately simpler than ObjectListField: no per-item schema, just a
// text input per row.
export function StringListField({
  label,
  items,
  onChange,
  itemPlaceholder = "New item",
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  itemPlaceholder?: string;
}) {
  function update(i: number, value: string) {
    const next = [...items];
    next[i] = value;
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-soft">{label}</span>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              placeholder={itemPlaceholder}
              onChange={(e) => update(i, e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm text-paper outline-none transition-colors focus:border-coral/60"
            />
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              aria-label="Move up"
              className="rounded-md border border-white/10 p-1.5 text-muted-soft transition-colors hover:text-paper disabled:opacity-30"
            >
              <ChevronUp className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
              aria-label="Move down"
              className="rounded-md border border-white/10 p-1.5 text-muted-soft transition-colors hover:text-paper disabled:opacity-30"
            >
              <ChevronDown className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove"
              className="rounded-md border border-white/10 p-1.5 text-coral-light transition-colors hover:bg-coral/10"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-paper/80 transition-colors hover:border-white/30 hover:text-paper"
      >
        <Plus className="size-3.5" />
        Add
      </button>
    </div>
  );
}
