"use client";
import { ArrowRight, Check, Info } from "lucide-react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { LINKS, LOAN_PARAMS, type HeroAsset } from "@/lib/content";
import { computeLoan, formatUsd } from "@/lib/loanMath";
import type { Source } from "@/lib/prices";
import { useHeroAsset } from "./AssetContext";
import { usePrices } from "./PriceProvider";

const ease = [0.22, 1, 0.36, 1] as const;
const label = "text-[11px] leading-4 text-muted";
const up = "text-positive";
const down = "text-red-500 dark:text-red-400";
const fmtUnits = (n: number) => (n < 10 ? n.toFixed(2) : n.toLocaleString("en-US"));

function Skeleton({ className }: { className: string }) {
  return <span aria-hidden className={`inline-block animate-pulse rounded-md bg-line-strong/60 align-middle ${className}`} />;
}

/** "You receive": glides between ticks of the same asset and flashes green/red for 400ms. Remounted per asset, so it never glides across assets. */
function ReceiveAmount({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const mv = useSpring(value, { stiffness: 140, damping: 22, mass: 0.6 });
  const text = useTransform(mv, (v) => formatUsd(v));
  const prev = useRef(value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  useEffect(() => {
    if (value === prev.current) return;
    const dir = value > prev.current ? "up" : "down";
    prev.current = value;
    if (reduce) {
      mv.jump(value);
      return;
    }
    mv.set(value);
    setFlash(dir);
    const t = setTimeout(() => setFlash(null), 400);
    return () => clearTimeout(t);
  }, [value, reduce, mv]);
  return <motion.span className={`tabular-nums transition-colors duration-300 ${flash === "up" ? up : flash === "down" ? down : ""}`}>{text}</motion.span>;
}

/** Cross-fades and slides its content (y: 6 -> 0) whenever `k` changes. */
function Swap({ k, children, className = "" }: { k: string; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const dy = reduce ? 0 : 6;
  return (
    <span className={`relative inline-flex ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={k}
          initial={{ opacity: 0, y: dy }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -dy }}
          transition={{ duration: reduce ? 0 : 0.35, ease }}
          className="inline-flex items-center gap-2 whitespace-nowrap"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const GLYPH: Record<string, string> = { wbtc: "\u20BF", cbbtc: "\u20BF", wbnb: "B" };
function AssetIcon({ asset, className }: { asset: HeroAsset; className: string }) {
  if (asset.key === "btc") return <BtcIcon className={className} />;
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full text-[10px] font-bold leading-none text-white ${className}`} style={{ background: asset.color }}>
      {GLYPH[asset.key]}
    </span>
  );
}

/** Extra context for non-direct sources: the config note for pegs, the pair for cross-rates. */
function sourceNote(s?: Source) {
  if (!s) return undefined;
  if (s.type === "peg") return s.note;
  if (s.type === "cross") {
    const quote = s.via.replace(/USDT$/, "");
    return `Priced via ${s.pair.slice(0, -quote.length)}/${quote}`;
  }
  return undefined;
}

function StatusPill({ status }: { status: string }) {
  if (status === "live")
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-positive/15 px-2 py-0.5 text-[11px] font-medium text-positive">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-positive opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-positive" />
        </span>
        Live
      </span>
    );
  if (status === "stale")
    return <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">Delayed</span>;
  return <span className="rounded-full bg-raised px-2 py-0.5 text-[11px] font-medium text-muted">Indicative</span>;
}

/** The "Indicative" line under the CTA. The full disclosure lives in a tooltip (hover, keyboard focus, tap). */
function InfoTip({ text, children }: { text: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <span
      ref={ref}
      className="relative inline-flex"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
    >
      <button
        type="button"
        aria-describedby={id}
        aria-expanded={open}
        onClick={(e) => e.detail > 0 && setOpen((o) => !o)}
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex min-h-6 items-center gap-1.5 text-[11px] text-muted transition-colors hover:text-fg"
      >
        <Info size={12} aria-hidden />
        {children}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full left-0 z-20 mb-1.5 w-[280px] rounded-[10px] border border-line-strong bg-raised p-2.5 text-[11.5px] leading-[1.45] text-fg shadow-[0_12px_32px_-8px_rgb(0_0_0/0.4)]"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

const TOOLTIP = `Indicative only, not a quote. Uses Binance spot prices (USDT pairs, treated as USD). wBTC and cbBTC are priced 1:1 with BTC and wBNB 1:1 with BNB where no direct market exists. ${LOAN_PARAMS.ltv * 100}% LTV; put strike at spot \u2212${LOAN_PARAMS.collarWidth * 100}%, call strike at spot +${LOAN_PARAMS.collarWidth * 100}%; ${LOAN_PARAMS.termMonths}-month term. Live terms come from executable quotes at origination.`;

export function LoanCard({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const { asset } = useHeroAsset();
  const info = usePrices().byAsset[asset.key];
  const loan = info.price != null ? computeLoan(info.price, asset.depositQty) : null;
  const pending = !loan && info.status === "loading";
  const unavailable = !loan && !pending;
  const change = info.changePct24h;
  const note = sourceNote(info.source);

  // 3D tilt (desktop pointers only)
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-3, 3]), { stiffness: 150, damping: 18 });
  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const ltvPct = LOAN_PARAMS.ltv * 100;
  const put = loan && formatUsd(loan.put, { compact: true });
  const call = loan && formatUsd(loan.call, { compact: true });

  return (
    <div className="relative [perspective:1400px]">
      {/* floating chips */}
      <FloatChip className="-top-5 left-2 sm:-left-6" delay={0.9} ready={ready} phase={0}>
        No margin calls
      </FloatChip>
      <FloatChip className="-bottom-4 right-2 sm:-right-4" delay={1.1} ready={ready} phase={2}>
        Terms fixed before capital moves
      </FloatChip>

      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        initial={{ opacity: 0, y: 40, scale: 0.96, filter: "blur(8px)" }}
        animate={ready ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : undefined}
        transition={{ duration: 0.9, delay: 0.35, ease }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", boxShadow: "var(--shadow-card-sm)" }}
        className="relative rounded-[18px] border border-line bg-surface p-4 xl:p-5"
      >
        {/* animated border sheen */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[18px]">
          <motion.div
            className="absolute -inset-[40%] opacity-60"
            style={{ background: "conic-gradient(from 0deg, transparent 0 80%, rgb(255 80 1 / 0.25) 90%, transparent 100%)" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-px rounded-[17px] bg-surface" />
        </div>

        <div className="relative flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              <span className="text-[13px] font-semibold">Loan preview</span>
            </div>
            <StatusPill status={info.status} />
          </div>

          <div>
            <div className="grid grid-cols-[minmax(0,1fr)_140px] items-end gap-4">
              <div>
                <p className={label}>Deposit</p>
                <Swap k={asset.key} className="mt-0.5">
                  <span className="text-[22px] font-bold leading-7 tracking-[-0.02em] tabular-nums">{fmtUnits(asset.depositQty)}</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-raised py-0.5 pl-0.5 pr-2.5 text-[12px] font-semibold">
                    <AssetIcon asset={asset} className="size-5" />
                    {asset.symbol}
                  </span>
                </Swap>
              </div>
              {/* fixed LTV: a read-out, not a control */}
              <div>
                <div className="flex items-baseline justify-between">
                  <span className={label}>LTV</span>
                  <span className="text-[12px] font-semibold tabular-nums">{ltvPct}%</span>
                </div>
                <div aria-hidden className="mt-2.5 h-1 cursor-default rounded-full bg-line-strong/50">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${ltvPct}%` }} />
                </div>
              </div>
            </div>
            <p className="mt-1.5 h-4 text-[11px] leading-4 text-muted">
              <Swap k={asset.key} className="gap-0">
                {loan ? (
                  <span>
                    Spot {formatUsd(loan.spot)}
                    {change != null && (
                      <span className={change >= 0 ? up : down}>
                        {" · "}
                        {change >= 0 ? "\u25B2" : "\u25BC"}
                        {Math.abs(change * 100).toFixed(1)}% 24h
                      </span>
                    )}
                    {note && ` · ${note}`}
                  </span>
                ) : pending ? (
                  <span>
                    Spot <Skeleton className="h-3 w-28" />
                  </span>
                ) : (
                  <span>Price unavailable</span>
                )}
              </Swap>
            </p>
          </div>

          <div className="h-px bg-line" />

          <div>
            <p className={label}>You receive</p>
            <div className="mt-0.5 flex h-8 items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-[26px] font-bold leading-8 tracking-[-0.02em]">
                  <Swap k={asset.key} className="gap-0">
                    {loan ? (
                      <ReceiveAmount value={loan.receive} />
                    ) : pending ? (
                      <Skeleton className="h-6 w-32" />
                    ) : (
                      <span className="text-[14px] font-semibold text-muted">Price unavailable</span>
                    )}
                  </Swap>
                </span>
                {loan && <span className="text-[12px] font-semibold text-muted">USDC</span>}
              </div>
              <span className="rounded-full bg-positive/15 px-2 py-0.5 text-[11px] font-medium text-positive">0% cash interest</span>
            </div>
          </div>

          <CollarChart start={ready} assetKey={asset.key} floor={put ?? undefined} cap={call ?? undefined} />

          <p className="h-4 text-[12px] leading-4 text-muted">
            <Swap k={asset.key} className="gap-0">
              {loan ? (
                <span>
                  Put <b className="font-semibold text-fg">{put}</b> · Call <b className="font-semibold text-fg">{call}</b> · {LOAN_PARAMS.termMonths} mo
                </span>
              ) : pending ? (
                <span>
                  Put <Skeleton className="h-3 w-12" /> · Call <Skeleton className="h-3 w-12" /> · {LOAN_PARAMS.termMonths} mo
                </span>
              ) : (
                <span>Price unavailable</span>
              )}
            </Swap>
          </p>

          <a
            href={LINKS.app}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sheen group flex items-center justify-center gap-2 rounded-[10px] bg-accent py-2.5 text-[14px] font-semibold text-white shadow-[0_8px_24px_-6px_rgb(255_80_1/0.45)] transition-transform active:scale-[0.98]"
          >
            Get a live quote
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </a>

          <InfoTip text={TOOLTIP}>Indicative · Prices from Binance</InfoTip>
        </div>
      </motion.div>
    </div>
  );
}

function FloatChip({
  children,
  className,
  delay,
  ready,
  phase,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
  ready: boolean;
  phase: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`absolute z-10 ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={ready ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay, ease }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -4, 0, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: phase }}
        className="flex items-center gap-1.5 rounded-full border border-line bg-raised py-1.5 pl-2 pr-3 shadow-[0_12px_32px_-8px_rgb(0_0_0/0.35)]"
      >
        <span className="grid size-4 place-items-center rounded-full bg-positive/15 text-positive">
          <Check size={10} strokeWidth={3} />
        </span>
        <span className="whitespace-nowrap text-[11.5px] font-medium">{children}</span>
      </motion.div>
    </motion.div>
  );
}

/** Chart end label. Waits for the draw-on on first paint, but fades in right away when the asset changes. */
function ChartLabel({ go, delay, x, y, anchor, children }: { go: boolean; delay: number; x: number; y: number; anchor?: "end"; children: ReactNode }) {
  const mountedDrawn = useRef(go).current;
  return (
    <motion.text
      x={x}
      y={y}
      fontSize="10"
      fontWeight={600}
      textAnchor={anchor}
      fill="var(--text-primary)"
      initial={{ opacity: 0 }}
      animate={go ? { opacity: 1 } : undefined}
      transition={{ duration: 0.4, delay: mountedDrawn ? 0 : delay }}
    >
      {children}
    </motion.text>
  );
}

/** Mini collar payoff, a fixed schematic: floor -> ramp -> cap. Draws on when visible. */
function CollarChart({ start, assetKey, floor, cap }: { start: boolean; assetKey: string; floor?: string; cap?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const go = start && inView;
  return (
    <svg ref={ref} viewBox="0 0 300 64" className="w-full overflow-visible" role="img" aria-label={floor && cap ? `Collar payoff chart: put strike ${floor}, call strike ${cap}` : "Collar payoff chart"}>
      <defs>
        <linearGradient id="collar-area" x1="0" y1="14" x2="0" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 46H80L200 20H300V60H0Z"
        fill="url(#collar-area)"
        initial={{ opacity: 0 }}
        animate={go ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: 1.2 }}
      />
      <motion.path
        d="M0 60L300 10"
        stroke="var(--text-muted)"
        strokeOpacity={0.55}
        strokeWidth={1.25}
        strokeDasharray="3 5"
        initial={{ opacity: 0 }}
        animate={go ? { opacity: 1 } : undefined}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <path d="M80 46V60M200 20V60" stroke="var(--border-strong)" strokeDasharray="3 4" />
      <motion.path
        d="M0 46H80L200 20H300"
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={go ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.3, delay: 0.3, ease }}
      />
      {/* marker that rides along the payoff once drawn */}
      <motion.circle
        r={3}
        fill="var(--accent)"
        initial={{ opacity: 0 }}
        animate={go ? { opacity: [0, 1, 1, 0], cx: [0, 80, 200, 300], cy: [46, 46, 20, 20] } : undefined}
        transition={{ duration: 3.2, delay: 2.2, repeat: Infinity, repeatDelay: 1.6, ease: "linear" }}
      />
      {[
        { x: 80, y: 46 },
        { x: 200, y: 20 },
      ].map((m, i) => (
        <motion.circle
          key={m.x}
          cx={m.x}
          cy={m.y}
          r={4}
          fill="var(--bg-surface)"
          stroke="var(--accent)"
          strokeWidth={2}
          initial={{ scale: 0 }}
          animate={go ? { scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.9 + i * 0.35 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}
      {floor && (
        <ChartLabel key={"f" + assetKey} go={go} delay={1.1} x={2} y={39}>
          {floor}
        </ChartLabel>
      )}
      {cap && (
        <ChartLabel key={"c" + assetKey} go={go} delay={1.4} x={298} y={34} anchor="end">
          {cap}
        </ChartLabel>
      )}
    </svg>
  );
}

export function BtcIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        fill="#fff"
        d="M22.6 14.1c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.6-.4-.7 2.6-1.3-.3.7-2.7-1.6-.4-.7 2.7-1-.2-2.3-.6-.4 1.7s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.1.2.1h-.2l-1.1 4.4c-.1.2-.3.5-.8.4 0 0-1.2-.3-1.2-.3l-.8 1.8 2.1.5 1.2.3-.7 2.8 1.6.4.7-2.7 1.3.3-.7 2.7 1.6.4.7-2.8c2.8.5 4.9.3 5.8-2.2.7-2-.03-3.2-1.5-3.9 1.1-.2 1.9-1 2.1-2.4zm-3.7 5.2c-.5 2-3.9.9-5 .6l.9-3.6c1.1.3 4.6.8 4.1 3zm.5-5.2c-.5 1.8-3.3.9-4.2.7l.8-3.2c.9.2 3.9.6 3.4 2.5z"
      />
    </svg>
  );
}
