"use client";

import type { FaqsContent } from "@/lib/cms/schema";
import { TextField, TextAreaField, ObjectListField } from "@/components/cms/fields";

export function FaqsEditor({ value, onChange }: { value: FaqsContent; onChange: (v: FaqsContent) => void }) {
  return (
    <ObjectListField
      label="FAQs"
      items={value}
      onChange={onChange}
      collapsible
      createItem={() => ({ question: "", answer: "" })}
      itemLabel={(item) => item.question || "New FAQ"}
      renderItem={(item, update) => (
        <>
          <TextField label="Question" value={item.question} onChange={(v) => update({ ...item, question: v })} />
          <TextAreaField label="Answer" value={item.answer} onChange={(v) => update({ ...item, answer: v })} />
        </>
      )}
    />
  );
}
