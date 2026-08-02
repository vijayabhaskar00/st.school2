// Central content source for the site — every section, page, and
// component still imports from here, unchanged. What changed is where the
// data itself lives: it's no longer hand-typed in this file, it's loaded
// from content/*.json (the files the CMS admin at /admin edits and commits
// straight to the repo) and validated against the schemas in
// src/lib/cms/schema.ts before anything else in the app ever sees it. A
// malformed edit — wrong type, missing field, bad enum value — fails the
// build here, loudly, instead of silently breaking a component downstream.

import {
  SiteSchema,
  ContactSchema,
  NavLinksSchema,
  HeroStatsSchema,
  TrustLogosSchema,
  StatsSchema,
  ProcessSchema,
  WhyUsSchema,
  TestimonialsSchema,
  FaqsSchema,
  ParentBrandSchema,
  CoursesSchema,
  AboutPageSchema,
  ContactPageSchema,
  CoursesPageSchema,
  CourseTemplateSchema,
  type CourseContent,
  type BatchContent,
} from "@/lib/cms/schema";

import siteJson from "@content/site.json";
import contactJson from "@content/contact.json";
import navLinksJson from "@content/nav-links.json";
import heroStatsJson from "@content/hero-stats.json";
import trustLogosJson from "@content/trust-logos.json";
import statsJson from "@content/stats.json";
import processJson from "@content/process.json";
import whyUsJson from "@content/why-us.json";
import testimonialsJson from "@content/testimonials.json";
import faqsJson from "@content/faqs.json";
import parentBrandJson from "@content/parent-brand.json";
import coursesJson from "@content/courses.json";
import aboutPageJson from "@content/about-page.json";
import contactPageJson from "@content/contact-page.json";
import coursesPageJson from "@content/courses-page.json";
import courseTemplateJson from "@content/course-template.json";

function loadContent<T>(schema: { parse: (v: unknown) => T }, data: unknown, source: string): T {
  try {
    return schema.parse(data);
  } catch (error) {
    // Re-thrown with the source file name attached — the raw Zod error is
    // already descriptive about which field failed, this just says *where*.
    throw new Error(`Invalid content in content/${source}: ${(error as Error).message}`);
  }
}

export const site = loadContent(SiteSchema, siteJson, "site.json");
export const contact = loadContent(ContactSchema, contactJson, "contact.json");
export const navLinks = loadContent(NavLinksSchema, navLinksJson, "nav-links.json");
export const heroStats = loadContent(HeroStatsSchema, heroStatsJson, "hero-stats.json");
export const trustLogos = loadContent(TrustLogosSchema, trustLogosJson, "trust-logos.json");
export const stats = loadContent(StatsSchema, statsJson, "stats.json");
export const process = loadContent(ProcessSchema, processJson, "process.json");
export const whyUs = loadContent(WhyUsSchema, whyUsJson, "why-us.json");
export const testimonials = loadContent(TestimonialsSchema, testimonialsJson, "testimonials.json");
export const faqs = loadContent(FaqsSchema, faqsJson, "faqs.json");
export const parentBrand = loadContent(ParentBrandSchema, parentBrandJson, "parent-brand.json");
export const courses = loadContent(CoursesSchema, coursesJson, "courses.json");
export const aboutPage = loadContent(AboutPageSchema, aboutPageJson, "about-page.json");
export const contactPage = loadContent(ContactPageSchema, contactPageJson, "contact-page.json");
export const coursesPage = loadContent(CoursesPageSchema, coursesPageJson, "courses-page.json");
export const courseTemplate = loadContent(CourseTemplateSchema, courseTemplateJson, "course-template.json");

export type Course = CourseContent;
export type Batch = BatchContent;
