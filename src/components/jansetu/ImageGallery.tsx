import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getReportImageUrls } from "@/lib/report-images";

/** Resolves private storage paths to temporary viewing links. */
function useSignedUrls(paths: string[]) {
  const [urls, setUrls] = useState<string[]>([]);
  const keyed = paths.join("|");

  useEffect(() => {
    let cancelled = false;
    if (!paths.length) {
      setUrls([]);
      return;
    }
    void getReportImageUrls(paths).then((resolved) => {
      if (!cancelled) setUrls(resolved);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyed]);

  return urls;
}

/** Thumbnail strip for report photos; click to open a zoomable lightbox. */
export function ImageGallery({ paths, className = "" }: { paths: string[]; className?: string }) {
  const urls = useSignedUrls(paths);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % urls.length));
      if (event.key === "ArrowLeft")
        setOpen((i) => (i === null ? i : (i - 1 + urls.length) % urls.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, urls.length]);

  if (!paths.length) return null;

  return (
    <div className={className}>
      <p className="label-mono mb-1.5">Photo evidence ({paths.length})</p>
      <ul className="flex flex-wrap gap-2">
        {urls.map((url, index) => (
          <li key={url}>
            <button
              type="button"
              onClick={() => setOpen(index)}
              aria-label={`Open photo ${index + 1} full size`}
              className="block overflow-hidden rounded-lg border border-border transition-transform hover:scale-[1.03]"
            >
              <img
                src={url}
                alt={`Report photo ${index + 1}`}
                loading="lazy"
                className="size-20 object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && urls[open] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Report photo viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpen(null)}
        >
          <img
            src={urls[open]}
            alt={`Report photo ${open + 1} enlarged`}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            aria-label="Close photo viewer"
            onClick={() => setOpen(null)}
            className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full bg-white/15 text-white"
          >
            <X className="size-5" />
          </button>
          {urls.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpen((i) => (i === null ? i : (i - 1 + urls.length) % urls.length));
                }}
                className="absolute left-4 inline-flex size-10 items-center justify-center rounded-full bg-white/15 text-white"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpen((i) => (i === null ? i : (i + 1) % urls.length));
                }}
                className="absolute right-4 inline-flex size-10 items-center justify-center rounded-full bg-white/15 text-white"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
