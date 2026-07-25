import { defineCollection } from "@/lib/cms/collection-types";
import { SiteSchema } from "@/lib/cms/schema";
import { SiteEditor } from "@/components/cms/editors/site-editor";

export const siteCollection = defineCollection({
  key: "site",
  label: "Site settings",
  description: "Brand name, tagline, SEO description, city, and canonical URL.",
  filePath: "content/site.json",
  schema: SiteSchema,
  Editor: SiteEditor,
});
