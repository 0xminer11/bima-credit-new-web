"use client";
import { CalendarCheck, Lock, Percent, ShieldCheck } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useMemo, useState, type ReactNode } from "react";
import { HERO_ASSETS, LINKS } from "@/lib/content";
import { AssetContext } from "./AssetContext";
import { AssetRotator } from "./AssetRotator";
import { PriceProvider } from "./PriceProvider";
import { Button } from "./Button";
import { HeroBackground } from "./HeroBackground";
import { LoanCard } from "./LoanCard";
import { Reveal } from "./Reveal";
import { useIntroReady } from "./useIntroReady";

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const word: Variants = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 0.8, ease } },
};
const fadeUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease } },
});

function Words({ text, className = "", after }: { text: string; className?: string; after?: ReactNode }) {
  return (
    <span className={`block lg:whitespace-nowrap ${className}`}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span variants={word} className="inline-block">
            {w}
            {i < text.split(" ").length - 1 || after ? " " : ""}
          </motion.span>
        </span>
      ))}
      {after}
    </span>
  );
}

const FEATURES = [
  { icon: Percent, title: "0% cash interest", desc: "The option premium funds the loan, so there are no scheduled interest payments." },
  { icon: CalendarCheck, title: "Fixed terms, set upfront", desc: "Amount, term, floor and cap are locked before any capital moves." },
  { icon: ShieldCheck, title: "No margin calls", desc: "No mid-term liquidation and no collateral top-ups during the term." },
  { icon: Lock, title: "Institutional custody", desc: "Collateral sits in audited vaults, placed with approved prime brokers." },
];

export function Hero() {
  const ready = useIntroReady();
  const state = ready ? "show" : "hidden";
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const assetCtx = useMemo(() => ({ asset: HERO_ASSETS[index], index }), [index]);

  return (
    <AssetContext.Provider value={assetCtx}>
    <PriceProvider>
    <section id="top" className="relative overflow-hidden">
      <HeroBackground />

      <div className="page-x relative grid min-h-[100svh] items-center gap-[clamp(32px,4vw,72px)] pb-8 pt-24 lg:grid-cols-[1fr_360px] lg:pt-20">
        <motion.div initial="hidden" animate={state} className="flex max-w-[600px] flex-col gap-5">
          <motion.div variants={fadeUp(0)} className="flex w-fit items-center gap-2 rounded-full border border-line bg-surface/80 py-1 pl-1 pr-3 backdrop-blur">
            <span className="eyebrow rounded-full bg-accent-soft px-2 py-0.5 !text-[12px] text-accent">Collar loans</span>
            <span className="text-[12px] font-medium text-muted">
              <span className="sm:hidden">Bitcoin structured credit</span>
              <span className="hidden sm:inline">Bitcoin structured credit for long-term holders</span>
            </span>
          </motion.div>

          <motion.h1
            variants={container}
            className="text-display font-extrabold"
            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
            onPointerLeave={() => setHover(false)}
          >
            <span className="sr-only">Unlock liquidity. Keep your Bitcoin, wBTC, cbBTC or wBNB.</span>
            <span aria-hidden="true" className="block">
              <Words text="Unlock liquidity." />
              <Words
                text="Keep your"
                className="text-accent"
                after={<AssetRotator index={index} onIndexChange={setIndex} ready={ready} paused={hover} reveal={word} />}
              />
            </span>
          </motion.h1>

          <motion.p variants={fadeUp(0.55)} className="max-w-[520px] text-lede text-muted">
            Borrow USDC against your BTC without selling it. A collar sets a fixed price range for your collateral, and the option premium pays for the
            loan. No monthly payments, no rate resets, no margin calls.
          </motion.p>

          <motion.div variants={fadeUp(0.7)} className="flex flex-col gap-3 sm:flex-row">
            <Button href={LINKS.app}>Launch App</Button>
            <Button href={LINKS.docs} variant="secondary">Watch demo</Button>
          </motion.div>

        </motion.div>

        <div className="mx-auto w-full max-w-[360px] lg:mx-0 lg:justify-self-end">
          <LoanCard ready={ready} />
        </div>
      </div>

      <div id="features" className="page-x relative scroll-mt-20 pb-section">
        <div className="grid gap-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="group">
                <span className="grid size-9 place-items-center rounded-[10px] bg-accent-soft text-accent transition-[box-shadow,transform] duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_24px_rgb(255_80_1/0.45)]">
                  <f.icon size={18} />
                </span>
                <h3 className="mt-3 text-[14px] font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-small leading-5 text-muted">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="pt-6 text-small leading-5 text-muted/75">
          Figures are indicative, using live Binance spot prices: 50% LTV, put strike 15% below spot, call strike 15% above spot. Upside above the call strike
          transfers to the call buyer, and the floor depends on counterparty credit. Not an offer.
        </p>
      </div>
    </section>
    </PriceProvider>
    </AssetContext.Provider>
  );
}
