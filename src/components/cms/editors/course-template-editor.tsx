"use client";

import type { CourseTemplateContent } from "@/lib/cms/schema";
import { TextField, TextAreaField } from "@/components/cms/fields";

export function CourseTemplateEditor({
  value,
  onChange,
}: {
  value: CourseTemplateContent;
  onChange: (v: CourseTemplateContent) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-elevated/60 p-6">
      <TextField
        label="Outcomes heading"
        value={value.outcomesHeading}
        onChange={(v) => onChange({ ...value, outcomesHeading: v })}
        hint="Sits above the outcomes list on every course's detail page."
      />
      <TextField
        label="Roadmap heading"
        value={value.roadmapHeading}
        onChange={(v) => onChange({ ...value, roadmapHeading: v })}
        hint="Sits above the curriculum timeline on every course's detail page."
      />
      <TextField
        label="Highlights heading"
        value={value.highlightsHeading}
        onChange={(v) => onChange({ ...value, highlightsHeading: v })}
        hint="Sits above the highlights grid on every course's detail page."
      />
      <TextField
        label="Closing CTA heading"
        value={value.closingCtaHeading}
        onChange={(v) => onChange({ ...value, closingCtaHeading: v })}
        hint={`Include the literal token "{shortName}" where the course's short name should appear — that part (plus anything after it, like a trailing "?") renders in the accent gradient, e.g. "Ready to apply for {shortName}?"`}
      />
      <TextAreaField
        label="Closing CTA body"
        value={value.closingCtaBody}
        onChange={(v) => onChange({ ...value, closingCtaBody: v })}
        hint={`Include the literal token "{shortName}" anywhere the course's short name should be substituted.`}
      />
    </div>
  );
}
