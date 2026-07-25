"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CMS_DEFAULT_BRANCH, CMS_LOCAL_STORAGE_KEY, CMS_SESSION_STORAGE_KEY } from "./config";
import { verifyAccess, GithubApiError } from "./github-client";

type Session = { token: string; branch: string; login: string };

type AuthState = {
  session: Session | null;
  ready: boolean;
  error: string | null;
  loading: boolean;
  login: (token: string, branch: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

function readStoredSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw =
    window.sessionStorage.getItem(CMS_SESSION_STORAGE_KEY) ??
    window.localStorage.getItem(CMS_LOCAL_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.token === "string" && typeof parsed?.branch === "string") {
      return parsed as Session;
    }
  } catch {
    // corrupt/old-shape storage — treat as logged out
  }
  return null;
}

export function CmsAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // sessionStorage/localStorage don't exist during SSR, and reading them
    // during render would desync server/client output — this has to run
    // once, client-only, on mount, synchronously setting state rather than
    // subscribing to anything external.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(readStoredSession());
    setReady(true);
  }, []);

  async function login(token: string, branch: string, remember: boolean) {
    setLoading(true);
    setError(null);
    try {
      const { login: username, canPush } = await verifyAccess(token);
      if (!canPush) {
        setError(
          `${username} is authenticated, but this token doesn't have write access to the repo. ` +
            "Generate a fine-grained PAT scoped to this repo with Contents: Read and write.",
        );
        return false;
      }
      const next: Session = { token, branch: branch || CMS_DEFAULT_BRANCH, login: username };
      const payload = JSON.stringify(next);
      if (remember) {
        window.localStorage.setItem(CMS_LOCAL_STORAGE_KEY, payload);
        window.sessionStorage.removeItem(CMS_SESSION_STORAGE_KEY);
      } else {
        window.sessionStorage.setItem(CMS_SESSION_STORAGE_KEY, payload);
        window.localStorage.removeItem(CMS_LOCAL_STORAGE_KEY);
      }
      setSession(next);
      return true;
    } catch (e) {
      if (e instanceof GithubApiError && e.status === 401) {
        setError("That token was rejected — check it's valid and hasn't expired.");
      } else if (e instanceof GithubApiError && e.status === 404) {
        setError("Token is valid, but can't see this repo — check its repository access scope.");
      } else {
        setError(e instanceof Error ? e.message : "Login failed.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    window.sessionStorage.removeItem(CMS_SESSION_STORAGE_KEY);
    window.localStorage.removeItem(CMS_LOCAL_STORAGE_KEY);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, ready, error, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useCmsAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useCmsAuth must be used within CmsAuthProvider");
  return ctx;
}
