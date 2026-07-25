import { defineCollection } from "@/lib/cms/collection-types";
import { WhyUsSchema } from "@/lib/cms/schema";
import { WhyUsEditor } from "@/components/cms/editors/why-us-editor";

export const whyUsCollection = defineCollection({
  key: "why-us",
  label: "Why Us",
  description: "The reasons-to-choose-us cards shown in the Why Us section on the homepage.",
  filePath: "content/why-us.json",
  schema: WhyUsSchema,
  Editor: WhyUsEditor,
});
