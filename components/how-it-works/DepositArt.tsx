import { ArrowDownRight, ShieldCheck } from "lucide-react";
import { BitcoinCoin, Vault } from "./ArtPrimitives";

export function DepositArt() {
  return <svg aria-hidden="true" className="stair-art-svg" viewBox="0 0 400 208">
    <g fill="none" stroke="var(--border-subtle)"><circle cx="246" cy="105" r="80" /><circle cx="246" cy="105" r="98" /><circle cx="246" cy="105" r="117" strokeDasharray="3 5" /></g>
    <ellipse cx="244" cy="181" rx="85" ry="10" fill="var(--accent-soft)" />
    <path d="M104 104C140 147 152 142 191 117m-10 0 10 0-3 10" stroke="var(--stair-ink)" strokeWidth="1.5" strokeDasharray="4 5" fill="none" />
    <BitcoinCoin x={90} y={105} radius={29} />
    <g className="stair-svg-shadow"><Vault x={184} y={35} /></g>
    <g className="stair-glass"><rect x="31" y="22" width="164" height="29" rx="9" /><text x="43" y="40" fontSize="10" fill="var(--text-primary)">Bitcoin · Your collateral</text><ArrowDownRight x="171" y="30" width="13" height="13" color="var(--stair-ink)" /></g>
    <g className="stair-glass"><rect x="243" y="166" width="133" height="29" rx="9" /><ShieldCheck x="254" y="173" width="15" height="15" color="var(--stair-ink)" /><text x="276" y="184" fontSize="10" fill="var(--text-primary)">Secure custody</text></g>
  </svg>;
}
