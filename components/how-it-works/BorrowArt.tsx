import { LOAN_PARAMS } from "@/lib/content";
import { Vault } from "./ArtPrimitives";

export function BorrowArt() {
  const ltv = LOAN_PARAMS.ltv;
  const angle = Math.PI * (1 - ltv);
  const needle = { x: 200 + 39 * Math.cos(angle), y: 188 - 39 * Math.sin(angle) };
  return <svg aria-hidden="true" className="stair-art-svg" viewBox="0 0 400 208">
    <circle cx="85" cy="80" r="66" fill="none" stroke="var(--border-subtle)" />
    <g className="stair-svg-shadow"><Vault x={39} y={23} scale={.72} /></g>
    <path d="M146 75H244m-8-7 8 7-8 7" stroke="var(--stair-ink)" strokeWidth="1.5" fill="none" />
    <g transform="rotate(8 307 79)" className="stair-glass"><rect x="262" y="49" width="94" height="54" rx="9" /><text x="333" y="83" fontSize="23" fill="var(--text-muted)">$</text></g>
    <g transform="rotate(-8 308 79)" className="stair-glass"><rect x="260" y="45" width="94" height="54" rx="9" /><text x="333" y="80" fontSize="23" fill="var(--text-muted)">$</text></g>
    <circle cx="286" cy="65" r="30" fill="var(--stair-usdc)" /><circle cx="286" cy="65" r="24" fill="none" stroke="var(--stair-white)" opacity=".6" /><text x="286" y="69" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--stair-white)">USDC</text>
    <g className="stair-glass"><rect x="232" y="111" width="139" height="27" rx="13" /><text x="301" y="128" textAnchor="middle" fontSize="10" fill="var(--text-primary)">Cash or stablecoins</text></g>
    <path d="M148 188A52 52 0 0 1 252 188" pathLength="100" fill="none" stroke="var(--border-strong)" strokeWidth="6" strokeLinecap="round" />
    <path d="M148 188A52 52 0 0 1 252 188" pathLength="100" fill="none" stroke="var(--accent)" strokeWidth="6" strokeDasharray={`${ltv * 100} 100`} strokeLinecap="round" />
    {Array.from({length:7},(_,i)=>{const a=Math.PI-i*Math.PI/6;return <path key={i} d={`M${200+60*Math.cos(a)} ${188-60*Math.sin(a)}L${200+65*Math.cos(a)} ${188-65*Math.sin(a)}`} stroke="var(--text-muted)" />})}
    <path d={`M200 188L${needle.x} ${needle.y}`} stroke="var(--stair-ink)" strokeWidth="2" /><circle cx="200" cy="188" r="4" fill="var(--accent)" />
    <rect x="164" y="171" width="72" height="16" rx="5" fill="var(--bg-surface)" /><text x="200" y="182" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--text-primary)">{ltv * 100}% LTV</text>
  </svg>;
}
