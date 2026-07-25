"use client";

import { useEffect, useState } from "react";
import { useCmsAuth } from "@/lib/cms/auth-context";
import { LoginScreen } from "@/components/cms/login-screen";
import { Dashboard } from "@/components/cms/dashboard";
import { CollectionEditorPage } from "@/components/cms/collection-editor-page";
import { cmsCollections } from "@/lib/cms/collections";

// A single static route acting as a tiny client-rendered SPA — this is a
// static export (no server, no dynamic routes), so "navigation" between
// the dashboard and a collection editor is just React state, mirrored into
// the URL hash so a reload or a bookmark lands back on the same editor
// instead of resetting to the dashboard.
export default function AdminPage() {
  const { session, ready } = useCmsAuth();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    // window.location doesn't exist during SSR — reading the initial route
    // out of the hash has to happen client-only, once, on mount.
    const fromHash = window.location.hash.replace("#", "");
    if (fromHash && cmsCollections.some((c) => c.key === fromHash)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedKey(fromHash);
    }
  }, []);

  function select(key: string | null) {
    setSelectedKey(key);
    window.location.hash = key ?? "";
  }

  if (!ready) return null;
  if (!session) return <LoginScreen />;

  const collection = cmsCollections.find((c) => c.key === selectedKey) ?? null;

  if (collection) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <CollectionEditorPage
          config={collection}
          token={session.token}
          branch={session.branch}
          onBack={() => select(null)}
        />
      </div>
    );
  }

  return <Dashboard onSelect={select} />;
}
