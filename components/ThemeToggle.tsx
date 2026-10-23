"use client";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");
  useEffect(() => {
    const read = () => setThemeState((document.documentElement.dataset.theme as Theme) || "dark");
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  const setTheme = (t: Theme) => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("bima-theme", t);
    } catch {}
  };
  return { theme, setTheme };
}

/** Segmented sun/moon switch. The active pill slides between the two. */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();

  if (compact) {
    const next = theme === "dark" ? "light" : "dark";
    return (
      <button
        type="button"
        onClick={() => setTheme(next)}
        aria-label={`Switch to ${next} mode`}
        className="grid size-10 place-items-center rounded-full border border-line text-fg transition-colors hover:bg-raised"
      >
        <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.35 }}>
          {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
        </motion.span>
      </button>
    );
  }

  return (
    <div role="radiogroup" aria-label="Color theme" className="flex rounded-full border border-line bg-surface p-0.5">
      {(["light", "dark"] as const).map((t) => {
        const active = theme === t;
        return (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${t} mode`}
            onClick={() => setTheme(t)}
            className={`relative grid size-7 place-items-center rounded-full transition-opacity ${active ? "text-fg" : "text-fg opacity-55 hover:opacity-90"}`}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 rounded-full bg-raised"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative">{t === "light" ? <Sun size={14} /> : <Moon size={14} />}</span>
          </button>
        );
      })}
    </div>
  );
}
