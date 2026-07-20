import type { MetadataRoute } from "next";
import { site, courses } from "@/data/content";

// Static export needs an explicit static config for generated metadata
// routes, or the build fails complaining dynamic/revalidate isn't set.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // next.config.ts sets trailingSlash: true, so real served URLs end in
  // "/" — match that here so the sitemap points at the actual pages.
  const staticPaths = ["/", "/about/", "/contact/", "/courses/"];
  const coursePaths = courses.map((course) => `/courses/${course.slug}/`);

  return [...staticPaths, ...coursePaths].map((path) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
