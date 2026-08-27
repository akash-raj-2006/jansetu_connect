import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const DEFAULT_SUPABASE_URL = 'https://rzjvklvsbrrgfnhxmdgq.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_4RCnS_taXL5Xdwb7gnqaoA_1nYyAoIu';

/** Return the value only if it looks like a valid HTTP(S) URL, else undefined. */
function validHttpUrl(v: unknown): string | undefined {
  if (typeof v !== 'string' || !v.trim()) return undefined;
  try { const u = new URL(v.trim()); return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href.replace(/\/$/, '') : undefined; }
  catch { return undefined; }
}

/** Server-side publishable client for public reads/writes inside server functions. */
export function createPublicServerClient() {
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    DEFAULT_SUPABASE_KEY;
  const url =
    validHttpUrl(process.env["SUPABASE_URL"]) ??
    validHttpUrl(process.env["VITE_SUPABASE_URL"]) ??
    DEFAULT_SUPABASE_URL;

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}
