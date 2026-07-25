import { defineCollection } from "@/lib/cms/collection-types";
import { NavLinksSchema } from "@/lib/cms/schema";
import { NavLinksEditor } from "@/components/cms/editors/nav-links-editor";

export const navLinksCollection = defineCollection({
  key: "nav-links",
  label: "Navigation",
  description: "The links shown in the header nav and footer.",
  filePath: "content/nav-links.json",
  schema: NavLinksSchema,
  Editor: NavLinksEditor,
});
