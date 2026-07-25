"use client";

import type { TrustLogosContent } from "@/lib/cms/schema";
import { StringListField } from "@/components/cms/fields";

export function TrustLogosEditor({
  value,
  onChange,
}: {
  value: TrustLogosContent;
  onChange: (v: TrustLogosContent) => void;
}) {
  return <StringListField label="Trust logos" items={value} onChange={onChange} itemPlaceholder="e.g. T-Hub" />;
}
