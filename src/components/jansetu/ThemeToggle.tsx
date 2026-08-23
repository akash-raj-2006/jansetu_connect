import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "jansetu-theme";

/**
 * Light / dark ("space") theme switch: adds `.dark` to <html> so the design
 * tokens swap to the near-black palette. Choice persists in localStorage.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const prefersDark =
      stored === null && typeof window !== "undefined"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : false;
    setDark(stored === "dark" || prefersDark);
    // legacy high-contrast class cleanup
    document.documentElement.classList.remove("hc");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem(KEY, next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex shrink-0 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3 py-2 text-xs font-semibold transition-colors hover:bg-surface-2 ${className}`}
    >
      {dark ? <Moon className="size-3.5" strokeWidth={2.4} /> : <Sun className="size-3.5" strokeWidth={2.4} />}
      {dark ? "Dark" : "Light"}
      <span
        className={`ml-1 inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors ${
          dark ? "bg-foreground" : "border border-border bg-surface-2"
        }`}
      >
        <span
          className={`size-3 rounded-full transition-transform ${
            dark ? "translate-x-3.5 bg-background" : "translate-x-0.5 bg-muted-foreground"
          }`}
        />
      </span>
    </button>
  );
}
