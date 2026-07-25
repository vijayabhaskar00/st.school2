"use client";

import type { AboutPageContent } from "@/lib/cms/schema";
import { TextField, TextAreaField } from "@/components/cms/fields";

export function AboutPageEditor({
  value,
  onChange,
}: {
  value: AboutPageContent;
  onChange: (v: AboutPageContent) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-elevated/60 p-6">
      <TextField
        label="Hero eyebrow prefix"
        value={value.heroEyebrowPrefix}
        onChange={(v) => onChange({ ...value, heroEyebrowPrefix: v })}
        hint='Rendered as "<this> {site name}" above the hero pull-quote.'
      />
      <TextAreaField
        label="Hero pull-quote (before highlight)"
        value={value.heroQuotePrefix}
        onChange={(v) => onChange({ ...value, heroQuotePrefix: v })}
        hint='Include the literal token "{parentBrand}" where the parent brand name should appear.'
      />
      <TextAreaField
        label="Hero pull-quote (highlighted half)"
        value={value.heroQuoteHighlight}
        onChange={(v) => onChange({ ...value, heroQuoteHighlight: v })}
        hint="Rendered right after the prefix, in the gradient highlight color."
      />
      <TextField
        label="Story eyebrow"
        value={value.storyEyebrow}
        onChange={(v) => onChange({ ...value, storyEyebrow: v })}
      />
      <TextField
        label="Story heading (before highlight)"
        value={value.storyHeadingPrefix}
        onChange={(v) => onChange({ ...value, storyHeadingPrefix: v })}
      />
      <TextField
        label="Story heading (highlighted)"
        value={value.storyHeadingHighlight}
        onChange={(v) => onChange({ ...value, storyHeadingHighlight: v })}
      />
      <TextField
        label="Why we exist — eyebrow"
        value={value.whyEyebrow}
        onChange={(v) => onChange({ ...value, whyEyebrow: v })}
      />
      <TextField
        label="Why we exist — heading (before highlight)"
        value={value.whyHeadingPrefix}
        onChange={(v) => onChange({ ...value, whyHeadingPrefix: v })}
      />
      <TextField
        label="Why we exist — heading (highlighted)"
        value={value.whyHeadingHighlight}
        onChange={(v) => onChange({ ...value, whyHeadingHighlight: v })}
      />
      <TextAreaField
        label="Why we exist — description"
        value={value.whyDescription}
        onChange={(v) => onChange({ ...value, whyDescription: v })}
      />
      <TextField
        label="Process — eyebrow"
        value={value.processEyebrow}
        onChange={(v) => onChange({ ...value, processEyebrow: v })}
      />
      <TextField
        label="Process — heading (before highlight)"
        value={value.processHeadingPrefix}
        onChange={(v) => onChange({ ...value, processHeadingPrefix: v })}
      />
      <TextField
        label="Process — heading (highlighted)"
        value={value.processHeadingHighlight}
        onChange={(v) => onChange({ ...value, processHeadingHighlight: v })}
      />
      <TextAreaField
        label="Process — description"
        value={value.processDescription}
        onChange={(v) => onChange({ ...value, processDescription: v })}
      />
      <TextField
        label="Closing CTA heading"
        value={value.ctaHeading}
        onChange={(v) => onChange({ ...value, ctaHeading: v })}
      />
      <TextField
        label="Closing CTA — explore button label"
        value={value.ctaExploreLabel}
        onChange={(v) => onChange({ ...value, ctaExploreLabel: v })}
      />
      <TextField
        label="Closing CTA — apply button label"
        value={value.ctaApplyLabel}
        onChange={(v) => onChange({ ...value, ctaApplyLabel: v })}
      />
    </div>
  );
}
