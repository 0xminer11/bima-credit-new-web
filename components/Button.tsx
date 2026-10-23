import { ArrowRight, Play } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  href: string;
  variant?: "primary" | "secondary";
  size?: "lg" | "sm";
  icon?: boolean;
  className?: string;
  children: ReactNode;
};

/** Maps to the Figma "Button" component: Style=Primary|Secondary, Size=Large|Small. */
export function Button({ href, variant = "primary", size = "lg", icon = true, className = "", children }: Props) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const base =
    "group inline-flex items-center justify-center gap-2 font-semibold transition-[transform,background-color,border-color,box-shadow] duration-300 active:scale-[0.98]";
  const sizes = size === "lg" ? "px-5 py-3 text-[14px] rounded-[10px]" : "px-3.5 py-2 text-[13px] rounded-[10px]";
  const variants =
    variant === "primary"
      ? "btn-sheen bg-accent text-white shadow-[0_8px_24px_-6px_rgb(255_80_1/0.45)] hover:shadow-[0_12px_32px_-6px_rgb(255_80_1/0.6)] hover:-translate-y-px"
      : "border border-line-strong text-fg hover:bg-raised hover:-translate-y-px";
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${base} ${sizes} ${variants} ${className}`}
    >
      {icon && variant === "secondary" && <Play size={size === "lg" ? 13 : 12} className="fill-current" />}
      {children}
      {icon && variant === "primary" && (
        <ArrowRight size={size === "lg" ? 15 : 13} className="transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </a>
  );
}
