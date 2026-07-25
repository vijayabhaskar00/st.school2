import { defineCollection } from "@/lib/cms/collection-types";
import { ContactSchema } from "@/lib/cms/schema";
import { ContactEditor } from "@/components/cms/editors/contact-editor";

export const contactCollection = defineCollection({
  key: "contact",
  label: "Contact info",
  description: "Email, phone, address, and social links shown on the Contact page and footer.",
  filePath: "content/contact.json",
  schema: ContactSchema,
  Editor: ContactEditor,
});
