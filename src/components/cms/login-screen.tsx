"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, ShieldCheck, AlertTriangle } from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";
import { useCmsAuth } from "@/lib/cms/auth-context";
import { CMS_DEFAULT_BRANCH } from "@/lib/cms/config";

export function LoginScreen() {
  const { login, loading, error } = useCmsAuth();
  const [token, setToken] = useState("");
  const [branch, setBranch] = useState(CMS_DEFAULT_BRANCH);
  const [remember, setRemember] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-ink-elevated/70 p-8"
      >
        <div className="flex items-center gap-3">
          <LogoMark className="h-9 w-auto" />
          <div>
            <p className="font-display text-lg font-medium text-paper">St.School CMS</p>
            <p className="text-xs text-muted-soft">Content lives in the repo. This edits it for you.</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(token.trim(), branch.trim(), remember);
          }}
          className="mt-8 flex flex-col gap-5"
        >
          <label className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted-soft">
              <KeyRound className="size-3.5" />
              GitHub personal access token
            </span>
            <input
              type="password"
              autoComplete="off"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="github_pat_…"
              required
              className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-paper outline-none transition-colors focus:border-coral/60"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-soft">
              Branch to publish to
            </span>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-paper outline-none transition-colors focus:border-coral/60"
            />
          </label>

          <label className="flex items-center gap-2 text-xs text-muted-soft">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-3.5 rounded border-white/20 bg-ink"
            />
            Remember me on this device (stores the token in this browser)
          </label>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-coral/30 bg-coral/10 p-3 text-xs text-coral-light">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="rounded-full bg-paper py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Checking…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 flex items-start gap-2 border-t border-white/10 pt-5 text-xs leading-relaxed text-muted-soft">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
          <p>
            No account is created here — the CMS commits changes to GitHub using your own token. Create a{" "}
            <a
              href="https://github.com/settings/personal-access-tokens/new"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-paper"
            >
              fine-grained token
            </a>{" "}
            scoped only to this repository, with Contents: Read and write — nothing more. Anyone with the token can
            edit this repo, so keep it private and revoke it if you ever suspect it leaked.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
