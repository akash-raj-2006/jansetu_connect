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
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp"];

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

import { uploadReportImage } from "./upload-image.functions";

/**
 * Upload one image via the server function.
 *
 * The image is compressed on the client, converted to base64, and sent to
 * a server function that uploads it to Supabase Storage. This avoids the
 * "Invalid Compact JWS" error caused by the new-format publishable key
 * being used as a JWT on the client side.
 */
export async function uploadImage(
  blob: Blob,
  onProgress: (percent: number) => void,
  _signal?: AbortSignal,
): Promise<string> {
  const mimeType = blob.type || "image/jpeg";

  onProgress(10);

  // Convert blob to base64 for the server function
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  const base64 = btoa(binary);

  onProgress(30);

  const result = await uploadReportImage({
    data: { base64, mimeType },
  });

  if (!result.ok) {
    throw new Error(result.error || "Upload failed.");
  }

  onProgress(100);
  return result.path;
}
