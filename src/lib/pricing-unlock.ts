"use client";

import { useEffect, useState } from "react";

// This is a fully static, server-less site — there's nowhere to actually
// send or gate a lead server-side. "Unlocking" pricing is a client-only,
// device-local marketing device (blur the fee, ask for name/email/phone,
// reveal it) rather than a real access-control mechanism; a determined
// visitor can always find the real number in the page's JS. The point is
// the funnel, not the security.

const STORAGE_KEY = "stschool_pricing_lead_v1";
const UNLOCK_EVENT = "stschool:pricing-unlocked";
const OPEN_GATE_EVENT = "stschool:pricing-gate-open-request";

/** DOM id the pricing gate mounts under, so other components can scroll to it. */
export const PRICING_GATE_ELEMENT_ID = "pricing-unlock";

export type PricingLead = { name: string; email: string; phone: string };

export function isPricingUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) !== null;
}

/** Persists the lead locally and notifies every mounted gate/button on this page. */
export function unlockPricing(lead: PricingLead) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...lead, unlockedAt: new Date().toISOString() }));
  window.dispatchEvent(new Event(UNLOCK_EVENT));
}

/** Asks any mounted PricingGate to open its lead form (used by the gated brochure button). */
export function requestPricingGateOpen() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_GATE_EVENT));
}

export function onPricingGateOpenRequest(handler: () => void) {
  window.addEventListener(OPEN_GATE_EVENT, handler);
  return () => window.removeEventListener(OPEN_GATE_EVENT, handler);
}

/** Live unlock state for this browser — starts false (matching the static-export prerender) and flips once, client-side. */
export function usePricingUnlock() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage doesn't exist during SSR/prerender, so the real value can only be known once mounted.
    setUnlocked(isPricingUnlocked());
    const onUnlock = () => setUnlocked(true);
    window.addEventListener(UNLOCK_EVENT, onUnlock);
    return () => window.removeEventListener(UNLOCK_EVENT, onUnlock);
  }, []);

  return unlocked;
}
