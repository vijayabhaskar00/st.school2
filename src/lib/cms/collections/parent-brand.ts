import { defineCollection } from "@/lib/cms/collection-types";
import { ParentBrandSchema } from "@/lib/cms/schema";
import { ParentBrandEditor } from "@/components/cms/editors/parent-brand-editor";

export const parentBrandCollection = defineCollection({
  key: "parent-brand",
  label: "Parent brand",
  description:
    "Student Tribe details shown on the About page — founding info and the 'a decade of Student Tribe' stat row (1M+ students, 500+ campuses, 10+ years, Forbes 30 Under 30).",
  group: "Company & Navigation",
  filePath: "content/parent-brand.json",
  schema: ParentBrandSchema,
  Editor: ParentBrandEditor,
});
