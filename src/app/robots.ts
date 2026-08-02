import type { MetadataRoute } from "next";
import { site } from "@/data/content";
import { assetBasePath } from "@/lib/base-path";

// Static export needs an explicit static config for generated metadata
// routes, or the build fails complaining dynamic/revalidate isn't set.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // robots directives match from the site root, so on the GitHub Pages
  // deploy (served under GITHUB_PAGES_BASE_PATH) both the disallowed path
  // and the sitemap URL need that prefix or they silently don't apply —
  // see layout.tsx's metadataBase comment for the same basePath issue.
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: `${assetBasePath}/admin`,
    },
    sitemap: `${site.url}${assetBasePath}/sitemap.xml`,
  };
}
