"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { LogoSting } from "./LogoSting";
import { INTRO_DONE_EVENT } from "./useIntroReady";

/** First-visit intro: plays the logo clip, then hands off to the page. Once per tab session; click to skip. */
export function IntroOverlay() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const d = document.documentElement;
    if (d.dataset.intro === "skip" || d.dataset.intro === "done") {
      setShow(false);
      return;
    }
    const t = window.setTimeout(finish, 2700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    const d = document.documentElement;
    if (d.dataset.intro === "done" || d.dataset.intro === "skip") return;
    d.dataset.intro = "done";
    try {
      sessionStorage.setItem("bima-intro", "1");
    } catch {}
    window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro-overlay fixed inset-0 z-[100] grid place-items-center bg-base cursor-pointer"
          onClick={finish}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          role="presentation"
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "radial-gradient(circle at 50% 50%, #000 0%, transparent 60%)",
            }}
          />
          <LogoSting size={200} />
          <span className="absolute bottom-8 text-xs text-muted/70">Click to skip</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
