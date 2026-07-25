"use client";

import type { ContactPageContent } from "@/lib/cms/schema";
import { TextField, TextAreaField } from "@/components/cms/fields";

export function ContactPageEditor({
  value,
  onChange,
}: {
  value: ContactPageContent;
  onChange: (v: ContactPageContent) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-elevated/60 p-6">
      <TextAreaField
        label="Meta description"
        value={value.metaDescription}
        onChange={(v) => onChange({ ...value, metaDescription: v })}
        hint="Used as the page's SEO meta description."
      />
      <TextField
        label="Hero eyebrow"
        value={value.heroEyebrow}
        onChange={(v) => onChange({ ...value, heroEyebrow: v })}
      />
      <TextField
        label="Hero heading (before highlight)"
        value={value.heroHeadingPrefix}
        onChange={(v) => onChange({ ...value, heroHeadingPrefix: v })}
      />
      <TextField
        label="Hero heading (highlighted)"
        value={value.heroHeadingHighlight}
        onChange={(v) => onChange({ ...value, heroHeadingHighlight: v })}
      />
      <TextAreaField
        label="Hero subhead"
        value={value.heroSubhead}
        onChange={(v) => onChange({ ...value, heroSubhead: v })}
      />
    </div>
  );
}
