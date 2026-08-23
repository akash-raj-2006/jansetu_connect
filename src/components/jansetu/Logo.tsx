import logoUrl from "@/assets/jansetu-logo.png";

/** JanSetu brand mark (bridge + pin + wordmark). */
export function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="JanSetu — your voice, our action, better India"
      className={`jansetu-logo w-auto ${className}`}
    />
  );
}
