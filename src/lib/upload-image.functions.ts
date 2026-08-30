import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const UploadInput = z.object({
  base64: z.string(),
  mimeType: z.string().default("image/jpeg"),
});

const IMAGE_BUCKET = "report-images";
const DEFAULT_SUPABASE_URL = "https://rzjvklvsbrrgfnhxmdgq.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_4RCnS_taXL5Xdwb7gnqaoA_1nYyAoIu";

/** Only accept the value if it's a real HTTP(S) URL, not a git command or junk. */
function validHttpUrl(v: unknown): string | undefined {
  if (typeof v !== "string" || !v.trim()) return undefined;
  try {
    const u = new URL(v.trim());
    return u.protocol === "http:" || u.protocol === "https:"
      ? u.href.replace(/\/$/, "")
      : undefined;
  } catch {
    return undefined;
  }
}

function getSupabaseConfig() {
  const url =
    validHttpUrl(process.env["SUPABASE_URL"]) ??
    validHttpUrl(process.env["VITE_SUPABASE_URL"]) ??
    DEFAULT_SUPABASE_URL;

  const key =
    process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    DEFAULT_SUPABASE_KEY;

  return { url, key };
}

/**
 * Server function: uploads an image to Supabase Storage via raw REST API.
 * Uses only raw fetch — no Supabase SDK — to avoid JWT/URL init errors.
 */
export const uploadReportImage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => UploadInput.parse(input))
  .handler(async ({ data }) => {
    const { url, key } = getSupabaseConfig();

    // Decode base64 to binary
    const binaryStr = atob(data.base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const ext = data.mimeType.includes("png")
      ? "png"
      : data.mimeType.includes("webp")
        ? "webp"
        : "jpg";
    const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;

    const endpoint = `${url}/storage/v1/object/${IMAGE_BUCKET}/${path}`;

    const headers: Record<string, string> = {
      "apikey": key,
      "Content-Type": data.mimeType,
      "x-upsert": "true",
    };

    // Old-format JWT keys can be sent as Bearer; new sb_* keys must NOT be.
    const isOldJwtKey =
      !key.startsWith("sb_publishable_") && !key.startsWith("sb_secret_");
    if (isOldJwtKey) {
      headers["Authorization"] = `Bearer ${key}`;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: bytes,
    });

    if (!response.ok) {
      const body = await response.text();
      let msg = `Upload failed (${response.status})`;
      try {
        const json = JSON.parse(body);
        msg = json.message || json.error || msg;
      } catch {
        if (body) msg = body;
      }
      console.error("Storage upload failed:", response.status, body);
      return { ok: false as const, error: msg };
    }

    return { ok: true as const, path };
  });
