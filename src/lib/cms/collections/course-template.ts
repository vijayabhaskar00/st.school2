import { defineCollection } from "@/lib/cms/collection-types";
import { CourseTemplateSchema } from "@/lib/cms/schema";
import { CourseTemplateEditor } from "@/components/cms/editors/course-template-editor";

export const courseTemplateCollection = defineCollection({
  key: "course-template",
  label: "Course page template",
  description: "Shared section headings and closing CTA copy that render on every course's detail page.",
  group: "Programs",
  filePath: "content/course-template.json",
  schema: CourseTemplateSchema,
  Editor: CourseTemplateEditor,
});
