import { defineCollection } from "@/lib/cms/collection-types";
import { ContactPageSchema } from "@/lib/cms/schema";
import { ContactPageEditor } from "@/components/cms/editors/contact-page-editor";

export const contactPageCollection = defineCollection({
  key: "contact-page",
  label: "Contact page copy",
  description: "Meta description, hero eyebrow, heading, and subhead on /contact.",
  group: "Pages",
  filePath: "content/contact-page.json",
  schema: ContactPageSchema,
  Editor: ContactPageEditor,
});
