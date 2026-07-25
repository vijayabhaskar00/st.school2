"use client";

import type { ParentBrandContent } from "@/lib/cms/schema";
import { TextField, TextAreaField, NumberField, ObjectListField } from "@/components/cms/fields";

export function ParentBrandEditor({
  value,
  onChange,
}: {
  value: ParentBrandContent;
  onChange: (v: ParentBrandContent) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-elevated/60 p-6">
        <NumberField label="Founded" value={value.founded} onChange={(v) => onChange({ ...value, founded: v })} />
        <TextField label="Founder" value={value.founder} onChange={(v) => onChange({ ...value, founder: v })} />
        <TextField label="Headquarters" value={value.hq} onChange={(v) => onChange({ ...value, hq: v })} />
        <TextAreaField
          label="Description"
          value={value.description}
          onChange={(v) => onChange({ ...value, description: v })}
        />
      </div>

      <ObjectListField
        label="Stats"
        items={value.stats}
        onChange={(stats) => onChange({ ...value, stats })}
        createItem={() => ({ value: "", label: "" })}
        itemLabel={(item) => item.label || "New stat"}
        renderItem={(item, update) => (
          <>
            <TextField label="Value" value={item.value} onChange={(v) => update({ ...item, value: v })} hint='e.g. "1M+" or "Forbes"' />
            <TextField label="Label" value={item.label} onChange={(v) => update({ ...item, label: v })} />
          </>
        )}
      />
    </div>
  );
}
