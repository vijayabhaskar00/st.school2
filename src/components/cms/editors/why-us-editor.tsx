"use client";

import type { WhyUsContent } from "@/lib/cms/schema";
import { TextField, TextAreaField, ObjectListField } from "@/components/cms/fields";

export function WhyUsEditor({ value, onChange }: { value: WhyUsContent; onChange: (v: WhyUsContent) => void }) {
  return (
    <ObjectListField
      label="Why us"
      items={value}
      onChange={onChange}
      createItem={() => ({ title: "", description: "" })}
      itemLabel={(item) => item.title || "New reason"}
      renderItem={(item, update) => (
        <>
          <TextField label="Title" value={item.title} onChange={(v) => update({ ...item, title: v })} />
          <TextAreaField label="Description" value={item.description} onChange={(v) => update({ ...item, description: v })} />
        </>
      )}
    />
  );
}
