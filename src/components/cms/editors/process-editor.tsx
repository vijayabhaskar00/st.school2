"use client";

import type { ProcessContent } from "@/lib/cms/schema";
import { TextField, TextAreaField, ObjectListField } from "@/components/cms/fields";

export function ProcessEditor({ value, onChange }: { value: ProcessContent; onChange: (v: ProcessContent) => void }) {
  return (
    <ObjectListField
      label="Process steps"
      items={value}
      onChange={onChange}
      createItem={() => ({ step: "", title: "", description: "" })}
      itemLabel={(item) => `${item.step} ${item.title}`.trim() || "New step"}
      renderItem={(item, update) => (
        <>
          <TextField label="Step" value={item.step} onChange={(v) => update({ ...item, step: v })} hint='e.g. "01"' />
          <TextField label="Title" value={item.title} onChange={(v) => update({ ...item, title: v })} />
          <TextAreaField
            label="Description"
            value={item.description}
            onChange={(v) => update({ ...item, description: v })}
          />
        </>
      )}
    />
  );
}
