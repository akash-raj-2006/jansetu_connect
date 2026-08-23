const KEY = "jansetu.my-reports";

/** Tracking codes this browser has filed, newest first (guest reporting support). */
export function getSavedCodes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string").slice(0, 30);
  } catch {
    return [];
  }
}

export function saveCode(code: string) {
  if (typeof window === "undefined") return;
  const clean = code.trim().toUpperCase();
  if (!clean) return;
  const next = [clean, ...getSavedCodes().filter((c) => c !== clean)].slice(0, 30);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
}
