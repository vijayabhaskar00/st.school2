"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, ChevronRight } from "lucide-react";

// The workhorse array editor: a list of objects (testimonials, FAQs,
// curriculum phases, highlights, courses themselves...), each rendered by
// a caller-supplied `renderItem`. This is what makes writing a new
// collection editor mostly declarative — plug in a shape, a blank-item
// factory, and a field layout; add/remove/reorder come for free.
//
// `collapsible` turns each item into a single-open accordion instead of
// rendering every item's fields at once — essential once items (or the
// list) get long enough that scrolling to the next item, or to "Add",
// becomes a chore. Only one item is expanded at a time; newly added items
// auto-expand so you land straight on their empty fields.
export function ObjectListField<T>({
  label,
  items,
  onChange,
  createItem,
  renderItem,
  itemLabel,
  minItems = 0,
  collapsible = false,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (item: T, update: (next: T) => void, index: number) => React.ReactNode;
  itemLabel?: (item: T, index: number) => string;
  minItems?: number;
  collapsible?: boolean;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function update(i: number, next: T) {
    const copy = [...items];
    copy[i] = next;
    onChange(copy);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
    setExpandedIndex((current) => {
      if (current === null) return current;
      if (current === i) return null;
      return current > i ? current - 1 : current;
    });
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setExpandedIndex((current) => {
      if (current === i) return j;
      if (current === j) return i;
      return current;
    });
  }
  function add() {
    onChange([...items, createItem()]);
    setExpandedIndex(items.length);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-soft">{label}</span>
        <span className="text-xs text-muted-soft">{items.length} item{items.length === 1 ? "" : "s"}</span>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item, i) => {
          const isOpen = !collapsible || expandedIndex === i;
          return (
            <div key={i} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-ink-elevated/60 p-4">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                {collapsible ? (
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isOpen ? null : i)}
                    className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                  >
                    <ChevronRight
                      className={`size-3.5 shrink-0 text-muted-soft transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                    <span className="truncate text-sm font-medium text-paper/80">
                      {itemLabel ? itemLabel(item, i) : `Item ${i + 1}`}
                    </span>
                  </button>
                ) : (
                  <span className="truncate text-sm font-medium text-paper/80">
                    {itemLabel ? itemLabel(item, i) : `Item ${i + 1}`}
                  </span>
                )}
                <div className="flex shrink-0 items-center gap-1.5">
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
                    disabled={items.length <= minItems}
                    aria-label="Remove"
                    className="rounded-md border border-white/10 p-1.5 text-coral-light transition-colors hover:bg-coral/10 disabled:opacity-30"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              {isOpen && <div className="flex flex-col gap-3">{renderItem(item, (next) => update(i, next), i)}</div>}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={add}
        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-paper/80 transition-colors hover:border-white/30 hover:text-paper"
      >
        <Plus className="size-3.5" />
        Add {label.toLowerCase().replace(/s$/, "")}
      </button>
    </div>
  );
}
