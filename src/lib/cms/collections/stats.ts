import { defineCollection } from "@/lib/cms/collection-types";
import { StatsSchema } from "@/lib/cms/schema";
import { StatsEditor } from "@/components/cms/editors/stats-editor";

export const statsCollection = defineCollection({
  key: "stats",
  label: "Stats",
  description: "The applications, selection, placement, and scholarship stats shown in the homepage stats section.",
  group: "Homepage",
  filePath: "content/stats.json",
  schema: StatsSchema,
  Editor: StatsEditor,
});
