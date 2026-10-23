import { MARK_PATH, MARK_VIEWBOX } from "./BimaLogo";

/** Decorative brand geometry, kept outside the content and accessibility tree. */
export function BrandContours({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox={MARK_VIEWBOX} fill="none" aria-hidden="true" focusable="false">
    <path d={MARK_PATH} fill="var(--accent)" fillRule="evenodd" className="brand-contour-fill" />
    {[1, .86, .72].map(scale => <path key={scale} d={MARK_PATH} transform={`translate(540 544) scale(${scale}) translate(-540 -544)`} stroke="var(--accent)" strokeWidth="1.1" vectorEffect="non-scaling-stroke" className="brand-contour-line" />)}
  </svg>;
}

export function PageAtmosphere() {
  return <div className="page-atmosphere" aria-hidden="true">
    <div className="page-atmosphere-wash" />
    <div className="page-atmosphere-grid" />
    <BrandContours className="page-brand-shape page-brand-shape-one" />
    <BrandContours className="page-brand-shape page-brand-shape-two" />
    <BrandContours className="page-brand-shape page-brand-shape-three" />
    <span className="page-edge-line page-edge-line-left" /><span className="page-edge-line page-edge-line-right" />
  </div>;
}

export function BrandSculpture() {
  return <div className="brand-sculpture" aria-hidden="true">
    <span className="brand-sculpture-halo" />
    <svg viewBox="0 0 300 150" fill="none">
      <ellipse cx="150" cy="127" rx="100" ry="9" fill="var(--accent-soft)" />
      {[24, 12, 0].map((offset, index) => <svg key={offset} x="35" y={20 + offset} width="230" height="96" viewBox={MARK_VIEWBOX}>
        <path d={MARK_PATH} fill={index === 2 ? "var(--accent)" : "var(--bg-raised)"} stroke={index === 2 ? "var(--accent)" : "var(--border-strong)"} strokeWidth="2" fillRule="evenodd" />
      </svg>)}
    </svg>
  </div>;
}
