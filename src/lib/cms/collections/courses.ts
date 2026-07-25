import { defineCollection } from "@/lib/cms/collection-types";
import { CoursesSchema } from "@/lib/cms/schema";
import { CoursesEditor } from "@/components/cms/editors/courses-editor";

export const coursesCollection = defineCollection({
  key: "courses",
  label: "Courses",
  description: "Every course program — curriculum, highlights, seats, and application deadlines.",
  group: "Programs",
  filePath: "content/courses.json",
  schema: CoursesSchema,
  Editor: CoursesEditor,
});
