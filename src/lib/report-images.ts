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

import { supabase } from "@/integrations/supabase/client";

/** Upload one image to Supabase cloud storage. */
export async function uploadImage(
  blob: Blob,
  onProgress: (percent: number) => void,
  signal?: AbortSignal,
): Promise<string> {
  const mimeType = blob.type || "image/jpeg";
  const ext = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;

  onProgress(25);

  const { data, error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, blob, {
      upsert: true,
      contentType: mimeType,
    });

  if (error) {
    throw new Error(error.message || "Failed to upload image.");
  }

  onProgress(100);
  return data.path;
}
