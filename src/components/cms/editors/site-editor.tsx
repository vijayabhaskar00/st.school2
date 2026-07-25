"use client";

import type { SiteContent } from "@/lib/cms/schema";
import { TextField, TextAreaField } from "@/components/cms/fields";

export function SiteEditor({ value, onChange }: { value: SiteContent; onChange: (v: SiteContent) => void }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-elevated/60 p-6">
      <TextField label="Site name" value={value.name} onChange={(v) => onChange({ ...value, name: v })} />
      <TextField
        label="Parent brand"
        value={value.parentBrand}
        onChange={(v) => onChange({ ...value, parentBrand: v })}
      />
      <TextField
        label="Tagline"
        value={value.tagline}
        onChange={(v) => onChange({ ...value, tagline: v })}
        hint="Used in the browser tab title and social share cards."
      />
      <TextAreaField
        label="Description"
        value={value.description}
        onChange={(v) => onChange({ ...value, description: v })}
        hint="Used as the default meta description across the site."
      />
      <TextField label="City" value={value.city} onChange={(v) => onChange({ ...value, city: v })} />
      <TextField
        label="Canonical URL"
        value={value.url}
        onChange={(v) => onChange({ ...value, url: v })}
        hint="Include the protocol, e.g. https://st.school"
      />
      <TextField
        label="Apply CTA label"
        value={value.ctaLabel}
        onChange={(v) => onChange({ ...value, ctaLabel: v })}
        hint='Used on every "apply" button across the site — navbar, footer, sticky course bar, and course apply panel.'
      />
      <TextField
        label="Footer tagline"
        value={value.footerTagline}
        onChange={(v) => onChange({ ...value, footerTagline: v })}
        hint="The short line under the footer's brand column."
      />
    </div>
  );
}
