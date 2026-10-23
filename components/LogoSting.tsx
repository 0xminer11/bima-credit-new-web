"use client";
import { motion, type Transition } from "motion/react";
import { DOT, MARK_PATH, MARK_VIEWBOX } from "./BimaLogo";

const ease: Transition["ease"] = [0.22, 1, 0.36, 1];

/**
 * The Bima logo animation clip.
 *  0.10s  outline of the mark draws on
 *  0.95s  fill floods in, outline fades
 *  1.15s  two pulse rings radiate from the dot ("the boomerang throws")
 *  1.30s  an orbit arc sweeps over the mark and returns
 *  1.35s  BIMA wordmark tracks in, tagline follows
 * Total ≈ 2.2s. `size` is the mark width in px.
 */
export function LogoSting({
  size = 180,
  showTagline = true,
  replayKey = 0,
}: {
  size?: number;
  showTagline?: boolean;
  replayKey?: number;
}) {
  const h = (size * 252) / 604;
  return (
    <div key={replayKey} className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: h }}>
        {/* soft glow behind the mark */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: size * 1.6, height: size * 1.6, background: "radial-gradient(closest-side, var(--accent-glow), transparent 70%)" }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 0.7], scale: [0.6, 1.1, 1] }}
          transition={{ duration: 1.8, delay: 0.6, ease }}
        />
        <svg viewBox={MARK_VIEWBOX} width={size} height={h} className="relative overflow-visible" aria-label="Bima">
          <defs>
            <linearGradient id="sting-sweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="sting-clip">
              <path fillRule="evenodd" clipRule="evenodd" d={MARK_PATH} />
            </clipPath>
          </defs>

          {/* 1. outline draw-on */}
          <motion.path
            d={MARK_PATH}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={6}
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: [1, 1, 0] }}
            transition={{ pathLength: { duration: 0.95, delay: 0.1, ease: "easeInOut" }, opacity: { duration: 1.4, delay: 0.1, times: [0, 0.75, 1] } }}
          />
          {/* 2. fill */}
          <motion.path
            d={MARK_PATH}
            fillRule="evenodd"
            clipRule="evenodd"
            fill="var(--accent)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.95, ease }}
          />
          {/* 3. light sweep across the fill */}
          <g clipPath="url(#sting-clip)">
            <motion.rect
              y={418}
              height={252}
              width={160}
              fill="url(#sting-sweep)"
              initial={{ x: 120 }}
              animate={{ x: 900 }}
              transition={{ duration: 0.9, delay: 1.35, ease: "easeInOut" }}
            />
          </g>
          {/* 4. pulse rings from the dot */}
          {[0, 0.28].map((d) => (
            <motion.circle
              key={d}
              cx={DOT.cx}
              cy={DOT.cy}
              r={DOT.r}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={5}
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 4.2], opacity: [0.9, 0] }}
              transition={{ duration: 1.1, delay: 1.15 + d, ease: "easeOut" }}
            />
          ))}
          {/* 5. boomerang orbit: an arc that flies out over the mark and returns */}
          <motion.path
            d="M262 600 C 330 380, 750 380, 818 600"
            fill="none"
            stroke="var(--accent)"
            strokeWidth={5}
            strokeLinecap="round"
            initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
            animate={{ pathLength: [0, 0.35, 0], pathOffset: [0, 0.4, 1], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.1, delay: 1.25, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <motion.div
        className="mt-6 text-fg font-semibold"
        style={{ fontSize: size * 0.16 }}
        initial={{ opacity: 0, letterSpacing: "0.6em", y: 8 }}
        animate={{ opacity: 1, letterSpacing: "0.18em", y: 0 }}
        transition={{ duration: 0.8, delay: 1.35, ease }}
      >
        BIMA
      </motion.div>
      {showTagline && (
        <motion.p
          className="mt-3 text-muted"
          style={{ fontSize: Math.max(13, size * 0.075) }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6, ease }}
        >
          Unlock liquidity. Keep your Bitcoin.
        </motion.p>
      )}
    </div>
  );
}
