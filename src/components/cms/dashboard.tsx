"use client";

import { motion } from "framer-motion";
import { FileJson, LogOut } from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";
import { useCmsAuth } from "@/lib/cms/auth-context";
import { cmsCollections } from "@/lib/cms/collections";

export function Dashboard({ onSelect }: { onSelect: (key: string) => void }) {
  const { session, logout } = useCmsAuth();

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

      <div className="grid gap-4 sm:grid-cols-2">
        {cmsCollections.map((collection, i) => (
          <motion.button
            key={collection.key}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
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
    </div>
  );
}
