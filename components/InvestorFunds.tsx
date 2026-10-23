"use client";

import { ArrowUpRight } from "lucide-react";
import { FUNDS, LED_BY } from "@/lib/content";
import { Reveal } from "./Reveal";

/** Lead/fund data and original logo assets ported from bima-credit-web. */
export function InvestorFunds() {
  return (
    <div className="investor-backing">
      <Reveal>
        <div className="investor-lead">
          <div className="investor-lead-grid" aria-hidden="true" />
          <div className="investor-lead-rings" aria-hidden="true"><span /><span /><span /></div>
          <h3 className="investor-label"><span aria-hidden="true" />Led By</h3>
          <a href={LED_BY.href} target="_blank" rel="noopener noreferrer" className="investor-lead-link" aria-label={`${LED_BY.name} (opens in a new tab)`}>
            <img src={LED_BY.logo} alt={LED_BY.name} width={260} height={65} className="investor-logo investor-logo-lead" />
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </Reveal>
      <div className="investor-funds">
        <div className="investor-funds-heading"><span aria-hidden="true" /><h3>Funds</h3><span aria-hidden="true" /></div>
        <ul className="investor-funds-grid" aria-label="Fund investors">
          {FUNDS.map((fund, index) => (
            <li key={fund.name}>
              <Reveal delay={(index % 4) * 0.06} y={12} className="h-full">
                <a href={fund.href} target="_blank" rel="noopener noreferrer" className="investor-fund-link" aria-label={`${fund.name} (opens in a new tab)`}>
                  <img src={fund.logo} alt={fund.name} width={160} height={48} loading="lazy" className="investor-logo" />
                  <ArrowUpRight size={14} aria-hidden="true" className="investor-fund-arrow" />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
