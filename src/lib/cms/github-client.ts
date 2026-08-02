// A thin, direct client for the GitHub Contents API. This is the entire
// "backend" of the CMS — there is no server. The admin UI runs client-side
// in the browser, authenticates with a personal access token the site
// owner generates in their own GitHub settings, and reads/writes files in
// this repo directly over GitHub's REST API. Saving a collection = one
// authenticated PUT that creates a commit; the existing GitHub Actions
// workflow (already triggered on pushes to this branch) picks it up and
// redeploys — no separate CMS backend to host or maintain.

import { CMS_REPO_NAME, CMS_REPO_OWNER } from "./config";

const API_BASE = "https://api.github.com";

export class GithubApiError extends Error {
  status: number;
  /** True when a 403 is GitHub's primary/secondary rate limiting rather than a permissions failure. */
  rateLimited: boolean;
  constructor(message: string, status: number, rateLimited = false) {
    super(message);
    this.name = "GithubApiError";
    this.status = status;
    this.rateLimited = rateLimited;
  }
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// btoa/atob operate on UTF-16 code units, not UTF-8 bytes — passed a
// string containing ₹, —, or any other multi-byte character (which this
// site's content is full of), naive btoa() throws or mangles the output.
// Route through TextEncoder/TextDecoder to get real UTF-8 bytes first.
export function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  const chunkSize = 0x8000; // avoid call-stack blowups from fromCharCode on huge arrays
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export function base64ToUtf8(base64: string): string {
  const binary = atob(base64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function githubFetch(path: string, token: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...authHeaders(token), ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    let detail = "";
    let message = "";
    try {
      const body = await res.json();
      message = typeof body?.message === "string" ? body.message : "";
      detail = message ? ` — ${message}` : "";
    } catch {
      // response body wasn't JSON; ignore
    }
    // GitHub returns 403 for both permission failures and rate limiting
    // (primary or secondary/abuse-detection) — distinguish via the signals
    // GitHub documents for each, rather than assuming every 403 means the
    // token lacks write access.
    const rateLimited =
      res.status === 403 &&
      (res.headers.get("x-ratelimit-remaining") === "0" ||
        res.headers.has("retry-after") ||
        /rate limit/i.test(message));
    throw new GithubApiError(`GitHub API request failed (${res.status})${detail}`, res.status, rateLimited);
  }
  return res;
}

/** Confirms the token can authenticate and has push access to this repo. */
export async function verifyAccess(token: string): Promise<{ login: string; canPush: boolean }> {
  const userRes = await githubFetch("/user", token);
  const user = await userRes.json();

  const repoRes = await githubFetch(`/repos/${CMS_REPO_OWNER}/${CMS_REPO_NAME}`, token);
  const repo = await repoRes.json();

  return { login: user.login as string, canPush: Boolean(repo.permissions?.push) };
}

export type RemoteFile = { content: string; sha: string };

/** Fetches a file's current text content and blob SHA (needed to update it). */
export async function getFile(token: string, path: string, branch: string): Promise<RemoteFile> {
  const res = await githubFetch(
    `/repos/${CMS_REPO_OWNER}/${CMS_REPO_NAME}/contents/${path}?ref=${encodeURIComponent(branch)}`,
    token,
  );
  const data = await res.json();
  if (Array.isArray(data) || data.type !== "file") {
    throw new GithubApiError(`${path} is not a file`, 400);
  }
  return { content: base64ToUtf8(data.content as string), sha: data.sha as string };
}

/**
 * Commits new content for a file. `expectedSha` must be the SHA last read
 * for this file — GitHub rejects the write with a 409 if the file changed
 * since (someone else edited it, or it was edited outside the CMS), which
 * the caller should surface as "reload and try again" rather than silently
 * overwriting someone else's change.
 */
export async function updateFile(
  token: string,
  path: string,
  newContent: string,
  expectedSha: string,
  branch: string,
  message: string,
): Promise<{ commitUrl: string; newSha: string }> {
  const res = await githubFetch(`/repos/${CMS_REPO_OWNER}/${CMS_REPO_NAME}/contents/${path}`, token, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: utf8ToBase64(newContent),
      sha: expectedSha,
      branch,
    }),
  });
  const data = await res.json();
  // Returned so the caller can keep editing in the same session without a
  // re-fetch — using a stale sha on the next save is exactly the 409 this
  // sha-check exists to prevent.
  return { commitUrl: data.commit?.html_url ?? "", newSha: data.content?.sha ?? expectedSha };
}
