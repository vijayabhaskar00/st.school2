"use client";

import type { TestimonialsContent } from "@/lib/cms/schema";
import { TextField, TextAreaField, ObjectListField } from "@/components/cms/fields";

export function TestimonialsEditor({
  value,
  onChange,
}: {
  value: TestimonialsContent;
  onChange: (v: TestimonialsContent) => void;
}) {
  return (
    <ObjectListField
      label="Testimonials"
      items={value}
      onChange={onChange}
      collapsible
      createItem={() => ({ quote: "", name: "", role: "" })}
      itemLabel={(item) => item.name || "New testimonial"}
      renderItem={(item, update) => (
        <>
          <TextAreaField label="Quote" value={item.quote} onChange={(v) => update({ ...item, quote: v })} />
          <TextField label="Name" value={item.name} onChange={(v) => update({ ...item, name: v })} />
          <TextField label="Role" value={item.role} onChange={(v) => update({ ...item, role: v })} />
        </>
      )}
    />
  );
}
