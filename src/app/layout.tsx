import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SiteChrome } from "@/components/layout/site-chrome";
import { site } from "@/data/content";
import { assetBasePath } from "@/lib/base-path";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // On the homepage specifically, Next re-derives the opengraph-image /
  // twitter-image <meta> tags from the auto-detected file-convention
  // routes (app/opengraph-image.tsx, app/twitter-image.tsx) rather than
  // the explicit `openGraph.images` / `twitter.images` below — because
  // those files live in the same segment as app/page.tsx, which has no
  // metadata export of its own to signal "don't override me". That
  // auto-resolution joins metadataBase's pathname with the route's own
  // path, so it never knows about basePath on its own. Folding
  // assetBasePath into metadataBase itself (instead of leaving it at
  // the bare origin) makes that auto-resolved path come out correct too,
  // without needing to touch app/page.tsx.
  metadataBase: new URL(`${site.url}${assetBasePath}`),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  icons: {
    icon: [
      { url: `${assetBasePath}/icon.svg`, type: "image/svg+xml" },
      { url: `${assetBasePath}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${assetBasePath}/favicon-32.png`, sizes: "32x32", type: "image/png" },
    ],
    apple: `${assetBasePath}/apple-icon.png`,
  },
  manifest: `${assetBasePath}/site.webmanifest`,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    // The opengraph-image route is auto-detected by Next, but its
    // auto-generated <meta> tag doesn't account for basePath (it only
    // combines metadataBase with the route's own path) — so on a GitHub
    // Pages deploy under /st.school2 that link would 404. Setting this
    // explicitly (same assetBasePath pattern as the icons above) wins
    // over the auto-detected file-convention image and stays correct
    // whether or not GITHUB_PAGES_BASE_PATH disables the prefix.
    images: [
      {
        url: `${site.url}${assetBasePath}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [`${site.url}${assetBasePath}/twitter-image`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-ink text-paper antialiased">
        <div className="grain-overlay" />
        <SiteChrome navbar={<Navbar />} footer={<Footer />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
