export const LINKS = {
  app: "https://www.bima.money/credit-marketplace",
  docs: "https://docs.bima.money/",
  mediaKit: "https://drive.google.com/drive/folders/1g0uqwbAhfgF-ozdQDepA4y-NAy4Ir9GQ",
  contact: "mailto:hello@bima.money",
  discord: "https://discord.com/invite/WgR5kMz3HG",
  x: "https://x.com/BimaBTC",
  telegram: "https://t.me/Bimabtc",
  linkedin: "https://www.linkedin.com/company/bimabtc",
  github: "https://github.com/Bima-Labs",
};

export const NAV = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "Docs", href: LINKS.docs },
];

export const LOAN_PARAMS = {
  ltv: 0.5, // fixed loan-to-value
  collarWidth: 0.15, // put = spot x 0.85, call = spot x 1.15
  termMonths: 12,
} as const;

/**
 * Assets rotated in the H1 and priced in the loan preview.
 * depositQty values are illustrative and editable.
 * `sources` is an ordered list of Binance price sources: the first one that exists on Binance wins.
 *  - direct: the asset has its own USDT market
 *  - cross:  `pair` (asset/BTC) x `via` (BTC/USDT)
 *  - peg:    priced 1:1 with another asset's USDT market
 */
export const HERO_ASSETS = [
  {
    key: "btc", word: "Bitcoin", symbol: "BTC", depositQty: 1, color: "#F7931A",
    sources: [{ type: "direct", pair: "BTCUSDT" }],
  },
  {
    key: "wbtc", word: "wBTC", symbol: "wBTC", depositQty: 1, color: "#5A5564",
    sources: [
      { type: "direct", pair: "WBTCUSDT" },
      { type: "cross", pair: "WBTCBTC", via: "BTCUSDT" }, // WBTC/BTC x BTC/USDT
      { type: "peg", pair: "BTCUSDT", note: "Priced 1:1 with BTC" },
    ],
  },
  {
    key: "cbbtc", word: "cbBTC", symbol: "cbBTC", depositQty: 1, color: "#0052FF",
    sources: [
      { type: "direct", pair: "CBBTCUSDT" },
      { type: "peg", pair: "BTCUSDT", note: "Priced 1:1 with BTC" },
    ],
  },
  {
    key: "wbnb", word: "wBNB", symbol: "wBNB", depositQty: 100, color: "#F3BA2F",
    sources: [{ type: "peg", pair: "BNBUSDT", note: "Priced 1:1 with BNB" }],
  },
] as const;
export type HeroAsset = (typeof HERO_ASSETS)[number];

const ASSET_DESC: Record<HeroAsset["key"], string> = {
  btc: "Native Bitcoin, held with institutional custody.",
  wbtc: "Wrapped Bitcoin, 1:1 backed on EVM chains.",
  cbbtc: "Coinbase wrapped Bitcoin, 1:1 backed.",
  wbnb: "Wrapped BNB, the ERC-20 form of BNB.",
};
export const ASSETS = HERO_ASSETS.map((a) => ({ symbol: a.symbol, color: a.color, desc: ASSET_DESC[a.key] }));

export const LED_BY = {
  name: "Portal Ventures",
  logo: "/images/investors/portal-ventures.svg",
  href: "https://portal.vc/",
};

export const FUNDS = [
  { name: "Core", logo: "/images/investors/core.svg", href: "https://coredao.org/" },
  {
    name: "Delta Blockchain Fund",
    logo: "/images/investors/delta-blockchain-fund.svg",
    href: "https://deltafund.io/",
  },
  { name: "Halo Capital", logo: "/images/investors/halo-capital.svg", href: "https://www.halo.xyz/" },
  {
    name: "Sats Ventures",
    logo: "/images/investors/lsats-ventures.svg",
    href: "https://www.satsventures.com/",
  },
  { name: "Luxor", logo: "/images/investors/luxor.svg", href: "https://luxor.tech/" },
  { name: "DGB", logo: "/images/investors/dgb.svg", href: "https://www.dgb.vc/" },
  { name: "Aurion Capital", logo: "/images/investors/aurion-capital.svg", href: "https://www.aurion.capital/" },
  { name: "Trust Machines", logo: "/images/investors/trust-machines.svg", href: "https://trustmachines.co/" },
];

/** Original audit marks and destinations from bima-credit-web. */
export const AUDITORS = [
  { name: "ScaleBit", logo: "/images/audited/auditor-1.svg", href: LINKS.docs },
  { name: "Cyfrin", logo: "/images/audited/auditor-2.svg", href: LINKS.docs },
  { name: "Cantina", logo: "/images/audited/auditor-3.svg", href: "https://cantina.xyz/" },
  { name: "Cyba Security", logo: "/images/audited/auditor-4.svg", href: "https://cybasecurity.io/" },
];

export const FAQ = [
  {
    q: "What is Bima?",
    a:
      "Bima is a Bitcoin structured finance platform that enables individuals, businesses, and institutions to unlock liquidity without selling their Bitcoin. Through innovative collateral loan products, Bima helps borrowers access capital while preserving long-term Bitcoin ownership.",
  },
  {
    q: "What is a Bitcoin collar loan?",
    a:
      "A Bitcoin Collar loan lets you borrow USDC against your BTC without selling it, at 0% interest. You repay only the amount you borrowed. The loan includes a collar, a built-in price range that limits both your downside and your upside.",
  },
  {
    q: "How does Bima offer low- or zero-interest loans?",
    a:
      "Bima uses structured financing strategies, including option-based collar structures, to reduce borrowing costs. By combining collateralized lending with institutional risk management, eligible borrowers can access financing at significantly lower rates than traditional Bitcoin-backed loans.",
  },
  {
    q: "Who are Bima loans designed for?",
    a:
      "Bima serves long-term Bitcoin holders, corporate treasuries, miners, funds, family offices, and institutions seeking liquidity without giving up exposure to Bitcoin's long-term appreciation.",
  },
  {
    q: "Why not simply sell my Bitcoin?",
    a:
      "Selling Bitcoin can trigger taxable events and eliminate future upside. Borrowing against Bitcoin allows you to access liquidity while maintaining ownership of your assets and continued participation in potential price appreciation.",
  },
  {
    q: "What can I use the borrowed funds for?",
    a:
      "Loan proceeds can be used for virtually any purpose, including business expansion, investments, tax planning, treasury management, real estate purchases, operational expenses, or personal liquidity.",
  },
  {
    q: "Is my Bitcoin secure?",
    a:
      "Security is central to Bima's platform. Bitcoin collateral is held through institutional-grade custody infrastructure and protected by industry-leading security practices designed for both individual and institutional borrowers.",
  },
  {
    q: "How much can I borrow?",
    a:
      "Borrowing capacity depends on the value of your Bitcoin collateral, the selected loan product, and the applicable loan-to-value (LTV) ratio. Bima offers multiple financing structures designed to accommodate different risk profiles and capital needs.",
  },
  {
    q: "What happens if the price of Bitcoin changes?",
    a:
      "Each loan is structured with clearly defined collateral requirements and risk parameters. Depending on the loan product, Bima's financing structures are designed to help borrowers manage market volatility while maintaining a transparent borrowing experience.",
  },
  {
    q: "Why choose Bima over traditional Bitcoin lenders?",
    a:
      "Bima combines institutional structured finance with Bitcoin-native infrastructure. Rather than offering one-size-fits-all loans, Bima provides innovative financing solutions designed to reduce borrowing costs, preserve Bitcoin ownership, and maximize capital efficiency.",
  },
];
