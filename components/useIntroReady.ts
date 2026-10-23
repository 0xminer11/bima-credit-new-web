"use client";
import { useEffect, useState } from "react";

export const INTRO_DONE_EVENT = "bima:intro-done";

/** True once the logo intro has finished (or was skipped). Hero entrance animations wait for it. */
export function useIntroReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const st = document.documentElement.dataset.intro;
    if (st === "done" || st === "skip") {
      setReady(true);
      return;
    }
    const on = () => setReady(true);
    window.addEventListener(INTRO_DONE_EVENT, on);
    return () => window.removeEventListener(INTRO_DONE_EVENT, on);
  }, []);
  return ready;
}
