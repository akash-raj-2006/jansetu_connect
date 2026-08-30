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
 * Server function: uploads an image to the public Supabase Storage bucket.
 *
 * The bucket is set to public=true so no JWT is required for uploads —
 * only the apikey header is needed. This avoids "Invalid Compact JWS"
 * from the new sb_publishable_* key format which is not a valid JWT.
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

    // Use /object/ endpoint with apikey only (public bucket — no JWT needed).
    const endpoint = `${url}/storage/v1/object/${IMAGE_BUCKET}/${path}`;

    const headers: Record<string, string> = {
      "apikey": key,
      "Content-Type": data.mimeType,
      "x-upsert": "true",
    };

    // Only add Bearer for old-format JWT keys (service role, old anon key).
    // New sb_publishable_* / sb_secret_* keys must NOT be sent as Bearer.
    const isNewKey = key.startsWith("sb_publishable_") || key.startsWith("sb_secret_");
    if (!isNewKey) {
      headers["Authorization"] = `Bearer ${key}`;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: bytes,
    });

    if (!response.ok) {
      const bodyText = await response.text();
      let msg = `Upload failed (${response.status})`;
      try {
        const json = JSON.parse(bodyText);
        msg = (json as { message?: string; error?: string }).message
          || (json as { error?: string }).error
          || msg;
      } catch {
        if (bodyText) msg = bodyText;
      }
      console.error("Storage upload failed:", response.status, bodyText);
      return { ok: false as const, error: msg };
    }

    return { ok: true as const, path };
  });
