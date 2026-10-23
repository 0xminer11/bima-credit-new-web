"use client";

import { ArrowUpRight } from "lucide-react";
import { communitySocials } from "@/lib/community";
import { BimaMark } from "./BimaLogo";
import { Reveal } from "./Reveal";

const discord = communitySocials.find(social => social.label === "Discord")!;
const otherSocials = communitySocials.filter(social => social.label !== "Discord");

function CommunityGraphic() {
  return <div className="community-graphic" aria-hidden="true">
    <div className="community-orbit community-orbit-outer" /><div className="community-orbit community-orbit-inner" />
    <svg className="community-connectors" viewBox="0 0 360 260" fill="none"><path d="M66 52 180 130 298 55M65 207 180 130 297 205" stroke="var(--accent)" strokeOpacity=".4" strokeDasharray="3 6" /><circle cx="118" cy="92" r="3" fill="var(--accent)" /><circle cx="240" cy="168" r="3" fill="var(--accent)" /></svg>
    <div className="community-hub"><BimaMark className="community-hub-mark" /><span>BIMA</span></div>
    {otherSocials.map((social, index) => <span key={social.label} className={`community-node community-node-${index}`}><img src={social.icon} alt="" width={23} height={23} className="community-icon" /></span>)}
  </div>;
}

/** Source community content, adapted to the homepage's design tokens. */
export function Community() {
  return <section id="community" className="page-x pb-section pt-4 community-section scroll-mt-24" aria-labelledby="community-heading">
    <Reveal>
      <div className="community-panel">
        <div className="community-main">
          <div className="community-copy">
            <p className="eyebrow community-eyebrow"><span aria-hidden="true" />Community</p>
            <h2 id="community-heading">Join the Bima Community!</h2>
            <p className="community-description">Love what we&rsquo;re building? Come hang out with us across our socials while we build the future of DeFi on Bitcoin.</p>
            <a href={discord.href} target="_blank" rel="noopener noreferrer" className="community-discord"><img src={discord.icon} alt="" width={21} height={21} />Join Our Discord<ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
          <CommunityGraphic />
        </div>
        <ul className="community-socials" aria-label="Bima social channels">
          {otherSocials.map(social => <li key={social.label}>
            <a href={social.href} target="_blank" rel="noopener noreferrer" className="community-social-link">
              <span className="community-social-icon"><img src={social.icon} alt="" width={20} height={20} className="community-icon" /></span>
              <span>{social.label}</span><ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </li>)}
        </ul>
      </div>
    </Reveal>
  </section>;
}
