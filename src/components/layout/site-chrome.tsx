"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ScrollProgress } from "@/components/interaction/scroll-progress";
import { CursorGlow } from "@/components/interaction/cursor-glow";
import { EASE_CINEMATIC } from "@/lib/motion-tokens";

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
  const reduceMotion = useReducedMotion();

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <CursorGlow />
      <ScrollProgress />
      {navbar}
      <main className="flex-1">
        {/* A short, deliberate cross-fade between routes instead of an
            instant swap — `mode="wait"` keeps the exit brief (150ms) so it
            doesn't feel like added latency, while the enter gets the
            slower "cinematic" ease used for scene-level moments. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } }}
            transition={{ duration: 0.4, ease: EASE_CINEMATIC }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      {footer}
    </>
  );
}
