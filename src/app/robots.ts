import type { MetadataRoute } from "next";
import { site } from "@/data/content";

// Static export needs an explicit static config for generated metadata
// routes, or the build fails complaining dynamic/revalidate isn't set.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
