"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import type { CollectionConfig } from "@/lib/cms/collection-types";
import { getFile, updateFile, GithubApiError } from "@/lib/cms/github-client";

type Status = "loading" | "ready" | "saving" | "error";

// The one place that talks to GitHub on behalf of every collection editor:
// fetch -> validate -> hand a plain (value, onChange) pair to the
// collection's Editor component -> on Save, re-validate and PUT a new
// commit. Every collection editor built on top of this only has to render
// form fields; it never touches fetch, JSON, sha, or the GitHub API.
export function CollectionEditorPage({
  config,
  token,
  branch,
  onBack,
}: {
  config: CollectionConfig<unknown>;
  token: string;
  branch: string;
  onBack: () => void;
}) {
  const [status, setStatus] = useState<Status>("loading");
  const [value, setValue] = useState<unknown>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [commitUrl, setCommitUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    setCommitUrl(null);
    try {
      const file = await getFile(token, config.filePath, branch);
      const parsed = config.schema.parse(JSON.parse(file.content));
      setValue(parsed);
      setSha(file.sha);
      setDirty(false);
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load this collection.");
      setStatus("error");
    }
  }, [token, branch, config]);

  useEffect(() => {
    // Fetching the collection's current file has to happen on mount /
    // whenever the selected collection changes — there's no external event
    // to subscribe to instead, this effect *is* the fetch trigger.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `load` is stable for a given config/token/branch triple; re-running on every render would re-fetch on each keystroke.
  }, [config.key]);

  useEffect(() => {
    // The "Unsaved changes" indicator below is otherwise purely cosmetic —
    // without this, a refresh or tab close silently discards edits it was
    // supposedly warning about.
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function confirmDiscard() {
    return !dirty || window.confirm("You have unsaved changes that will be lost. Continue anyway?");
  }

  async function handleSave() {
    if (sha === null) return;
    const parsed = config.schema.safeParse(value);
    if (!parsed.success) {
      setValidationError(parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; "));
      return;
    }
    setValidationError(null);
    setStatus("saving");
    setError(null);
    try {
      const serialized = JSON.stringify(parsed.data, null, 2) + "\n";
      const result = await updateFile(
        token,
        config.filePath,
        serialized,
        sha,
        branch,
        `cms: update ${config.label.toLowerCase()}`,
      );
      setSha(result.newSha);
      setCommitUrl(result.commitUrl);
      setDirty(false);
      setStatus("ready");
    } catch (e) {
      if (e instanceof GithubApiError && e.status === 409) {
        setError(
          "This file changed on GitHub since you loaded it (someone else saved, or it was edited " +
            "directly). Reload to get the latest version before saving your changes again.",
        );
      } else if (e instanceof GithubApiError && e.status === 403 && e.rateLimited) {
        setError(
          "GitHub is temporarily rate-limiting requests from this token. This isn't a permissions " +
            "problem — wait a few minutes and try saving again. Your edits above are still in this " +
            "browser tab, unsaved.",
        );
      } else if (e instanceof GithubApiError && e.status === 403) {
        setError(
          "GitHub rejected the write — this token isn't allowed to change repo contents. This is " +
            "different from your GitHub account's own access (which the sign-in check confirmed) — a " +
            "token can be valid and belong to an account with full push access, yet still have been " +
            'issued without permission to write files. Go to the token\'s settings and set "Contents" ' +
            'to "Read and write" for this repository (fine-grained tokens default new permissions to ' +
            '"No access" until you set them), or generate a new token with that permission — then sign ' +
            "out and back in here with it. Your edits above are still in this browser tab, unsaved.",
        );
      } else {
        setError(e instanceof Error ? e.message : "Save failed.");
      }
      setStatus("ready");
    }
  }

  const Editor = config.Editor;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => confirmDiscard() && onBack()}
            className="flex size-8 items-center justify-center rounded-full border border-white/10 text-muted-soft transition-colors hover:text-paper"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h2 className="font-display text-lg font-medium text-paper">{config.label}</h2>
            <p className="text-xs text-muted-soft">{config.filePath}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {dirty && status === "ready" && (
            <span className="text-xs font-medium text-coral-light">Unsaved changes</span>
          )}
          <button
            type="button"
            onClick={() => confirmDiscard() && load()}
            disabled={status === "loading" || status === "saving"}
            className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-paper/80 transition-colors hover:border-white/30 hover:text-paper disabled:opacity-40"
          >
            <RefreshCw className="size-3.5" />
            Reload
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={status !== "ready" || !dirty}
            className="rounded-full bg-paper px-4 py-1.5 text-xs font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {status === "saving" ? "Saving…" : "Save & publish"}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-ink-elevated/60 p-6 text-sm text-muted"
          >
            <Loader2 className="size-4 animate-spin" />
            Loading {config.filePath} from GitHub…
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 rounded-xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral-light"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {validationError && (
          <motion.div
            key="validation-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 rounded-xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral-light"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>Can&apos;t save — this content doesn&apos;t match the expected shape: {validationError}</span>
          </motion.div>
        )}

        {commitUrl && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 rounded-xl border border-white/15 bg-white/5 p-4 text-sm text-paper/85"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-acid" />
            <span>
              Published.{" "}
              <a href={commitUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                View commit
              </a>{" "}
              — the site will redeploy automatically in a minute or two.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {status !== "loading" && value !== null && (
        <Editor
          value={value}
          onChange={(next) => {
            setValue(next);
            setDirty(true);
            setCommitUrl(null);
          }}
        />
      )}
    </div>
  );
}
