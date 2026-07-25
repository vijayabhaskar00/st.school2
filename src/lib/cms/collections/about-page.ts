import { defineCollection } from "@/lib/cms/collection-types";
import { AboutPageSchema } from "@/lib/cms/schema";
import { AboutPageEditor } from "@/components/cms/editors/about-page-editor";

export const aboutPageCollection = defineCollection({
  key: "about-page",
  label: "About page copy",
  description: "Hero pull-quote, section eyebrows/headings, and closing CTA copy on /about.",
  group: "Pages",
  filePath: "content/about-page.json",
  schema: AboutPageSchema,
  Editor: AboutPageEditor,
});
