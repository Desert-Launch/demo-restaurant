"use client";

import { useEffect, useState } from "react";

/**
 * The current time, but only once the component has mounted.
 *
 * Every page in this app is statically prerendered, so anything that reads the
 * clock during render would bake the build time into the HTML and then
 * disagree with the browser on hydration. Returning `null` on the first pass
 * lets callers show a skeleton until the real clock is available.
 *
 * Pass `intervalMs` for surfaces that need to keep ticking — the order board
 * counts minutes since each ticket was placed.
 */
export function useNow(intervalMs?: number): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    if (!intervalMs) return;

    const timer = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return now;
}
