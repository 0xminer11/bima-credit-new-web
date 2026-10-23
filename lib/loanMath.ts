import { LOAN_PARAMS } from "./content.ts";

type Params = { ltv: number; collarWidth: number };

/** Strip float noise (100000 * 1.15 = 114999.99999999999) without changing any displayed digit. */
const clean = (n: number) => Math.round(n * 1e8) / 1e8;

export function computeLoan(spot: number, qty: number, p: Params = LOAN_PARAMS) {
  const collateralValue = spot * qty;
  return {
    spot,
    collateralValue,
    receive: clean(collateralValue * p.ltv), // USDC received; no deposit fee
    put: clean(spot * (1 - p.collarWidth)), // floor strike per unit
    call: clean(spot * (1 + p.collarWidth)), // cap strike per unit
  };
}

const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const centsTrim = new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const sig4 = new Intl.NumberFormat("en-US", { minimumSignificantDigits: 4, maximumSignificantDigits: 4 });
const short = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

/**
 * >= $1,000 -> 0 decimals; $1-$999 -> 2 decimals; < $1 -> 4 significant digits.
 * `compact` abbreviates thousands ("$82.6k") and trims trailing zeros below $1,000 ("$510").
 */
export function formatUsd(value: number, { compact = false }: { compact?: boolean } = {}) {
  if (!Number.isFinite(value)) return "";
  if (value < 1) return "$" + sig4.format(value);
  if (value < 1000) return "$" + (compact ? centsTrim : cents).format(value);
  return "$" + (compact ? short.format(value).replace("K", "k") : whole.format(value));
}
