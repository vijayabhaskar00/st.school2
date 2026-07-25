import { defineCollection } from "@/lib/cms/collection-types";
import { CoursesPageSchema } from "@/lib/cms/schema";
import { CoursesPageEditor } from "@/components/cms/editors/courses-page-editor";

export const coursesPageCollection = defineCollection({
  key: "courses-page",
  label: "Courses page copy",
  description: "Masthead heading, eyebrow, intro paragraph, and track matcher heading on /courses.",
  group: "Pages",
  filePath: "content/courses-page.json",
  schema: CoursesPageSchema,
  Editor: CoursesPageEditor,
});
