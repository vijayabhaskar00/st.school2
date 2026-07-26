"use client";

import { useClaimCursorAccent, type CursorAccent } from "@/lib/cursor-accent";

/** Renders nothing — just claims the page's cursor-glow accent for as long as it's mounted. A tiny client leaf so the (server) course detail page can opt into this without itself becoming a client component. */
export function ClaimCursorAccent({ accent }: { accent: CursorAccent }) {
  useClaimCursorAccent(accent);
  return null;
}
