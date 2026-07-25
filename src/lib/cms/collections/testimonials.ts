import { defineCollection } from "@/lib/cms/collection-types";
import { TestimonialsSchema } from "@/lib/cms/schema";
import { TestimonialsEditor } from "@/components/cms/editors/testimonials-editor";

export const testimonialsCollection = defineCollection({
  key: "testimonials",
  label: "Testimonials",
  description: "Student quotes shown in the testimonials section on the homepage.",
  group: "Homepage",
  filePath: "content/testimonials.json",
  schema: TestimonialsSchema,
  Editor: TestimonialsEditor,
});
