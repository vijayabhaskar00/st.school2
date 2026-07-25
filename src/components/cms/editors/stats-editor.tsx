"use client";

import type { StatsContent } from "@/lib/cms/schema";
import { TextField, TextAreaField, NumberField, ObjectListField } from "@/components/cms/fields";

export function StatsEditor({ value, onChange }: { value: StatsContent; onChange: (v: StatsContent) => void }) {
  return (
    <ObjectListField
      label="Stats"
      items={value}
      onChange={onChange}
      createItem={() => ({ value: 0, prefix: undefined, suffix: "", label: "", detail: "" })}
      itemLabel={(item) => item.label || "New stat"}
      renderItem={(item, update) => (
        <>
          <NumberField label="Value" value={item.value} onChange={(v) => update({ ...item, value: v })} />
          <TextField
            label="Prefix"
            value={item.prefix ?? ""}
            onChange={(v) => update({ ...item, prefix: v || undefined })}
            hint='Optional, e.g. "₹"'
          />
          <TextField label="Suffix" value={item.suffix} onChange={(v) => update({ ...item, suffix: v })} hint='e.g. "+" or "%"' />
          <TextField label="Label" value={item.label} onChange={(v) => update({ ...item, label: v })} />
          <TextAreaField label="Detail" value={item.detail} onChange={(v) => update({ ...item, detail: v })} />
        </>
      )}
    />
  );
}
