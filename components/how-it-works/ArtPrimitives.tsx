import { useId } from "react";
import { LockKeyhole } from "lucide-react";
import { MARK_PATH, MARK_VIEWBOX } from "../BimaLogo";

/** Shared, static pieces keep the four scenes consistent in both themes. */
export function Vault({ x = 0, y = 0, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale}) rotate(-7 60 65)`}>
    <rect x="7" y="7" width="120" height="130" rx="13" fill="var(--bg-base)" stroke="var(--border-strong)" />
    <rect width="120" height="130" rx="13" fill="var(--bg-raised)" stroke="var(--border-strong)" />
    <svg x="12" y="12" width="27" height="13" viewBox={MARK_VIEWBOX}><path d={MARK_PATH} fill="var(--accent)" fillRule="evenodd" /></svg>
    <text x="46" y="21" fontSize="6" letterSpacing=".6" fill="var(--text-muted)">CUSTODY VAULT</text>
    <rect x="11" y="34" width="98" height="84" rx="8" fill="var(--bg-surface)" stroke="var(--border-strong)" />
    <circle cx="60" cy="76" r="29" fill="var(--bg-base)" stroke="var(--accent)" />
    <circle cx="60" cy="76" r="23" fill="none" stroke="var(--border-strong)" strokeWidth="3" />
    <LockKeyhole x="50" y="66" width="20" height="20" color="var(--stair-ink)" strokeWidth="1.3" />
    <path d="M110 48V61M110 92V105" stroke="var(--text-muted)" strokeWidth="4" strokeLinecap="round" />
  </g>;
}

export function BitcoinCoin({ x, y, radius = 25 }: { x: number; y: number; radius?: number }) {
  const gradient = useId();
  return <g transform={`translate(${x} ${y})`}>
    <defs><linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--stair-btc)" /><stop offset=".35" stopColor="color-mix(in srgb, var(--stair-btc) 65%, var(--stair-white))" /><stop offset="1" stopColor="var(--stair-btc)" /></linearGradient></defs>
    <ellipse cx="4" cy="5" rx={radius} ry={radius} fill="var(--stair-btc)" />
    <circle r={radius} fill={`url(#${gradient})`} />
    <path d={`M${-radius * .8} ${radius * .45} A${radius} ${radius} 0 0 1 ${radius * .7} ${-radius * .7}`} fill="none" stroke="var(--stair-white)" strokeWidth="4" opacity=".3" />
    <circle r={radius - 5} fill="none" stroke="var(--stair-coin-ink)" opacity=".5" />
    <text y={radius * .39} textAnchor="middle" fontSize={radius * 1.3} fontWeight="600" fill="var(--stair-coin-ink)">₿</text>
  </g>;
}
