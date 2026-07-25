import { defineCollection } from "@/lib/cms/collection-types";
import { FaqsSchema } from "@/lib/cms/schema";
import { FaqsEditor } from "@/components/cms/editors/faqs-editor";

export const faqsCollection = defineCollection({
  key: "faqs",
  label: "FAQs",
  description: "The frequently-asked-questions accordion shown on the homepage.",
  filePath: "content/faqs.json",
  schema: FaqsSchema,
  Editor: FaqsEditor,
});
