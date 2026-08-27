/**
 * Browser-side helpers for citizen photo evidence.
 *
 * Images are compressed in the browser, uploaded straight to cloud storage,
 * and only their storage *paths* are saved with the report — never binary data.
 */

export const IMAGE_BUCKET = "report-images";
export const MAX_IMAGES = 3;
export const MAX_BYTES = 5 * 1024 * 1024;
export const MAX_WIDTH = 1600;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED.includes(file.type.toLowerCase())) {
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

/** Return the value only if it looks like a valid HTTP(S) URL, else undefined. */
function validHttpUrl(v: unknown): string | undefined {
  if (typeof v !== 'string' || !v.trim()) return undefined;
  try { const u = new URL(v.trim()); return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href.replace(/\/$/, '') : undefined; }
  catch { return undefined; }
}

/** Upload one image with real progress reporting (XHR gives us upload events). */
export async function uploadImage(
  blob: Blob,
  onProgress: (percent: number) => void,
  signal?: AbortSignal,
): Promise<string> {
  const url = validHttpUrl(import.meta.env["VITE_SUPABASE_URL"]) ?? "https://rzjvklvsbrrgfnhxmdgq.supabase.co";
  const key = (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || "sb_publishable_4RCnS_taXL5Xdwb7gnqaoA_1nYyAoIu") as string;
  
  const mimeType = blob.type || "image/jpeg";
  const ext = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${url}/storage/v1/object/${IMAGE_BUCKET}/${path}`);
    xhr.setRequestHeader("apikey", key);
    xhr.setRequestHeader("x-upsert", "true");
    xhr.setRequestHeader("content-type", mimeType);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve(path);
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          reject(new Error(res.message || res.error || `Upload failed (${xhr.status})`));
        } catch {
          reject(new Error(`Upload failed (${xhr.status})`));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed — check your connection."));
    signal?.addEventListener("abort", () => xhr.abort());
    xhr.send(blob);
  });
}
