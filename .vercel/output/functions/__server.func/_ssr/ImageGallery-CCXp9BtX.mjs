import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as supabase } from "./auth-attacher-CoQhurBi.mjs";
import { B as ChevronLeft, n as X, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as IMAGE_BUCKET } from "./report-images-BGUOyCjx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ImageGallery-CCXp9BtX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Resolves private storage paths to temporary viewing links. */
function useSignedUrls(paths) {
	const [urls, setUrls] = (0, import_react.useState)([]);
	const keyed = paths.join("|");
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		if (!paths.length) {
			setUrls([]);
			return;
		}
		supabase.storage.from(IMAGE_BUCKET).createSignedUrls(paths, 3600).then(({ data }) => {
			if (!cancelled) setUrls((data ?? []).map((d) => d.signedUrl).filter(Boolean));
		});
		return () => {
			cancelled = true;
		};
	}, [keyed]);
	return urls;
}
/** Thumbnail strip for report photos; click to open a zoomable lightbox. */
function ImageGallery({ paths, className = "" }) {
	const urls = useSignedUrls(paths);
	const [open, setOpen] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (open === null) return;
		function onKey(event) {
			if (event.key === "Escape") setOpen(null);
			if (event.key === "ArrowRight") setOpen((i) => i === null ? i : (i + 1) % urls.length);
			if (event.key === "ArrowLeft") setOpen((i) => i === null ? i : (i - 1 + urls.length) % urls.length);
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, urls.length]);
	if (!paths.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "label-mono mb-1.5",
				children: [
					"Photo evidence (",
					paths.length,
					")"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-wrap gap-2",
				children: urls.map((url, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setOpen(index),
					"aria-label": `Open photo ${index + 1} full size`,
					className: "block overflow-hidden rounded-lg border border-border transition-transform hover:scale-[1.03]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: url,
						alt: `Report photo ${index + 1}`,
						loading: "lazy",
						className: "size-20 object-cover"
					})
				}) }, url))
			}),
			open !== null && urls[open] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "Report photo viewer",
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4",
				onClick: () => setOpen(null),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: urls[open],
						alt: `Report photo ${open + 1} enlarged`,
						className: "max-h-[85vh] max-w-full rounded-lg object-contain",
						onClick: (event) => event.stopPropagation()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close photo viewer",
						onClick: () => setOpen(null),
						className: "absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full bg-white/15 text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					}),
					urls.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Previous photo",
						onClick: (event) => {
							event.stopPropagation();
							setOpen((i) => i === null ? i : (i - 1 + urls.length) % urls.length);
						},
						className: "absolute left-4 inline-flex size-10 items-center justify-center rounded-full bg-white/15 text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Next photo",
						onClick: (event) => {
							event.stopPropagation();
							setOpen((i) => i === null ? i : (i + 1) % urls.length);
						},
						className: "absolute right-4 inline-flex size-10 items-center justify-center rounded-full bg-white/15 text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
					})] })
				]
			})
		]
	});
}
//#endregion
export { ImageGallery as t };
