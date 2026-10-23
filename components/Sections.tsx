"use client";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ASSETS, FAQ, LINKS } from "@/lib/content";
import { BimaMark, BimaWordmark } from "./BimaLogo";
import { DiscordIcon, GithubIcon, LinkedinIcon, TelegramIcon, XIcon } from "./Brands";
import { Button } from "./Button";
import { BtcIcon } from "./LoanCard";
import { Reveal } from "./Reveal";
import { BrandSculpture } from "./PageAtmosphere";
import { InvestorFunds } from "./InvestorFunds";

const wrap = "page-x";
const card = "rounded-2xl border border-line bg-surface transition-[border-color,transform,box-shadow] duration-300";
const cardHover = "hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_16px_40px_-20px_rgb(255_80_1/0.35)]";

function Header({ eyebrow, title, sub, center }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  return (
    <Reveal className={`flex flex-col gap-3 ${center ? "items-center text-center" : ""}`}>
      <p className="eyebrow text-accent">{eyebrow}</p>
      <h2 className="text-h2 font-bold">{title}</h2>
      {sub && <p className="max-w-[560px] text-lede text-muted">{sub}</p>}
    </Reveal>
  );
}

/* ----------------------------------- Supported assets ----------------------------------- */
const BTC_FAMILY = ["wBTC", "cbBTC"];

function TokenIcon({ symbol, color }: { symbol: string; color: string }) {
  if (symbol === "BTC") return <BtcIcon className="size-10" />;
  return (
    <span
      className={`relative grid size-10 place-items-center rounded-full font-bold text-white ${symbol.length > 4 ? "text-[10px]" : "text-[11px]"}`}
      style={{ background: color }}
    >
      {symbol}
      {BTC_FAMILY.includes(symbol) && (
        <span className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full ring-2 ring-surface">
          <BtcIcon className="size-4" />
        </span>
      )}
    </span>
  );
}

export function SupportedAssets() {
  return (
    <section className={`${wrap} py-section`}>
      <Header eyebrow="Ecosystem" title="Supported assets" sub="Use supported Bitcoin assets as collateral to unlock low-cost financing while keeping long-term exposure." />
      <div className="mt-8 grid grid-cols-2 gap-3 xl:mt-10 lg:grid-cols-4 lg:gap-4">
        {ASSETS.map((a, i) => (
          <Reveal key={a.symbol} delay={i * 0.08}>
            <div className={`${card} ${cardHover} flex h-full flex-col gap-3.5 p-5`}>
              <TokenIcon symbol={a.symbol} color={a.color} />
              <div>
                <h3 className="text-[18px] font-semibold tracking-[-0.01em]">{a.symbol}</h3>
                <p className="mt-1 text-small leading-5 text-muted">{a.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
        <Reveal delay={0.32} className="col-span-2 lg:col-span-4">
          <div className="flex h-full min-h-[72px] items-center justify-center gap-3 rounded-2xl border border-dashed border-line-strong p-5 text-center">
            <motion.span
              className="grid size-10 place-items-center rounded-full bg-raised"
              animate={{ rotate: [0, 90, 90, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
            >
              <Plus size={16} />
            </motion.span>
            <span className="text-[14px] font-semibold text-muted">More assets coming soon</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------- Investors -------------------------------------- */
export function Investors() {
  return (
    <section id="investors" className={`${wrap} py-section scroll-mt-24`}>
      <p className="eyebrow text-accent">Investors</p>
      <div className="mt-6"><InvestorFunds /></div>
    </section>
  );
}

export { AuditedBy } from "./AuditSection";

/* ---------------------------------------- FAQ ---------------------------------------- */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className={`${wrap} py-section faq-section scroll-mt-24`}>
      <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:gap-16">
        <div className="flex flex-col items-start gap-6 lg:sticky lg:top-24 lg:self-start">
          <Header eyebrow="FAQ" title="Frequently asked questions" sub="Everything you need to know about borrowing against your Bitcoin with Bima." />
          <Button href={LINKS.contact} variant="secondary" icon={false}>Contact us</Button>
          <BrandSculpture />
        </div>
        <ul className="faq-accordion border-t border-line">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    className="group flex w-full items-center gap-5 py-4 text-left lg:py-5"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className={`flex-1 text-[15px] font-semibold tracking-[-0.005em] transition-colors lg:text-[16px] ${isOpen ? "text-fg" : "group-hover:text-accent"}`}>
                      {f.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`grid size-7 shrink-0 place-items-center rounded-full transition-colors ${isOpen ? "bg-accent-soft text-accent" : "bg-raised text-fg"}`}
                    >
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[680px] pb-5 text-[14px] leading-[1.65] text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export { Community } from "./CommunitySection";

/* --------------------------------------- Footer --------------------------------------- */
export function Footer() {
  const links = [
    ["Docs", LINKS.docs],
    ["Media Kit", LINKS.mediaKit],
    ["Contact", LINKS.contact],
    ["Send Feedback", LINKS.discord],
  ];
  const icons = [
    [DiscordIcon, LINKS.discord, "Discord"],
    [XIcon, LINKS.x, "X"],
    [TelegramIcon, LINKS.telegram, "Telegram"],
    [LinkedinIcon, LINKS.linkedin, "LinkedIn"],
    [GithubIcon, LINKS.github, "GitHub"],
  ] as const;
  return (
    <footer className="border-t border-line">
      <div className={`${wrap} flex flex-col gap-5 py-8 lg:flex-row lg:items-center lg:justify-between`}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <BimaMark className="h-4 w-10" />
            <BimaWordmark />
          </span>
          <span className="text-small text-muted">Bima Labs 2026 ©</span>
        </div>
        <ul className="flex flex-wrap gap-x-6 lg:gap-y-2">
          {links.map(([l, h]) => (
            <li key={l}>
              <a href={h} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center text-small font-medium text-muted transition-colors hover:text-fg lg:min-h-0">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          {icons.map(([Icon, h, l]) => (
            <a
              key={l}
              href={h}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={l}
              className="grid size-9 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
