"use client";

import type { NavLinksContent } from "@/lib/cms/schema";
import { TextField, ObjectListField } from "@/components/cms/fields";

export function NavLinksEditor({
  value,
  onChange,
}: {
  value: NavLinksContent;
  onChange: (v: NavLinksContent) => void;
}) {
  return (
    <ObjectListField
      label="Nav links"
      items={value}
      onChange={onChange}
      createItem={() => ({ label: "", href: "/" })}
      itemLabel={(item) => item.label || "New link"}
      minItems={1}
      renderItem={(item, update) => (
        <>
          <TextField label="Label" value={item.label} onChange={(v) => update({ ...item, label: v })} />
          <TextField
            label="Link"
            value={item.href}
            onChange={(v) => update({ ...item, href: v })}
            hint="A path like /courses, or an in-page anchor like /#why-us"
          />
        </>
      )}
    />
  );
}
