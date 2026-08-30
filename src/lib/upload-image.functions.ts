import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const UploadInput = z.object({
  base64: z.string(),
  mimeType: z.string().default("image/jpeg"),
});

const DEFAULT_SUPABASE_URL = "https://rzjvklvsbrrgfnhxmdgq.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_4RCnS_taXL5Xdwb7gnqaoA_1nYyAoIu";
const IMAGE_BUCKET = "report-images";

/**
 * Server function: uploads an image to Supabase Storage.
 *
 * The new `sb_publishable_*` API keys are NOT valid JWTs, so the Supabase
 * Storage API rejects them when sent as Bearer tokens (or even when the
 * apikey header is parsed as a JWT for role resolution). By routing the
 * upload through the server, we use the Supabase JS client which handles
 * the new key format correctly on the server side (no browser storage/auth
 * issues) and can use the service-role key if available.
 */
export const uploadReportImage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => UploadInput.parse(input))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");

    const url =
      process.env["SUPABASE_URL"] ||
      process.env["VITE_SUPABASE_URL"] ||
      DEFAULT_SUPABASE_URL;

    // Prefer the service-role key for storage operations (bypasses RLS).
    // Fall back to publishable key if service-role is not set.
    const key =
      process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
      process.env["SUPABASE_PUBLISHABLE_KEY"] ||
      process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
      DEFAULT_SUPABASE_KEY;

    const isNewKey = key.startsWith("sb_publishable_") || key.startsWith("sb_secret_");

    // Decode base64 to binary buffer
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

    if (isNewKey) {
      // For new-format keys, use raw fetch with only the apikey header.
      // The server's PostgREST/Storage will accept apikey for role resolution
      // on newer Supabase instances that support the new key format.
      const response = await fetch(`${url}/storage/v1/object/${IMAGE_BUCKET}/${path}`, {
        method: "POST",
        headers: {
          apikey: key,
          "Content-Type": data.mimeType,
          "x-upsert": "true",
        },
        body: bytes,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg = (body as { message?: string; error?: string }).message
          || (body as { error?: string }).error
          || `Upload failed (${response.status})`;
        return { ok: false as const, error: msg };
      }

      return { ok: true as const, path };
    }

    // For old-format JWT keys, use the Supabase SDK normally.
    const supabase = createClient(url, key, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, bytes, {
        upsert: true,
        contentType: data.mimeType,
      });

    if (error) {
      return { ok: false as const, error: error.message || "Upload failed." };
    }

    return { ok: true as const, path };
  });
