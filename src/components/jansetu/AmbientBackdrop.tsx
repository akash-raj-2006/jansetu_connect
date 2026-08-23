/**
 * Ambient, low-motion backdrop that matches the "Paper & Ink" theme:
 * a slowly drifting ruled grid plus soft ink blooms in the section hues.
 * Purely decorative — hidden in high-contrast mode via CSS.
 */
export function AmbientBackdrop() {
  return (
    <div aria-hidden className="jansetu-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="grid-lines animate-grid-drift absolute inset-[-2rem] opacity-60" />
      <div
        className="animate-bloom-float absolute -top-24 -left-16 size-[26rem] rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--nav-overview) 22%, transparent)" }}
      />
      <div
        className="animate-bloom-float absolute top-1/3 -right-24 size-[24rem] rounded-full blur-3xl"
        style={{
          background: "color-mix(in oklab, var(--nav-report) 18%, transparent)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="animate-bloom-float absolute -bottom-28 left-1/3 size-[28rem] rounded-full blur-3xl"
        style={{
          background: "color-mix(in oklab, var(--nav-track) 20%, transparent)",
          animationDelay: "-12s",
        }}
      />
    </div>
  );
}
