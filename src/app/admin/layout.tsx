import type { Metadata } from "next";
import { CmsAuthProvider } from "@/lib/cms/auth-context";

// Never indexed, never linked from the public nav — this is a tool for
// the site owner, not a page a visitor should land on. `noindex` is a
// meta-tag hint search engines can choose to ignore, so robots.ts also
// disallows /admin outright as the stronger, enforced signal.
export const metadata: Metadata = {
  title: "CMS",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <CmsAuthProvider>{children}</CmsAuthProvider>
    </div>
  );
}
