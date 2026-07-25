import type { ComponentType } from "react";
import type { ZodType } from "zod";

export const CMS_GROUPS = ["Homepage", "Programs", "Company & Navigation"] as const;
export type CmsGroup = (typeof CMS_GROUPS)[number];

export type CollectionConfig<T> = {
  /** Stable slug used in the admin's URL hash and as a React key — must be unique. */
  key: string;
  label: string;
  description: string;
  /** Which section of the dashboard this collection is grouped under. */
  group: CmsGroup;
  /** Repo-relative path, e.g. "content/site.json". */
  filePath: string;
  schema: ZodType<T>;
  Editor: ComponentType<{ value: T; onChange: (value: T) => void }>;
};

// The registry holds configs for many different content shapes at once —
// erasing to `unknown` here (via this helper) is what lets a single array
// hold a CollectionConfig<SiteContent> next to a CollectionConfig<Course[]>
// while each individual collection module still gets full inference at
// its own definition site.
export function defineCollection<T>(config: CollectionConfig<T>): CollectionConfig<unknown> {
  return config as unknown as CollectionConfig<unknown>;
}
