/** Official Bima mark (cropped viewBox of bima-logo1.svg). The dot is a cut-out, so it shows the background. */
export const MARK_VIEWBOX = "238 418 604 252";
export const MARK_PATH =
  "M545.014 429.948C541.153 427.743 536.412 427.751 532.559 429.97L258.994 587.541C251.038 592.123 246.134 600.606 246.134 609.789C246.133 638.956 275.295 659.123 302.584 648.827L372.216 622.557C479.595 582.046 598.027 581.884 705.515 622.101L777.439 649.011C804.752 659.231 833.868 639.036 833.866 609.874C833.865 600.645 828.92 592.125 820.907 587.548L545.014 429.948ZM538.138 479.931C517.789 479.931 501.292 496.427 501.292 516.776C501.292 537.125 517.789 553.622 538.138 553.622C558.487 553.622 574.983 537.125 574.983 516.776C574.983 496.427 558.487 479.931 538.138 479.931Z";
/** Centre of the dot, in viewBox units. */
export const DOT = { cx: 538.138, cy: 516.776, r: 36.85 };

export function BimaMark({ className, title = "Bima" }: { className?: string; title?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} role="img" aria-label={title} fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d={MARK_PATH} fill="var(--accent)" />
    </svg>
  );
}

export function BimaWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[14px] font-semibold tracking-[0.12em] text-fg ${className}`}>BIMA</span>
  );
}
