"use client";

import type { CoursesPageContent } from "@/lib/cms/schema";
import { TextField, TextAreaField } from "@/components/cms/fields";

export function CoursesPageEditor({
  value,
  onChange,
}: {
  value: CoursesPageContent;
  onChange: (v: CoursesPageContent) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-elevated/60 p-6">
      <TextField
        label="Eyebrow"
        value={value.eyebrow}
        onChange={(v) => onChange({ ...value, eyebrow: v })}
      />
      <TextField
        label="Heading (before highlight)"
        value={value.headingPrefix}
        onChange={(v) => onChange({ ...value, headingPrefix: v })}
      />
      <TextField
        label="Heading (highlighted)"
        value={value.headingHighlight}
        onChange={(v) => onChange({ ...value, headingHighlight: v })}
      />
      <TextAreaField
        label="Intro paragraph"
        value={value.intro}
        onChange={(v) => onChange({ ...value, intro: v })}
      />
      <TextField
        label="Track matcher — eyebrow"
        value={value.matcherEyebrow}
        onChange={(v) => onChange({ ...value, matcherEyebrow: v })}
      />
      <TextField
        label="Track matcher — heading (before highlight)"
        value={value.matcherHeadingPrefix}
        onChange={(v) => onChange({ ...value, matcherHeadingPrefix: v })}
      />
      <TextField
        label="Track matcher — heading (highlighted)"
        value={value.matcherHeadingHighlight}
        onChange={(v) => onChange({ ...value, matcherHeadingHighlight: v })}
      />
      <TextAreaField
        label="Track matcher — description"
        value={value.matcherDescription}
        onChange={(v) => onChange({ ...value, matcherDescription: v })}
      />
    </div>
  );
}
