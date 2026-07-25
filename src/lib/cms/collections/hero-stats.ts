import { defineCollection } from "@/lib/cms/collection-types";
import { HeroStatsSchema } from "@/lib/cms/schema";
import { HeroStatsEditor } from "@/components/cms/editors/hero-stats-editor";

export const heroStatsCollection = defineCollection({
  key: "hero-stats",
  label: "Hero stats",
  description: "The small stat row shown in the homepage hero section.",
  group: "Homepage",
  filePath: "content/hero-stats.json",
  schema: HeroStatsSchema,
  Editor: HeroStatsEditor,
});
