import { ArrowDownLeft, Check, CircleDollarSign, LockKeyhole, ShieldCheck, SlidersHorizontal, TrendingUp } from "lucide-react";
import { BimaMark, BimaWordmark } from "../BimaLogo";

export function AnimatedStepArt({ step }: { step: number }) {
  return (
    <div className={`how-scene how-scene-${step}`} aria-hidden="true">
      <div className="how-orbit how-orbit-one" /><div className="how-orbit how-orbit-two" />
      <div className="how-scene-brand"><BimaMark className="h-4 w-10" /><BimaWordmark /></div>
      <span className="how-scene-caption">{["THE FOUNDATION", "YOUR STRATEGY", "CAPITAL UNLOCKED", "THE NEXT CHAPTER"][step]}</span>
      {step === 0 && <>
        <div className="how-floating how-asset"><img src="/how-it-works/wbtc.svg" alt="" width="40" height="40" /><span>Bitcoin<small>Your collateral</small></span><ArrowDownLeft size={18} /></div>
        <div className="how-vault"><div className="how-vault-top"><BimaMark className="w-10 h-5" /><span>CUSTODY VAULT</span></div><div className="how-vault-door"><div className="how-vault-wheel"><LockKeyhole size={32} strokeWidth={1.3} /></div><i /><i /></div><div className="how-vault-foot" /></div>
        <div className="how-floating how-status"><span className="how-status-icon"><ShieldCheck size={20} /></span><span>Secure custody<small>The first step to liquidity</small></span></div>
        <div className="how-transfer"><span /><span /><span /></div>
      </>}
      {step === 1 && <>
        <div className="how-chart-card"><div className="how-chart-heading"><span>Collar strategy</span><SlidersHorizontal size={17} /></div><div className="how-chart"><span className="how-chart-top">Capped upside</span><span className="how-chart-bottom">Downside protection</span><svg viewBox="0 0 320 180"><path d="M0 45H320M0 90H320M0 135H320" className="how-chart-grid" /><path d="M0 135H85L235 45H320" className="how-chart-line" /><path d="M0 170L320 10" className="how-chart-reference" /><circle cx="160" cy="90" r="6" fill="var(--accent)" /></svg></div><div className="how-chart-key"><span><i />Structured exposure</span><span>Illustrative</span></div></div>
        <div className="how-floating how-strategy"><SlidersHorizontal size={19} /><span>Your balance<small>Protection · upside · cost</small></span></div>
      </>}
      {step === 2 && <>
        <div className="how-borrow-core"><BimaMark className="w-20 h-10" /><span>Bitcoin-backed<br />liquidity</span></div>
        <div className="how-payout-line" />
        <div className="how-floating how-cash"><CircleDollarSign size={34} /><span>Cash<small>More possibilities</small></span></div>
        <div className="how-floating how-stable"><img src="/how-it-works/usdc.svg" alt="" width="36" height="36" /><span>Stablecoins<small>Capital onchain</small></span></div>
        <span className="how-choice">CHOOSE YOUR PAYOUT</span>
      </>}
      {step === 3 && <>
        <div className="how-invest-card"><div className="how-chart-heading"><span>Your next opportunity</span><TrendingUp size={18} /></div><div className="how-bars">{[25, 42, 35, 61, 53, 76, 94].map((height, i) => <i key={i} style={{ height: `${height}%`, animationDelay: `${i * 70}ms` }} />)}</div><div className="how-chart-key"><span>Put capital to work</span><span>Illustrative</span></div></div>
        <div className="how-floating how-exposure"><img src="/how-it-works/wbtc.svg" alt="" width="36" height="36" /><span>Think long term<small>Keep Bitcoin exposure</small></span><Check size={18} /></div>
      </>}
      <span className="how-scene-index">0{step + 1}</span>
    </div>
  );
}
