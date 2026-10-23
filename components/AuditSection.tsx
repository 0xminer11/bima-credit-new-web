"use client";

import { ArrowUpRight, Check, FileCheck2, LockKeyhole, ShieldCheck } from "lucide-react";
import { AUDITORS, LINKS } from "@/lib/content";
import { BimaMark } from "./BimaLogo";
import { Reveal } from "./Reveal";

function SecurityArtwork() {
  return <div className="audit-art" aria-hidden="true">
    <div className="audit-orbit audit-orbit-outer" /><div className="audit-orbit audit-orbit-inner" />
    <svg className="audit-connections" viewBox="0 0 440 300" fill="none"><path d="M70 72H132L220 150M370 72H310L220 150M70 235H140L220 150M370 235H300L220 150" stroke="var(--accent)" strokeOpacity=".4" strokeDasharray="4 5" /><circle cx="70" cy="72" r="4" fill="var(--accent)" /><circle cx="370" cy="235" r="4" fill="var(--accent)" /></svg>
    <div className="audit-shield">
      <svg viewBox="0 0 180 200" fill="none"><path d="M90 8 164 35V99C164 143 125 176 90 191 55 176 16 143 16 99V35L90 8Z" fill="var(--bg-raised)" stroke="var(--border-strong)" strokeWidth="2" /><path d="M90 22 151 45V99C151 134 120 163 90 178 60 163 29 134 29 99V45L90 22Z" fill="var(--bg-surface)" stroke="var(--accent)" strokeWidth="1.5" /></svg>
      <BimaMark className="audit-shield-brand" />
      <span className="audit-shield-check"><Check size={26} strokeWidth={1.6} /></span>
    </div>
    <span className="audit-art-label audit-art-vault"><LockKeyhole size={15} />Vault</span>
    <span className="audit-art-label audit-art-strategy"><FileCheck2 size={15} />Strategy</span>
    <span className="audit-art-label audit-art-escrow"><ShieldCheck size={15} />Escrow</span>
  </div>;
}

export function AuditedBy() {
  return <section id="security" className="page-x py-section scroll-mt-24 audit-section" aria-labelledby="audit-heading">
    <Reveal>
      <div className="audit-panel">
        <div className="audit-overview">
          <div className="audit-copy">
            <p className="eyebrow audit-eyebrow"><ShieldCheck size={14} />Security</p>
            <h2 id="audit-heading">Audited by.</h2>
            <p className="audit-description">Bima&apos;s vault, strategy and escrow contracts have been independently reviewed. Every finding in the latest collateral fixed-term audit was resolved.</p>
            <a href={LINKS.docs} target="_blank" rel="noopener noreferrer" className="audit-doc-link">Explore audit documentation<ArrowUpRight size={16} /></a>
          </div>
          <SecurityArtwork />
        </div>
        <ul className="audit-logo-grid" aria-label="Auditors">
          {AUDITORS.map(auditor => <li key={auditor.logo}>
            <a className="audit-logo-link" href={auditor.href} target="_blank" rel="noopener noreferrer" aria-label={`${auditor.name} (opens in a new tab)`}>
              <img src={auditor.logo} alt={auditor.name} width={185} height={50} loading="lazy" />
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </li>)}
        </ul>

      </div>
    </Reveal>
  </section>;
}
