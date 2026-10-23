"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { HERO_ASSETS } from "@/lib/content";
import {
  ALL_PAIRS,
  STALE_MS,
  derivePrice,
  discoverTradingPairs,
  fetchTickers,
  openFeed,
  resolveSources,
  sourcePairs,
  warnOnce,
  type AssetKey,
  type AssetPrice,
  type PairTick,
  type Source,
} from "@/lib/prices";

type Prices = { byAsset: Record<AssetKey, AssetPrice> };

const loading = Object.fromEntries(HERO_ASSETS.map((a) => [a.key, { status: "loading" }])) as Record<AssetKey, AssetPrice>;
const PriceContext = createContext<Prices>({ byAsset: loading });
export const usePrices = () => useContext(PriceContext);

/** No tick for this long after load -> give up on "loading". */
const GIVE_UP_MS = 15_000;
const THROTTLE_MS = 1000;

/** One provider, one socket. Mounted in Hero; everything else reads it via context. */
export function PriceProvider({ children }: { children: ReactNode }) {
  const [resolved, setResolved] = useState<Record<AssetKey, Source | undefined> | null>(null);
  const [failed, setFailed] = useState(false);
  const [ticks, setTicks] = useState<Record<string, PairTick>>({});
  const [now, setNow] = useState(() => Date.now());
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    let feed: { close(): void } | undefined;
    const store: Record<string, PairTick> = {};
    const lastFlush: Record<string, number> = {};
    const timers: Record<string, ReturnType<typeof setTimeout> | undefined> = {};
    const flush = (pair: string) => {
      timers[pair] = undefined;
      lastFlush[pair] = Date.now();
      if (!cancelled) setTicks({ ...store });
    };
    // Updates state at most once per second per pair (trailing edge, so the latest value always lands).
    const put = (pair: string, last: number, open: number, immediate = false) => {
      store[pair] = { last, open, at: Date.now() };
      if (timers[pair]) return;
      const wait = immediate ? 0 : Math.max(0, THROTTLE_MS - (Date.now() - (lastFlush[pair] ?? 0)));
      if (wait === 0) flush(pair);
      else timers[pair] = setTimeout(() => flush(pair), wait);
    };

    (async () => {
      try {
        const trading = await discoverTradingPairs(ALL_PAIRS);
        if (cancelled) return;
        const res = resolveSources(trading);
        setResolved(res);
        const pairs = [...new Set(Object.values(res).flatMap((s) => (s ? sourcePairs(s) : [])))];
        if (!pairs.length) return;
        const snap = await fetchTickers(pairs).catch(() => ({}) as Record<string, { last: number; open: number }>);
        if (cancelled) return;
        for (const [p, v] of Object.entries(snap)) put(p, v.last, v.open, true);
        feed = openFeed(pairs, { onTick: (p, l, o) => put(p, l, o) });
      } catch (e) {
        warnOnce("discover", "Could not reach Binance", e);
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      feed?.close();
      Object.values(timers).forEach((t) => clearTimeout(t));
    };
  }, []);

  // Coarse clock for staleness; paused while the tab is hidden.
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState !== "hidden") setNow(Date.now());
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const value = useMemo<Prices>(() => {
    const byAsset = {} as Record<AssetKey, AssetPrice>;
    for (const a of HERO_ASSETS) {
      const source = resolved?.[a.key];
      const d = source ? derivePrice(source, ticks) : undefined;
      if (d) {
        byAsset[a.key] = {
          price: d.price,
          changePct24h: d.open ? (d.price - d.open) / d.open : undefined,
          source,
          status: now - d.at > STALE_MS ? "stale" : "live",
        };
      } else if (failed) {
        byAsset[a.key] = { status: "error" };
      } else if (resolved && !source) {
        byAsset[a.key] = { status: "unavailable" };
      } else {
        byAsset[a.key] = { source, status: now - startedAt > GIVE_UP_MS ? "error" : "loading" };
      }
    }
    return { byAsset };
  }, [resolved, failed, ticks, now, startedAt]);

  return <PriceContext.Provider value={value}>{children}</PriceContext.Provider>;
}
