/**
 * Browser-side helpers for citizen photo evidence.
 *
 * Images are compressed in the browser, uploaded directly to Supabase Storage
 * using the public API key with raw XHR (with accurate progress events), and only
 * their storage paths are saved with the report.
 */

export const IMAGE_BUCKET = "report-images";
export const MAX_IMAGES = 3;
export const MAX_BYTES = 5 * 1024 * 1024;
export const MAX_WIDTH = 1600;
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp"];

const DEFAULT_SUPABASE_URL = "https://rzjvklvsbrrgfnhxmdgq.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_4RCnS_taXL5Xdwb7gnqaoA_1nYyAoIu";

/** Helper to validate URL strings to avoid picking up corrupted env vars. */
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

/** Resolves Supabase URL & publishable API key safely. */
export function getSupabaseConfig(): { url: string; key: string } {
  let url = DEFAULT_SUPABASE_URL;
  const envUrl = validHttpUrl(
    (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_URL"]) ||
    (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_URL"]) ||
    (typeof process !== "undefined" && process.env?.["SUPABASE_URL"])
  );
  if (envUrl) url = envUrl;

  let key = DEFAULT_SUPABASE_KEY;
  const envKey =
    (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"]) ||
    (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"]) ||
    (typeof process !== "undefined" && process.env?.["SUPABASE_PUBLISHABLE_KEY"]);

  if (typeof envKey === "string" && envKey.trim().length > 10) {
    key = envKey.trim();
  }

  return { url, key };
}

export function validateImageFile(file: File): string | null {
  const mime = file.type?.toLowerCase() ?? "";
  const ext = file.name?.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";
  // Accept if MIME matches OR if extension matches (camera captures often lack MIME)
  if (!ALLOWED_MIME.includes(mime) && !ALLOWED_EXT.includes(ext)) {
    return `${file.name}: only JPG, PNG or WebP images are allowed.`;
  }
  if (file.size > MAX_BYTES) {
    return `${file.name}: file is ${(file.size / 1024 / 1024).toFixed(1)}MB — the limit is 5MB.`;
  }
  return null;
}

/** Downscale to MAX_WIDTH and re-encode as JPEG to save the citizen's bandwidth. */
export async function compressImage(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_WIDTH / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((value) => resolve(value), "image/jpeg", 0.82),
    );
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

/**
 * Upload one image directly to Supabase Storage via REST API.
 * Uses XMLHttpRequest for real-time progress events.
 */
export function uploadImage(
  blob: Blob,
  onProgress: (percent: number) => void,
  signal?: AbortSignal,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const mimeType = blob.type || "image/jpeg";
    const ext = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
    const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;

    const { url, key } = getSupabaseConfig();
    const endpoint = `${url}/storage/v1/object/${IMAGE_BUCKET}/${path}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint, true);

    // Supabase storage requires both apikey and Authorization headers
    xhr.setRequestHeader("apikey", key);
    xhr.setRequestHeader("Authorization", `Bearer ${key}`);
    xhr.setRequestHeader("Content-Type", mimeType);
    xhr.setRequestHeader("x-upsert", "true");

    if (signal) {
      signal.addEventListener("abort", () => xhr.abort());
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(Math.min(99, Math.max(5, percent)));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve(path);
      } else {
        let message = `Upload failed (${xhr.status})`;
        try {
          const res = JSON.parse(xhr.responseText);
          message = res.message || res.error || message;
        } catch {
          if (xhr.responseText) message = xhr.responseText;
        }
        reject(new Error(message));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during photo upload. Please check your connection."));
    };

    xhr.onabort = () => {
      reject(new Error("Upload cancelled."));
    };

    xhr.send(blob);
  });
}

/**
 * Creates temporary signed URLs for viewing uploaded report images.
 */
export async function getReportImageUrls(paths: string[]): Promise<string[]> {
  if (!paths || paths.length === 0) return [];
  const { url, key } = getSupabaseConfig();

  const results = await Promise.all(
    paths.map(async (path) => {
      try {
        const endpoint = `${url}/storage/v1/object/sign/${IMAGE_BUCKET}/${path}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ expiresIn: 3600 }),
        });

        if (!res.ok) return null;
        const data = await res.json();
        if (data?.signedURL) {
          return `${url}/storage/v1${data.signedURL}`;
        }
        return null;
      } catch {
        return null;
      }
    })
  );

  return results.filter(Boolean) as string[];
}
