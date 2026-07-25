"use client";

import type { HeroStatsContent } from "@/lib/cms/schema";
import { TextField, NumberField, ObjectListField } from "@/components/cms/fields";

export function HeroStatsEditor({
  value,
  onChange,
}: {
  value: HeroStatsContent;
  onChange: (v: HeroStatsContent) => void;
}) {
  return (
    <ObjectListField
      label="Hero stats"
      items={value}
      onChange={onChange}
      createItem={() => ({ value: 0, suffix: "", label: "" })}
      itemLabel={(item) => item.label || "New stat"}
      renderItem={(item, update) => (
        <>
          <NumberField label="Value" value={item.value} onChange={(v) => update({ ...item, value: v })} />
          <TextField label="Suffix" value={item.suffix} onChange={(v) => update({ ...item, suffix: v })} hint='e.g. "+" or "%"' />
          <TextField label="Label" value={item.label} onChange={(v) => update({ ...item, label: v })} />
        </>
      )}
    />
  );
}
