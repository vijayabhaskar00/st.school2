import type { CollectionConfig } from "@/lib/cms/collection-types";
import { siteCollection } from "./site";
import { contactCollection } from "./contact";
import { navLinksCollection } from "./nav-links";
import { heroStatsCollection } from "./hero-stats";
import { statsCollection } from "./stats";
import { coursesCollection } from "./courses";
import { courseTemplateCollection } from "./course-template";
import { processCollection } from "./process";
import { whyUsCollection } from "./why-us";
import { testimonialsCollection } from "./testimonials";
import { faqsCollection } from "./faqs";
import { parentBrandCollection } from "./parent-brand";
import { trustLogosCollection } from "./trust-logos";
import { aboutPageCollection } from "./about-page";
import { contactPageCollection } from "./contact-page";
import { coursesPageCollection } from "./courses-page";

// The dashboard's list, in display order. Each entry is built in its own
// file (./site.ts, ./contact.ts, ...) — add a new one here once its
// collection file exists.
export const cmsCollections: CollectionConfig<unknown>[] = [
  siteCollection,
  heroStatsCollection,
  coursesCollection,
  courseTemplateCollection,
  statsCollection,
  processCollection,
  whyUsCollection,
  testimonialsCollection,
  faqsCollection,
  trustLogosCollection,
  parentBrandCollection,
  contactCollection,
  navLinksCollection,
  aboutPageCollection,
  contactPageCollection,
  coursesPageCollection,
];
