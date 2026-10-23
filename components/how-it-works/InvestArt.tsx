import { Building2, Landmark, LockKeyhole, TrendingUp } from "lucide-react";
import { BitcoinCoin } from "./ArtPrimitives";

export function InvestArt() {
  return <svg aria-hidden="true" className="stair-art-svg" viewBox="0 0 400 208">
    <g fill="none" stroke="var(--border-subtle)"><circle cx="111" cy="98" r="70" /><circle cx="111" cy="98" r="85" /></g>
    <path d="M166 94H200M200 48V142M200 48H228M200 94H228M200 142H228" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
    <circle cx="200" cy="94" r="3" fill="var(--accent)" />
    <g className="stair-glass"><rect x="44" y="32" width="122" height="124" rx="13" /></g>
    <text x="59" y="52" fontSize="10" fill="var(--text-primary)">Your Bitcoin</text><LockKeyhole x="137" y="41" width="13" height="13" color="var(--stair-ink)" />
    <BitcoinCoin x={102} y={93} radius={24} /><text x="105" y="139" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Exposure kept</text>
    {[{label:"Business",Icon:Building2},{label:"Treasury",Icon:Landmark},{label:"Investments",Icon:TrendingUp}].map(({label,Icon},i)=><g key={label} transform={`translate(228 ${30+i*47})`} className="stair-glass"><rect width="135" height="36" rx="9" /><Icon x="12" y="10" width="16" height="16" color="var(--stair-ink)" /><text x="38" y="23" fontSize="11" fill="var(--text-primary)">{label}</text></g>)}
    <g className="stair-glass"><rect x="65" y="173" width="285" height="26" rx="13" /><text x="78" y="190" fontSize="13" fill="var(--stair-ink)">₿</text><text x="96" y="190" fontSize="10" fill="var(--text-muted)">Think long term · Keep Bitcoin exposure</text></g>
  </svg>;
}
