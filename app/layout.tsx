import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bima — Unlock liquidity. Keep your Bitcoin.",
  description:
    "Borrow USDC against your Bitcoin without selling it. Bima collar loans use option premium to fund the loan: fixed terms, no monthly payments, no margin calls.",
  icons: { icon: "/bima-logo.svg" },
  openGraph: {
    title: "Bima — Unlock liquidity. Keep your Bitcoin.",
    description: "Bitcoin structured credit for long-term holders.",
    siteName: "Bima",
    url: "https://bima.money",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#131417" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
  ],
};

/**
 * Runs before paint:
 *  - applies the saved theme (or the OS preference) so there is no flash,
 *  - marks the logo intro as already played for this tab session, or skips it
 *    for reduced-motion users.
 */
const bootScript = `(function(){try{
var d=document.documentElement;
var t=localStorage.getItem('bima-theme');
if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}
d.setAttribute('data-theme',t);
var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(rm||sessionStorage.getItem('bima-intro')==='1'){d.setAttribute('data-intro','skip');}
}catch(e){document.documentElement.setAttribute('data-intro','skip');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`.intro-overlay{display:none!important}#nav-logo-mark{opacity:1!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
