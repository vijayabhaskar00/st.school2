"use client";

import { motion } from "framer-motion";
import { FileJson, LogOut } from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";
import { useCmsAuth } from "@/lib/cms/auth-context";
import { cmsCollections } from "@/lib/cms/collections";
import { CMS_GROUPS, type CmsGroup } from "@/lib/cms/collection-types";

// A short contextual note shown under a group heading. Only groups that
// benefit from extra orientation get one — most are self-explanatory from
// their name and the cards underneath.
const GROUP_NOTES: Partial<Record<CmsGroup, string>> = {
  Programs: "Add, edit, or remove course programs — each one gets its own page automatically.",
};

// Collections grouped under their `group`, in CMS_GROUPS order. Relative
// order within a group matches `cmsCollections` (no re-sorting) — each
// collection keeps its original position for the stagger-in animation delay.
function groupCollections() {
  return CMS_GROUPS.map((group) => ({
    group,
    items: cmsCollections
      .map((collection, index) => ({ collection, index }))
      .filter(({ collection }) => collection.group === group),
  })).filter(({ items }) => items.length > 0);
}

export function Dashboard({ onSelect }: { onSelect: (key: string) => void }) {
  const { session, logout } = useCmsAuth();
  const grouped = groupCollections();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LogoMark className="h-9 w-auto" />
          <div>
            <p className="font-display text-lg font-medium text-paper">St.School CMS</p>
            <p className="text-xs text-muted-soft">
              Signed in as {session?.login} · publishing to{" "}
              <code className="rounded bg-white/5 px-1 py-0.5">{session?.branch}</code>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-paper/80 transition-colors hover:border-white/30 hover:text-paper"
        >
          <LogOut className="size-3.5" />
          Sign out
        </button>
      </div>

      <div className="flex flex-col gap-10">
        {grouped.map(({ group, items }) => {
          const emphasize = group === "Programs";
          return (
            <section key={group} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted-soft">
                  {group}
                </h2>
                {GROUP_NOTES[group] && (
                  <p className="text-sm leading-relaxed text-muted">{GROUP_NOTES[group]}</p>
                )}
              </div>

              <div
                className={
                  emphasize
                    ? "grid gap-4 rounded-2xl border border-coral/25 bg-coral/5 p-4 sm:grid-cols-2"
                    : "grid gap-4 sm:grid-cols-2"
                }
              >
                {items.map(({ collection, index }) => (
                  <motion.button
                    key={collection.key}
                    type="button"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                    onClick={() => onSelect(collection.key)}
                    className="group flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-ink-elevated/60 p-6 text-left transition-colors hover:border-white/25"
                  >
                    <span className="flex size-9 items-center justify-center rounded-full bg-white/5 text-coral-light transition-colors group-hover:bg-coral/15">
                      <FileJson className="size-4" />
                    </span>
                    <span className="font-display text-base font-medium text-paper">{collection.label}</span>
                    <span className="text-sm leading-relaxed text-muted">{collection.description}</span>
                    <span className="mt-1 text-xs text-muted-soft">{collection.filePath}</span>
                  </motion.button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
