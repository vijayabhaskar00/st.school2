"use client";

import type { ContactContent } from "@/lib/cms/schema";
import { TextField, ObjectListField } from "@/components/cms/fields";

export function ContactEditor({ value, onChange }: { value: ContactContent; onChange: (v: ContactContent) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-elevated/60 p-6">
        <TextField label="Email" value={value.email} onChange={(v) => onChange({ ...value, email: v })} />
        <TextField label="Phone" value={value.phone} onChange={(v) => onChange({ ...value, phone: v })} />
        <TextField label="Address" value={value.address} onChange={(v) => onChange({ ...value, address: v })} />
      </div>

      <ObjectListField
        label="Socials"
        items={value.socials}
        onChange={(socials) => onChange({ ...value, socials })}
        createItem={() => ({ label: "", href: "" })}
        itemLabel={(item) => item.label || "New social link"}
        renderItem={(item, update) => (
          <>
            <TextField label="Platform" value={item.label} onChange={(v) => update({ ...item, label: v })} />
            <TextField label="URL" value={item.href} onChange={(v) => update({ ...item, href: v })} />
          </>
        )}
      />
    </div>
  );
}
