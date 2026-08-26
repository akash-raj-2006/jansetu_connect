import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as Sun, g as Moon } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jansetu-logo-DFsxY2ZV.js
var jansetu_logo_default = "/assets/jansetu-logo-ChD5uRXc.png";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/Logo-CTm99nS3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Ambient, low-motion backdrop that matches the "Paper & Ink" theme:
* a slowly drifting ruled grid plus soft ink blooms in the section hues.
* Purely decorative — hidden in high-contrast mode via CSS.
*/
function AmbientBackdrop() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": true,
		className: "jansetu-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid-lines animate-grid-drift absolute inset-[-2rem] opacity-60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-bloom-float absolute -top-24 -left-16 size-[26rem] rounded-full blur-3xl",
				style: { background: "color-mix(in oklab, var(--nav-overview) 22%, transparent)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-bloom-float absolute top-1/3 -right-24 size-[24rem] rounded-full blur-3xl",
				style: {
					background: "color-mix(in oklab, var(--nav-report) 18%, transparent)",
					animationDelay: "-6s"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-bloom-float absolute -bottom-28 left-1/3 size-[28rem] rounded-full blur-3xl",
				style: {
					background: "color-mix(in oklab, var(--nav-track) 20%, transparent)",
					animationDelay: "-12s"
				}
			})
		]
	});
}
var KEY = "jansetu-theme";
/**
* Light / dark ("space") theme switch: adds `.dark` to <html> so the design
* tokens swap to the near-black palette. Choice persists in localStorage.
*/
function ThemeToggle({ className = "" }) {
	const [dark, setDark] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem(KEY);
		const prefersDark = stored === null && typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false;
		setDark(stored === "dark" || prefersDark);
		document.documentElement.classList.remove("hc");
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", dark);
	}, [dark]);
	function toggle() {
		const next = !dark;
		setDark(next);
		localStorage.setItem(KEY, next ? "dark" : "light");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: toggle,
		role: "switch",
		"aria-checked": dark,
		"aria-label": dark ? "Switch to light mode" : "Switch to dark mode",
		className: `inline-flex shrink-0 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3 py-2 text-xs font-semibold transition-colors hover:bg-surface-2 ${className}`,
		children: [
			dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {
				className: "size-3.5",
				strokeWidth: 2.4
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {
				className: "size-3.5",
				strokeWidth: 2.4
			}),
			dark ? "Dark" : "Light",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `ml-1 inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors ${dark ? "bg-foreground" : "border border-border bg-surface-2"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-3 rounded-full transition-transform ${dark ? "translate-x-3.5 bg-background" : "translate-x-0.5 bg-muted-foreground"}` })
			})
		]
	});
}
/** JanSetu brand mark (bridge + pin + wordmark). */
function Logo({ className = "h-10" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: jansetu_logo_default,
		alt: "JanSetu — your voice, our action, better India",
		className: `jansetu-logo w-auto ${className}`
	});
}
//#endregion
export { Logo as n, ThemeToggle as r, AmbientBackdrop as t };
