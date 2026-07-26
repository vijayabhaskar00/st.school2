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
  // The default "apply" CTA label, reused across the navbar, footer CTA,
  // sticky course CTA bar, and course apply panel — was previously
  // hardcoded independently in each of those (and had drifted out of sync
  // in one of them), so an admin editing it had to hunt down every copy.
  ctaLabel: z.string().min(1),
  footerTagline: z.string().min(1),
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
  // The program fee, shown on the course page behind a small lead-capture
  // gate (see PricingGate) instead of plainly up front — a standard
  // ed-tech marketing pattern that turns "what does it cost" into a lead
  // instead of a silent bounce. `priceOriginalAmount` is an optional
  // "compare at" price for a strikethrough discount effect; 0 means don't
  // show one.
  priceAmount: z.number().positive(),
  priceOriginalAmount: z.number().min(0).default(0),
  priceCurrency: z.string().min(1).default("₹"),
  priceNote: z.string().default(""),
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

// About page — hero pull-quote (which interpolates the parent brand name,
// so it's split into the two halves either side of the interpolation),
// section eyebrows/headings/descriptions, and the closing CTA copy. All
// previously hardcoded directly in src/app/about/page.tsx.
export const AboutPageSchema = z.object({
  heroEyebrowPrefix: z.string().min(1),
  // The pull-quote headline. `heroQuotePrefix` contains a literal
  // "{parentBrand}" token that's swapped for site.parentBrand at render
  // time; `heroQuoteHighlight` is the second, gradient-highlighted half of
  // the sentence.
  heroQuotePrefix: z.string().min(1),
  heroQuoteHighlight: z.string().min(1),
  storyEyebrow: z.string().min(1),
  storyHeadingPrefix: z.string().min(1),
  storyHeadingHighlight: z.string().min(1),
  whyEyebrow: z.string().min(1),
  whyHeadingPrefix: z.string().min(1),
  whyHeadingHighlight: z.string().min(1),
  whyDescription: z.string().min(1),
  processEyebrow: z.string().min(1),
  processHeadingPrefix: z.string().min(1),
  processHeadingHighlight: z.string().min(1),
  processDescription: z.string().min(1),
  ctaHeading: z.string().min(1),
  ctaExploreLabel: z.string().min(1),
  ctaApplyLabel: z.string().min(1),
});
export type AboutPageContent = z.infer<typeof AboutPageSchema>;

// Contact page — hero eyebrow/H1/subhead and meta description. Previously
// hardcoded directly in src/app/contact/page.tsx.
export const ContactPageSchema = z.object({
  metaDescription: z.string().min(1),
  heroEyebrow: z.string().min(1),
  // The H1, split around the gradient-highlighted last word:
  // `${heroHeadingPrefix} ${heroHeadingHighlight}`.
  heroHeadingPrefix: z.string().min(1),
  heroHeadingHighlight: z.string().min(1),
  heroSubhead: z.string().min(1),
});
export type ContactPageContent = z.infer<typeof ContactPageSchema>;

// Courses (listing) page — masthead H1, eyebrow, intro paragraph, and the
// track-matcher section heading. Previously hardcoded directly in
// src/app/courses/page.tsx.
export const CoursesPageSchema = z.object({
  eyebrow: z.string().min(1),
  // The H1, word-staggered by <StaggerHeadline>; the last word renders
  // highlighted.
  headingPrefix: z.string().min(1),
  headingHighlight: z.string().min(1),
  intro: z.string().min(1),
  matcherEyebrow: z.string().min(1),
  matcherHeadingPrefix: z.string().min(1),
  matcherHeadingHighlight: z.string().min(1),
  matcherDescription: z.string().min(1),
});
export type CoursesPageContent = z.infer<typeof CoursesPageSchema>;

export const CoursesSchema = z
  .array(CourseSchema)
  .min(1)
  .refine(
    (list) => new Set(list.map((c) => c.slug)).size === list.length,
    { message: "Course slugs must be unique — two courses share the same slug." },
  );

// Every course's detail page (src/app/courses/[slug]/page.tsx) is one
// shared template rendered for every program — these section headings and
// closing CTA copy used to be hardcoded directly in that component's JSX,
// which made them sitewide copy hidden in a file only a developer could
// edit. They're pulled out here so editing them changes every course page
// at once.
export const CourseTemplateSchema = z.object({
  // Heading above the outcomes list ("What you'll walk away able to do").
  outcomesHeading: z.string().min(1),
  // Heading above the curriculum timeline ("The roadmap, phase by phase").
  roadmapHeading: z.string().min(1),
  // Heading above the highlights grid ("Built different, on purpose").
  highlightsHeading: z.string().min(1),
  // The closing CTA's heading, e.g. "Ready to apply for {shortName}?". Use
  // the literal token "{shortName}" where the course's short name should be
  // substituted — the page splits on it and renders that portion (and
  // anything after it, like the trailing "?") in the accent gradient, the
  // same way the original hardcoded JSX styled it.
  closingCtaHeading: z.string().min(1),
  // The closing CTA's body paragraph. Use the literal token "{shortName}"
  // anywhere in the sentence where the course's short name should be
  // substituted.
  closingCtaBody: z.string().min(1),
});
export type CourseTemplateContent = z.infer<typeof CourseTemplateSchema>;
