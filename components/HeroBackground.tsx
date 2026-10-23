"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { MARK_PATH, MARK_VIEWBOX } from "./BimaLogo";

/**
 * Animated hero background, four layers:
 *  1. Base grid + a cursor spotlight that brightens the grid under the pointer.
 *  2. Two slow-drifting orange glows.
 *  3. "Collar field" canvas: ribbons shaped like the collar payoff (floor → ramp → cap)
 *     that breathe over time, with capital particles flowing along them.
 *  4. A giant ghost outline of the Bima mark, floating behind the loan card.
 */
export function HeroBackground() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const parallax = useTransform(scrollY, [0, 800], [0, 120]);

  // cursor spotlight
  useEffect(() => {
    const el = wrap.current;
    if (!el || reduce) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      el.style.setProperty("--spot", "1");
    };
    const onLeave = () => el.style.setProperty("--spot", "0");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  const gridBg = {
    backgroundImage:
      "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
    backgroundSize: "64px 64px",
  } as const;

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ ["--mx" as string]: "70%", ["--my" as string]: "30%", ["--spot" as string]: "0" }}>
      {/* 1. grid + spotlight */}
      <div className="absolute inset-0" style={{ ...gridBg, maskImage: "radial-gradient(ellipse 80% 70% at 70% 30%, #000 10%, transparent 75%)" }} />
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          ...gridBg,
          backgroundImage:
            "linear-gradient(rgb(255 80 1 / 0.35) 1px, transparent 1px), linear-gradient(90deg, rgb(255 80 1 / 0.35) 1px, transparent 1px)",
          maskImage: "radial-gradient(220px circle at var(--mx) var(--my), #000, transparent 70%)",
          opacity: "var(--spot)",
        }}
      />

      {/* 2. drifting glows */}
      <motion.div style={{ y: parallax, opacity: "var(--glow-opacity)" }} className="absolute inset-0">
        <motion.div
          className="absolute -top-[180px] right-[-100px] size-[680px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(closest-side, rgb(255 80 1 / 0.38), transparent)" }}
          animate={reduce ? undefined : { x: [0, -60, 20, 0], y: [0, 40, -20, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[18%] top-[360px] size-[360px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(closest-side, rgb(255 120 40 / 0.22), transparent)" }}
          animate={reduce ? undefined : { x: [0, 80, -40, 0], y: [0, -50, 30, 0] }}
          transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* 3. collar field */}
      <CollarField />

      {/* 4. ghost mark */}
      <motion.svg
        viewBox={MARK_VIEWBOX}
        className="absolute right-[-6%] top-[14%] hidden w-[52%] max-w-[820px] lg:block"
        style={{ y: parallax }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: [0, -2.5, 0, 2.5, 0] }}
        transition={{ opacity: { duration: 1.6 }, scale: { duration: 1.6 }, rotate: { duration: 24, repeat: Infinity, ease: "easeInOut" } }}
      >
        <defs>
          <linearGradient id="ghost-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={MARK_PATH} fill="none" stroke="url(#ghost-stroke)" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
        <motion.path
          d={MARK_PATH}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          initial={{ pathLength: 0.08, pathOffset: 0 }}
          animate={reduce ? undefined : { pathOffset: [0, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          style={{ opacity: 0.55 }}
        />
      </motion.svg>

      {/* fade into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-base" />
    </div>
  );
}

/* ---------------------------------------------------------------------------------- */

function readAccent() {
  const s = getComputedStyle(document.documentElement);
  const theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  return { accent: s.getPropertyValue("--accent").trim() || "#ff5001", light: theme === "light" };
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function CollarField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1, raf = 0, visible = true;
    let colors = readAccent();
    let rgb = hexToRgb(colors.accent);

    const LINES = 26;
    const SEG = 140;
    type P = { line: number; u: number; speed: number; size: number };
    const particles: P[] = Array.from({ length: 42 }, () => ({
      line: Math.floor(Math.random() * LINES),
      u: Math.random(),
      speed: 0.0009 + Math.random() * 0.0016,
      size: 1 + Math.random() * 1.6,
    }));

    const resize = () => {
      const r = c.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // y position of line i at normalized x u, time t
    const yAt = (i: number, u: number, t: number) => {
      const top = H * 0.2, span = H * 0.62;
      const base = top + (i / (LINES - 1)) * span;
      const a = 0.38 + 0.07 * Math.sin(t * 0.22 + i * 0.27);
      const b = a + 0.26 + 0.04 * Math.sin(t * 0.17 + i * 0.5);
      const amp = H * (0.16 + 0.05 * Math.sin(t * 0.3 + i * 0.21));
      const wave = 5 * Math.sin(u * 7 + t * 0.7 + i * 0.45);
      return base + amp * (0.5 - smooth(a, b, u)) + wave;
    };

    const draw = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, W, H);
      const k = colors.light ? 0.65 : 1;
      const mid = (LINES - 1) * 0.55;
      const [r, g, b] = rgb;

      for (let i = 0; i < LINES; i++) {
        const d = Math.abs(i - mid) / LINES;
        const hero = i === Math.round(mid);
        const alpha = (hero ? 0.75 : Math.max(0.04, 0.26 - d * 0.5)) * k;
        ctx.beginPath();
        for (let s = 0; s <= SEG; s++) {
          const u = s / SEG;
          const x = u * W;
          const y = yAt(i, u, t);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = hero ? 2 : 1;
        if (hero) {
          ctx.shadowColor = `rgba(${r},${g},${b},${0.8 * k})`;
          ctx.shadowBlur = 14;
        } else ctx.shadowBlur = 0;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // capital particles with trails
      for (const p of particles) {
        if (!reduce) p.u += p.speed;
        if (p.u > 1.02) {
          p.u = -0.02;
          p.line = Math.floor(Math.random() * LINES);
        }
        const tail = 0.05;
        const grad = ctx.createLinearGradient((p.u - tail) * W, 0, p.u * W, 0);
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},${0.9 * k})`);
        ctx.beginPath();
        for (let s = 0; s <= 10; s++) {
          const u = p.u - tail + (tail * s) / 10;
          const x = u * W, y = yAt(p.line, u, t);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = p.size;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.u * W, yAt(p.line, p.u, t), p.size + 0.6, 0, Math.PI * 2);
        ctx.fillStyle = colors.light ? `rgba(${r},${g},${b},0.9)` : "rgba(255,240,230,0.95)";
        ctx.shadowColor = `rgba(${r},${g},${b},1)`;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const loop = (time: number) => {
      if (visible) draw(time);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    const mo = new MutationObserver(() => {
      colors = readAccent();
      rgb = hexToRgb(colors.accent);
      if (reduce) draw(4000);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const onVis = () => (visible = document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    if (reduce) draw(4000);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvas}
      className="absolute inset-x-0 top-0 h-[880px] w-full opacity-45 lg:h-full lg:opacity-100"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.15) 38%, #000 62%), linear-gradient(to bottom, #000 70%, transparent)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    />
  );
}
