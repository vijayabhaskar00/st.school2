import { defineCollection } from "@/lib/cms/collection-types";
import { TrustLogosSchema } from "@/lib/cms/schema";
import { TrustLogosEditor } from "@/components/cms/editors/trust-logos-editor";

export const trustLogosCollection = defineCollection({
  key: "trust-logos",
  label: "Trust Logos",
  description: "The names scrolling through the trust marquee below the hero.",
  group: "Homepage",
  filePath: "content/trust-logos.json",
  schema: TrustLogosSchema,
  Editor: TrustLogosEditor,
});
