import { useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, ImagePlus, Loader2, X } from "lucide-react";
import { MAX_IMAGES, compressImage, uploadImage, validateImageFile } from "@/lib/report-images";

type Item = {
  key: string;
  preview: string;
  name: string;
  progress: number;
  path?: string;
  error?: string;
};

/**
 * Photo evidence field: click-to-browse, drag-and-drop and direct camera capture.
 * Images are validated, compressed and uploaded to cloud storage; the parent only
 * receives the resulting storage paths.
 */
export function ImageUploader({
  paths,
  onChange,
}: {
  paths: string[];
  onChange: (paths: string[]) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const browseRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const uploading = items.some((item) => !item.path && !item.error);

  // Publish uploaded paths to the parent after render, never during it.
  const changeRef = useRef(onChange);
  changeRef.current = onChange;
  useEffect(() => {
    changeRef.current(items.filter((item) => item.path).map((item) => item.path!));
  }, [items]);

  // Auto-dismiss errors after 5 seconds
  useEffect(() => {
    if (errors.length === 0) return;
    const timer = setTimeout(() => setErrors([]), 5000);
    return () => clearTimeout(timer);
  }, [errors]);

  async function addFiles(files: File[]) {
    // Clear stale errors before processing a new batch
    setErrors([]);
    const messages: string[] = [];
    const room = MAX_IMAGES - items.filter((item) => !item.error).length;
    if (room <= 0) {
      setErrors([`You can attach up to ${MAX_IMAGES} photos per report.`]);
      return;
    }
    const accepted: File[] = [];
    for (const file of files.slice(0, room)) {
      const problem = validateImageFile(file);
      if (problem) messages.push(problem);
      else accepted.push(file);
    }
    if (files.length > room)
      messages.push(`Only ${MAX_IMAGES} photos per report — extras skipped.`);
    if (messages.length > 0) setErrors(messages);

    for (const file of accepted) {
      const key = crypto.randomUUID();
      const entry: Item = {
        key,
        preview: URL.createObjectURL(file),
        name: file.name,
        progress: 0,
      };
      setItems((prev) => [...prev, entry]);
      try {
        const blob = await compressImage(file);
        const path = await uploadImage(blob, (percent) =>
          setItems((prev) => prev.map((i) => (i.key === key ? { ...i, progress: percent } : i))),
        );
        setItems((prev) => prev.map((i) => (i.key === key ? { ...i, path, progress: 100 } : i)));
      } catch (error) {
        console.error("Image upload error:", error);
        const message = error instanceof Error ? error.message : "Upload failed.";
        setItems((prev) => prev.map((i) => (i.key === key ? { ...i, error: message } : i)));
        setErrors((prev) => [...prev, `${file.name}: ${message}`]);
      }
    }
  }

  function remove(key: string) {
    setItems((prev) => prev.filter((item) => item.key !== key));
    // Clear errors when user removes an image (frees up a slot, old errors no longer relevant)
    setErrors([]);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void addFiles(Array.from(event.dataTransfer.files));
        }}
        className={`rounded-2xl border-2 border-dashed p-4 transition-colors ${
          dragging ? "border-accent bg-accent/10" : "border-border bg-surface-2/40"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => browseRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm font-medium hover:bg-surface-2"
          >
            <ImagePlus className="size-4" /> Add photos
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Camera className="size-4" /> Take a photo
          </button>
          <span className="text-xs text-muted-foreground">
            or drag &amp; drop · up to {MAX_IMAGES} images · JPG/PNG/WebP · 5MB each
          </span>
        </div>

        <input
          ref={browseRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(event) => {
            void addFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(event) => {
            void addFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />

        {items.length > 0 && (
          <ul className="mt-3 grid grid-cols-3 gap-2">
            {items.map((item) => (
              <li
                key={item.key}
                className="relative overflow-hidden rounded-xl border border-border bg-surface"
              >
                <img
                  src={item.preview}
                  alt={item.name}
                  className="aspect-square w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => remove(item.key)}
                  aria-label={`Remove ${item.name}`}
                  className="absolute top-1 right-1 inline-flex size-6 items-center justify-center rounded-full border border-border-strong bg-background/90 text-foreground"
                >
                  <X className="size-3.5" />
                </button>
                {!item.path && !item.error && (
                  <div className="absolute inset-x-0 bottom-0 bg-background/85 px-1.5 py-1">
                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      <Loader2 className="size-3 animate-spin" /> {item.progress}%
                    </div>
                    <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                {item.error && (
                  <p className="absolute inset-x-0 bottom-0 bg-destructive/90 px-1.5 py-1 text-[10px] text-destructive-foreground">
                    Failed
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {uploading && <p className="text-xs text-muted-foreground">Uploading photos…</p>}
      {errors.length > 0 && (
        <ul className="space-y-1">
          {errors.map((message) => (
            <li key={message} className="flex items-start gap-1.5 text-xs text-destructive">
              <AlertCircle className="mt-0.5 size-3.5 shrink-0" /> {message}
            </li>
          ))}
        </ul>
      )}
      {paths.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {paths.length} photo{paths.length > 1 ? "s" : ""} attached.
        </p>
      )}
    </div>
  );
}
