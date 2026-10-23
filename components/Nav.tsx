"use client";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { LINKS, NAV } from "@/lib/content";
import { BimaMark, BimaWordmark } from "./BimaLogo";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? "border-b border-line bg-base/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="page-x flex min-h-16 items-center justify-between py-3">
        <a href="#top" className="flex min-h-9 items-center gap-2" aria-label="Bima home">
          <BimaMark className="h-4 w-10" />
          <BimaWordmark />
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="relative text-[13px] font-medium text-muted transition-colors hover:text-fg after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button href={LINKS.app} size="sm">Launch App</Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle compact />
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line text-fg"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-line bg-base/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="page-x flex flex-col gap-1 pb-6">
              {NAV.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-3 text-[14px] font-medium text-fg hover:bg-raised">
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-3">
                <Button href={LINKS.app} className="w-full">Launch App</Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
