"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { BrandContours } from "./PageAtmosphere";
import { Button } from "./Button";
import { LINKS } from "@/lib/content";
import { AnimatedStepArt } from "./how-it-works/AnimatedStepArt";

const steps = [
  { title: "Deposit", subtitle: "Start with your Bitcoin", description: "Deposit Bitcoin into a secure custody vault.", detail: "Your Bitcoin is the starting point. Use it as collateral to unlock liquidity through Bima.", label: "Bitcoin → collateral" },
  { title: "Structure", subtitle: "Make borrowing work for you", description: "Select a collar strategy that reduces or eliminates borrowing costs.", detail: "Balance downside protection and capped upside to structure your borrowing costs.", label: "Collateral → strategy" },
  { title: "Borrow", subtitle: "Unlock your liquidity", description: "Receive cash or stablecoins against your Bitcoin.", detail: "Access capital backed by your Bitcoin, with a payout that suits your next move.", label: "Strategy → liquidity" },
  { title: "Invest", subtitle: "Put your capital in motion", description: "Put your capital to work while keeping long-term Bitcoin exposure.", detail: "Take your next opportunity with available capital and continued exposure through your chosen strategy.", label: "Liquidity → opportunity" },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  return (
    <section id="how-it-works" className="how-section page-x py-section scroll-mt-24" aria-labelledby="how-heading">
      <header className="how-header how-header-compact">
        <BrandContours className="how-header-brand" />
        <p id="how-heading" className="eyebrow">HOW IT WORKS / THE BIMA WAY</p>
      </header>
      <div className="how-layout">
        <ol className="how-step-list" aria-label="The Bima journey" role="list">
          {steps.map((step, index) => <li key={step.title} className={active === index ? "is-active" : ""}>
            <h3><button type="button" className="how-step-button" aria-pressed={active === index} aria-controls="how-shared-visual" onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}>
              <span className="how-number" aria-hidden="true">0{index + 1}</span>
              <span className="how-step-title">{step.title}</span>
            </button></h3>
            <div className="how-step-copy" onMouseEnter={() => setActive(index)}>
              <p className="how-step-description">{step.description}</p>
              {active === index && <div className="how-step-detail"><p className="how-kicker">{step.subtitle}</p><p>{step.detail}</p><span className="how-chip"><Check size={13} aria-hidden="true" />{step.label}</span></div>}
            </div>
          </li>)}
        </ol>
        <div id="how-shared-visual" className="how-shared-visual" role="region" aria-label={`${steps[active].title} illustration`}>
          <motion.div key={active} initial={{ opacity: reducedMotion ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.25 }}><AnimatedStepArt step={active} /></motion.div>
        </div>
      </div>
      <div className="how-footer"><Button href={LINKS.app} size="sm">Explore Bima Credit</Button></div>
    </section>
  );
}
