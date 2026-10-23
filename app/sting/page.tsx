"use client";
import { useEffect, useState } from "react";
import { LogoSting } from "@/components/LogoSting";

/**
 * /sting — the logo animation clip on its own, looping every 4s.
 * Use for screen-recording social clips, `?once` to play a single time, `?delay=1000` to wait first.
 */
export default function StingPage() {
  const [k, setK] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    // ?delay=ms holds an empty frame first (used when recording the video so the page has settled)
    const s = window.setTimeout(() => setStarted(true), Number(q.get("delay") || 0));
    if (q.has("once")) return () => window.clearTimeout(s);
    const t = setInterval(() => setK((x) => x + 1), 4000);
    return () => {
      clearInterval(t);
      window.clearTimeout(s);
    };
  }, []);
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-base">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(circle at 50% 50%, #000 0%, transparent 65%)",
        }}
      />
      {started && <LogoSting size={320} replayKey={k} />}
    </main>
  );
}
