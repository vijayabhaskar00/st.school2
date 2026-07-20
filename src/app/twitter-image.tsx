import { ImageResponse } from "next/og";
import { site } from "@/data/content";
import { ShareImage, shareImageSize } from "@/lib/share-image";

// Static export needs an explicit static config for generated metadata
// routes, or the build fails complaining dynamic/revalidate isn't set.
export const dynamic = "force-static";

export const alt = `${site.name} — ${site.tagline}`;
export const size = shareImageSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<ShareImage />, { ...size });
}
