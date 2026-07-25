import { z } from "zod";

// The schema is the single source of truth for both compile-time types
// (via z.infer) and runtime validation. Every content/*.json file is
// parsed against its schema in src/data/content.ts at import time — so a
// malformed CMS edit (wrong type, missing required field, bad enum value)
// fails the production build loudly, before it ever reaches a page,
// instead of silently breaking a component that assumed a shape.

export const SiteSchema = z.object({
  name: z.string().min(1),
  parentBrand: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  city: z.string().min(1),
  url: z.string().url(),
});
export type SiteContent = z.infer<typeof SiteSchema>;

export const ContactSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  socials: z.array(
    z.object({
      label: z.string().min(1),
      href: z.string().url(),
    }),
  ),
});
export type ContactContent = z.infer<typeof ContactSchema>;

export const NavLinksSchema = z.array(
  z.object({
    label: z.string().min(1),
    href: z.string().min(1),
  }),
);
export type NavLinksContent = z.infer<typeof NavLinksSchema>;

export const HeroStatsSchema = z.array(
  z.object({
    value: z.number(),
    suffix: z.string(),
    label: z.string().min(1),
  }),
);
export type HeroStatsContent = z.infer<typeof HeroStatsSchema>;

export const TrustLogosSchema = z.array(z.string().min(1));
export type TrustLogosContent = z.infer<typeof TrustLogosSchema>;

export const StatsSchema = z.array(
  z.object({
    value: z.number(),
    prefix: z.string().optional(),
    suffix: z.string(),
    label: z.string().min(1),
    detail: z.string().min(1),
  }),
);
export type StatsContent = z.infer<typeof StatsSchema>;

export const ProcessSchema = z.array(
  z.object({
    step: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
  }),
);
export type ProcessContent = z.infer<typeof ProcessSchema>;

export const WhyUsSchema = z.array(
  z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
);
export type WhyUsContent = z.infer<typeof WhyUsSchema>;

export const TestimonialsSchema = z.array(
  z.object({
    quote: z.string().min(1),
    name: z.string().min(1),
    role: z.string().min(1),
  }),
);
export type TestimonialsContent = z.infer<typeof TestimonialsSchema>;

export const FaqsSchema = z.array(
  z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
  }),
);
export type FaqsContent = z.infer<typeof FaqsSchema>;

export const ParentBrandSchema = z.object({
  founded: z.number(),
  founder: z.string().min(1),
  hq: z.string().min(1),
  stats: z.array(
    z.object({
      value: z.string().min(1),
      label: z.string().min(1),
    }),
  ),
  description: z.string().min(1),
});
export type ParentBrandContent = z.infer<typeof ParentBrandSchema>;

export const CourseSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  tagline: z.string().min(1),
  duration: z.string().min(1),
  mode: z.string().min(1),
  level: z.string().min(1),
  summary: z.string().min(1),
  color: z.enum(["violet", "coral"]),
  // Which bespoke hero visual + "try it yourself" interactive section this
  // course's detail page gets. Used to be guessed from the slug
  // (`slug === "ui-ux-design" ? ... : ...`) — a third course would have
  // silently fallen into the Python-flavored template. Explicit and
  // CMS-editable instead: "generic" gets a template-agnostic hero and
  // skips the bonus interactive section rather than being force-fit into
  // either bespoke template.
  template: z.enum(["python-ai", "ui-ux", "generic"]).default("generic"),
  stack: z.array(z.string().min(1)).min(1),
  outcomes: z.array(z.string().min(1)).min(1),
  curriculum: z
    .array(
      z.object({
        phase: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        topics: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
  highlights: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(1),
  // ISO datetime — when this cohort's applications close. Keep this rolling/updated.
  applicationDeadline: z.string().min(1),
  seatsTotal: z.number().int().positive(),
  seatsClaimed: z.number().int().min(0),
});
export type CourseContent = z.infer<typeof CourseSchema>;

export const CoursesSchema = z
  .array(CourseSchema)
  .min(1)
  .refine(
    (list) => new Set(list.map((c) => c.slug)).size === list.length,
    { message: "Course slugs must be unique — two courses share the same slug." },
  );
