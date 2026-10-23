import { LOAN_PARAMS } from "@/lib/content";

export function StructureArt() {
  const strike = LOAN_PARAMS.collarWidth * 100;
  return <svg aria-hidden="true" className="stair-art-svg" viewBox="0 0 400 208">
    <g className="stair-glass"><rect x="35" y="20" width="330" height="168" rx="14" /></g>
    <rect x="60" y="64" width="280" height="71" rx="5" fill="var(--accent-soft)" />
    <path d="M60 64H340M60 100H340M60 135H340" stroke="var(--border-subtle)" fill="none" />
    <path d="M69 159 320 41" stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
    <text x="61" y="43" fontSize="10" fill="var(--text-muted)">BTC price</text>
    <path d="M60 135H123L274 64H340" stroke="var(--accent)" strokeWidth="3" strokeLinejoin="round" fill="none" />
    {[{ x: 123, y: 135 }, { x: 274, y: 64 }].map(({x,y}) => <g key={x}><circle cx={x} cy={y} r="8" fill="var(--bg-surface)" stroke="var(--accent)" strokeWidth="2" /><path d={`M${x-2} ${y-3}v6m4-6v6`} stroke="var(--stair-ink)" /></g>)}
    <text x="94" y="163" fontSize="10" fill="var(--text-primary)">Put −{strike}%</text><text x="250" y="49" fontSize="10" fill="var(--text-primary)">Call +{strike}%</text>
    <g className="stair-glass"><rect x="206" y="173" width="170" height="27" rx="13" /><text x="291" y="190" textAnchor="middle" fontSize="10" fill="var(--stair-ink)">Reduces borrowing cost</text></g>
  </svg>;
}
