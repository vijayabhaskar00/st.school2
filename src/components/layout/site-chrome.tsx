"use client";

import { usePathname } from "next/navigation";
import { ScrollProgress } from "@/components/interaction/scroll-progress";
import { CursorGlow } from "@/components/interaction/cursor-glow";

// The admin CMS at /admin is a different application living in the same
// Next.js project — it shouldn't wear the public site's chrome (marketing
// nav, "Apply Now" CTA, footer sitemap, cursor glow). Navbar and Footer
// stay Server Components (passed in as `children`-like props rather than
// imported here) so this one client boundary doesn't drag their whole
// subtree into client JS — only the pathname check itself is client-side.
export function SiteChrome({
  navbar,
  footer,
  children,
}: {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <CursorGlow />
      <ScrollProgress />
      {navbar}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
