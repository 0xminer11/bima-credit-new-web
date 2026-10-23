# Bima homepage (Next.js)

Animated marketing homepage for Bima collar loans, built from the approved Figma design
("Bima Homepage — Hero Redesign"). Dark and light themes, the official Bima mark, and a logo intro clip.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out (host on Vercel, Netlify, S3, Cloudflare Pages)
```

Requires Node 20+. Stack: Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Motion (Framer Motion) · lucide-react · Inter (self-hosted via @fontsource).

Pages:
- `/` — the homepage
- `/sting/` — the logo animation clip on its own, looping (`?once` plays it a single time, `?delay=1000` waits first). Use it to screen-record social clips.

## Where things live

| File | What it is |
|---|---|
| `app/globals.css` | Theme tokens (dark + light, same names as the Figma variables), slider and button styles, reduced-motion rules |
| `app/layout.tsx` | Boot script: applies saved theme before paint (no flash), decides whether the intro plays |
| `lib/content.ts` | All copy and data: nav, assets, investors, angels, auditors, FAQ, links |
| `components/BimaLogo.tsx` | Official mark (from `bima-logo1.svg`) |
| `components/LogoSting.tsx` | The logo animation clip |
| `components/IntroOverlay.tsx` | First-visit intro that plays the clip (once per tab session, click to skip) |
| `components/HeroBackground.tsx` | Animated hero background (canvas + layers) |
| `components/Hero.tsx`, `LoanCard.tsx` | Hero copy, live loan preview card, collar chart |
| `components/Sections.tsx` | Supported assets, investors, audited by, FAQ, community, footer |
| `components/ThemeToggle.tsx` | Sun/moon switch, saved to localStorage, defaults to the OS setting |

## Animation map

| Where | What happens |
|---|---|
| Intro (first visit) | Mark outline draws on → fill floods in → light sweep → two pulse rings from the dot → arc "boomerang" fly-by → BIMA wordmark tracks in → overlay blurs away |
| Hero background | Grid with an orange spotlight that follows the cursor · two drifting glows · **collar field** canvas: ribbons shaped like the collar payoff (floor → ramp → cap) that breathe, with capital particles flowing along them · giant ghost outline of the mark with a light tracing its edge · parallax on scroll |
| Headline | Word-by-word rise, then lede, buttons and trust row fade up |
| Loan card | Blur-in entrance, 3D tilt that follows the cursor, rotating border sheen, pulsing live dot, count-up on "You receive", **live LTV slider** (25–60%) with spring-animated amount, collar line draws on with markers popping in and a dot riding the payoff |
| Floating chips | Pop in, then float on offset loops |
| Sections | Fade-up on scroll, hover lift on cards, counting audit numbers, orbiting rings around the shield, animated FAQ accordion, breathing glow on the community card |
| Theme toggle | Sliding pill; colors cross-fade |

Everything respects `prefers-reduced-motion`: the intro is skipped, loops stop and the background renders a single still frame. The canvas pauses when the hero is off screen or the tab is hidden.

## Before launch — content to confirm

- [ ] **Brand font.** Inter is a stand-in. Swap `--font-sans` in `globals.css` (and the `@fontsource` import) for the brand font.
- [ ] **Partner logos.** Fund and auditor tiles show names as text. Drop SVGs into `public/logos/` and render them in `LogoTile`.
- [ ] **Angel photos.** Add `photo: "/angels/<file>.jpg"` per angel in `lib/content.ts`; initials show until then.
- [ ] **Two unnamed auditors.** Marked "Auditor (TBD)" in `lib/content.ts`.
- [ ] **"Watch demo"** points at the docs; replace with the demo video URL.
- [ ] **Loan card figures** are the whitepaper's illustrative example ($100k reference price, 1% fee, $50k floor, $130k cap). They are labelled "Illustrative"; wire to live quotes if wanted.
- [ ] **Security wording.** The old site called the contracts "immutable, proxy-free"; the strategy uses upgradeable proxies, so that claim was left out. Confirm with engineering.
