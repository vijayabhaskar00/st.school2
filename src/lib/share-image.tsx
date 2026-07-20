// Shared visual for the generated opengraph-image / twitter-image routes.
// Not a route itself (no `opengraph-image`/`twitter-image` file name), so
// Next.js does not treat it as a metadata file convention.
import { site } from "@/data/content";

export const shareImageSize = { width: 1200, height: 630 };

// Brand tokens from src/app/globals.css, hardcoded because ImageResponse
// renders outside the browser and can't read CSS custom properties.
const COLOR_INK = "#0d0d0f";
const COLOR_BRAND_RED = "#e0212b";
const COLOR_BRAND_CHARCOAL = "#2b2b2e";
const COLOR_BRAND_MIST = "#e8e8ea";
const COLOR_PAPER = "#f6f5f3";

export function ShareImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLOR_INK,
        backgroundImage: `radial-gradient(circle at 78% 18%, ${COLOR_BRAND_CHARCOAL} 0%, ${COLOR_INK} 55%)`,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 104,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        <span style={{ color: COLOR_BRAND_RED }}>st.</span>
        <span style={{ color: COLOR_PAPER, marginLeft: 22 }}>School</span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 32,
          fontSize: 34,
          color: COLOR_BRAND_MIST,
        }}
      >
        {site.tagline}
      </div>
    </div>
  );
}
