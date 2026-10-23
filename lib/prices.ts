import { HERO_ASSETS } from "./content.ts";

export type Asset = (typeof HERO_ASSETS)[number];
export type AssetKey = Asset["key"];
export type Source = Asset["sources"][number];
export type Status = "loading" | "live" | "stale" | "unavailable" | "error";
export type PairTick = { last: number; open: number; at: number };
export type AssetPrice = { price?: number; changePct24h?: number; source?: Source; status: Status };

export const REST_HOSTS = ["https://data-api.binance.vision", "https://api.binance.com"];
export const WS_HOSTS = ["wss://data-stream.binance.vision", "wss://stream.binance.com:9443"];
export const STALE_MS = 30_000;
export const POLL_MS = 10_000;

const warned = new Set<string>();
export function warnOnce(key: string, ...args: unknown[]) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn("[prices]", ...args);
}

export const sourcePairs = (s: Source): string[] => (s.type === "cross" ? [s.pair, s.via] : [s.pair]);

const sourcesOf = (a: Asset): readonly Source[] => a.sources;
export const ALL_PAIRS: string[] = [...new Set(HERO_ASSETS.flatMap((a) => sourcesOf(a).flatMap(sourcePairs)))];

/** GET against the primary host, falling back to the next on network errors and non-400 failures (e.g. 451). */
async function restGet(path: string): Promise<{ status: number; json: any }> {
  let last: unknown = new Error("no hosts");
  for (const host of REST_HOSTS) {
    try {
      const res = await fetch(host + path);
      if (res.ok || res.status === 400) return { status: res.status, json: await res.json().catch(() => null) };
      last = new Error("HTTP " + res.status);
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

const arr = (pairs: string[]) => encodeURIComponent(JSON.stringify(pairs));

/** Which of `pairs` exist and are TRADING. A batch with one bad symbol returns 400 (-1121), so retry one by one. */
export async function discoverTradingPairs(pairs: string[]): Promise<Set<string>> {
  const ok = new Set<string>();
  // Binance's 400 for an unknown symbol can lack CORS headers on one host, which surfaces here as a network
  // error rather than a 400. Either way, fall through to per-symbol queries.
  const batch = await restGet(`/api/v3/exchangeInfo?symbols=${arr(pairs)}`).catch(() => null);
  if (batch?.status === 200) {
    for (const s of batch.json?.symbols ?? []) if (s.status === "TRADING") ok.add(s.symbol);
    return ok;
  }
  const each = await Promise.allSettled(pairs.map((p) => restGet(`/api/v3/exchangeInfo?symbol=${p}`)));
  if (each.every((r) => r.status === "rejected")) throw new Error("exchangeInfo unreachable");
  for (const r of each) {
    if (r.status !== "fulfilled" || r.value.status !== 200) continue;
    for (const s of r.value.json?.symbols ?? []) if (s.status === "TRADING") ok.add(s.symbol);
  }
  return ok;
}

/** First source whose pairs all trade wins. undefined = unavailable. */
export function resolveSources(trading: Set<string>): Record<AssetKey, Source | undefined> {
  const out = {} as Record<AssetKey, Source | undefined>;
  for (const a of HERO_ASSETS) out[a.key] = sourcesOf(a).find((s) => sourcePairs(s).every((p) => trading.has(p)));
  return out;
}

export async function fetchTickers(pairs: string[]): Promise<Record<string, { last: number; open: number }>> {
  const r = await restGet(`/api/v3/ticker/24hr?symbols=${arr(pairs)}`);
  if (r.status !== 200 || !Array.isArray(r.json)) throw new Error("ticker/24hr failed");
  const out: Record<string, { last: number; open: number }> = {};
  for (const t of r.json) {
    const last = parseFloat(t.lastPrice);
    const open = parseFloat(t.openPrice);
    if (Number.isFinite(last) && Number.isFinite(open)) out[t.symbol] = { last, open };
  }
  return out;
}

/** direct and peg use the pair price; cross multiplies pair x via. Returns last, 24h-open and the oldest input tick. */
export function derivePrice(source: Source, ticks: Record<string, PairTick | undefined>) {
  const a = ticks[source.pair];
  if (!a) return undefined;
  if (source.type === "cross") {
    const b = ticks[source.via];
    if (!b) return undefined;
    return { price: a.last * b.last, open: a.open * b.open, at: Math.min(a.at, b.at) };
  }
  return { price: a.last, open: a.open, at: a.at };
}

type FeedHandlers = { onTick: (pair: string, last: number, open: number) => void };

/**
 * ONE combined WebSocket for all pairs. Reconnects with exponential backoff + jitter (1s -> 30s),
 * alternates hosts, closes while the tab is hidden, and falls back to REST polling after 3 failed attempts.
 */
export function openFeed(pairs: string[], { onTick }: FeedHandlers) {
  let ws: WebSocket | null = null;
  let closed = false;
  let failures = 0;
  let retry: ReturnType<typeof setTimeout> | undefined;
  let poll: ReturnType<typeof setInterval> | undefined;

  const pollOnce = async () => {
    try {
      const t = await fetchTickers(pairs);
      for (const [p, v] of Object.entries(t)) onTick(p, v.last, v.open);
    } catch {
      warnOnce("poll", "REST polling failed");
    }
  };
  const startPolling = () => {
    if (poll) return;
    void pollOnce();
    poll = setInterval(pollOnce, POLL_MS);
  };
  const stopPolling = () => {
    clearInterval(poll);
    poll = undefined;
  };

  const fail = () => {
    failures++;
    warnOnce("ws", "WebSocket unavailable, retrying");
    if (failures >= 3) startPolling();
    const delay = Math.min(30_000, 1000 * 2 ** (failures - 1)) * (0.75 + Math.random() * 0.5);
    clearTimeout(retry);
    retry = setTimeout(connect, delay);
  };

  function connect() {
    if (closed || ws || document.visibilityState === "hidden") return;
    const url = `${WS_HOSTS[failures % WS_HOSTS.length]}/stream?streams=${pairs.map((p) => p.toLowerCase() + "@miniTicker").join("/")}`;
    let sock: WebSocket;
    try {
      sock = new WebSocket(url);
    } catch {
      fail();
      return;
    }
    ws = sock;
    sock.onopen = () => {
      failures = 0;
      stopPolling();
    };
    sock.onmessage = (ev) => {
      try {
        const d = JSON.parse(ev.data)?.data;
        const last = parseFloat(d?.c);
        const open = parseFloat(d?.o);
        if (d?.s && Number.isFinite(last) && Number.isFinite(open)) onTick(d.s, last, open);
      } catch {
        /* ignore malformed frames */
      }
    };
    sock.onclose = () => {
      if (ws !== sock) return; // closed on purpose (hidden tab / teardown)
      ws = null;
      if (!closed) fail();
    };
  }

  const dropSocket = () => {
    const s = ws;
    ws = null;
    s?.close();
  };
  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      dropSocket();
      clearTimeout(retry);
      stopPolling();
    } else if (!closed) {
      failures = 0;
      connect();
      void pollOnce(); // fill the gap while the tab was hidden
    }
  };
  document.addEventListener("visibilitychange", onVisibility);
  connect();

  return {
    close() {
      closed = true;
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(retry);
      stopPolling();
      dropSocket();
    },
  };
}
