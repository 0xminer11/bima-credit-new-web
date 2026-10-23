"use client";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HERO_ASSETS } from "@/lib/content";

export const ROTATE_MS = 2800;
/** Wait this long after the intro ends so the word-by-word H1 reveal finishes first. */
const START_DELAY_MS = 1400;
const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  index: number;
  onIndexChange: (i: number) => void;
  /** Intro finished (useIntroReady). */
  ready: boolean;
  /** Pointer is over the H1. */
  paused: boolean;
  /** Entrance variants from the H1, so the rotator rises in as one more word. */
  reveal: Variants;
};

/**
 * "Bitcoin." -> "ETH." -> "Monad." slot-machine word for the H1. Renders the trailing period outside
 * the rolling slot. The slot animates its width to the incoming word so the period glides.
 * The progress bar drives the rotation: each sweep ends by advancing to the next asset, so pausing
 * the bar (hover, hidden tab) pauses the rotation.
 */
export function AssetRotator({ index, onIndexChange, ready, paused, reveal }: Props) {
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [measured, setMeasured] = useState(false);
  const measureRef = useRef<HTMLSpanElement>(null);
  const widths = useRef<number[]>([]);
  const indexRef = useRef(index);
  indexRef.current = index;
  const width = useMotionValue(0);

  // Measure every word once (and on resize / font load) with the hidden spans below.
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const measure = () => {
      widths.current = [...el.children].map((c) => c.getBoundingClientRect().width);
      width.jump(widths.current[indexRef.current]);
      setMeasured(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [width]);

  // Glide the slot to the incoming word's width.
  useEffect(() => {
    const to = widths.current[index];
    if (to == null) return;
    const c = animate(width, to, { duration: reduce ? 0 : 0.55, ease });
    return () => c.stop();
  }, [index, width, reduce]);

  useEffect(() => {
    const on = () => setHidden(document.visibilityState === "hidden");
    on();
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);

  useEffect(() => {
    if (!ready || reduce) return;
    const t = window.setTimeout(() => setStarted(true), START_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [ready, reduce]);

  const active = started && !reduce;
  const running = active && !hidden && !paused;
  const word = HERO_ASSETS[index].word;

  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span variants={reveal} className="inline-block whitespace-nowrap">
        <motion.span style={measured ? { width } : undefined} className="relative inline-block align-bottom">
          <span aria-hidden className="relative -mb-[0.1em] block overflow-hidden pb-[0.1em]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={index}
                initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: reduce ? 0 : 0.55, ease }}
                className="inline-block whitespace-nowrap"
              >
                {word}
              </motion.span>
            </AnimatePresence>
          </span>

          {active && (
            <span
              key={index}
              aria-hidden
              className="asset-progress absolute bottom-[0.02em] left-0 h-[3px] w-full rounded-full bg-accent/30 dark:bg-accent/40"
              style={{ animationDuration: `${ROTATE_MS}ms`, animationPlayState: running ? "running" : "paused" }}
              onAnimationEnd={() => onIndexChange((index + 1) % HERO_ASSETS.length)}
            />
          )}

          {/* Off-screen copies in the same font, only for measuring. */}
          <span ref={measureRef} aria-hidden className="pointer-events-none invisible absolute whitespace-nowrap">
            {HERO_ASSETS.map((a) => (
              <span key={a.key} className="inline-block">
                {a.word}
              </span>
            ))}
          </span>
        </motion.span>
        <span aria-hidden>.</span>
      </motion.span>
    </span>
  );
}
