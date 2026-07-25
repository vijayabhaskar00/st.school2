import { defineCollection } from "@/lib/cms/collection-types";
import { CoursesSchema } from "@/lib/cms/schema";
import { CoursesEditor } from "@/components/cms/editors/courses-editor";

export const coursesCollection = defineCollection({
  key: "courses",
  label: "Courses",
  description: "The two course programs — curriculum, highlights, seats, and application deadlines.",
  filePath: "content/courses.json",
  schema: CoursesSchema,
  Editor: CoursesEditor,
});
