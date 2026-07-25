import { defineCollection } from "@/lib/cms/collection-types";
import { ProcessSchema } from "@/lib/cms/schema";
import { ProcessEditor } from "@/components/cms/editors/process-editor";

export const processCollection = defineCollection({
  key: "process",
  label: "Process steps",
  description: "The 5-step application process shown on the homepage and About page.",
  filePath: "content/process.json",
  schema: ProcessSchema,
  Editor: ProcessEditor,
});
