import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { E as House, U as ChartColumn, _ as Mic, k as FileSearch } from "../_libs/lucide-react.mjs";
import { n as Logo, r as ThemeToggle, t as AmbientBackdrop } from "./Logo-CTm99nS3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-CYXJOvDL.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/",
		label: "Overview",
		icon: House,
		code: "00",
		tint: "var(--nav-overview)"
	},
	{
		to: "/report",
		label: "File a report",
		icon: Mic,
		code: "01",
		tint: "var(--nav-report)"
	},
	{
		to: "/track",
		label: "Track a case",
		icon: FileSearch,
		code: "02",
		tint: "var(--nav-track)"
	},
	{
		to: "/dashboard",
		label: "Policy data",
		icon: ChartColumn,
		code: "03",
		tint: "var(--nav-data)"
	}
];
/**
* Dashboard-style shell: fixed ruled sidebar on the left, document content on the right.
*/
function AppShell({ children, title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen bg-transparent lg:flex",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmbientBackdrop, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "border-b border-border bg-sidebar lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4 px-5 py-5 lg:block",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-mono mt-1 block",
								children: "जनसेतु / civic data desk"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, { className: "hidden lg:mt-5 lg:inline-flex" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex gap-1.5 overflow-x-auto lg:mt-5 lg:flex-col lg:gap-1.5 lg:overflow-visible",
							children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								activeOptions: { exact: item.to === "/" },
								style: { "--tint": item.tint },
								className: "group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-lg border border-transparent px-3 py-2.5 text-sm whitespace-nowrap text-muted-foreground transition-all hover:border-[color-mix(in_oklab,var(--tint)_35%,transparent)] hover:bg-[color-mix(in_oklab,var(--tint)_10%,transparent)] hover:text-[var(--tint)]",
								activeProps: { className: "border-[color-mix(in_oklab,var(--tint)_45%,transparent)] bg-[color-mix(in_oklab,var(--tint)_14%,transparent)] text-[var(--tint)] font-semibold shadow-[inset_3px_0_0_0_var(--tint)]" },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-6 items-center justify-center rounded-md text-[var(--tint)]",
										style: { background: "color-mix(in oklab, var(--tint) 16%, transparent)" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
											className: "size-3.5",
											strokeWidth: 2
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden lg:inline font-mono text-[10px] opacity-60",
										children: item.code
									}),
									item.label
								]
							}, item.to))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden border-t border-border px-5 py-4 lg:block",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-mono",
							children: "Method"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted-foreground",
							children: "Priority = (volume × urgency weight) + (residents affected ÷ infra score)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/login",
							className: "mt-3 inline-block text-xs font-medium text-accent hover:underline",
							children: "Official sign-in →"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
						className: "border-b border-border-strong bg-background/95 px-5 py-5 backdrop-blur sm:px-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-semibold sm:text-3xl",
								children: title
							}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 max-w-2xl text-sm text-muted-foreground",
								children: subtitle
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, { className: "lg:hidden" }), actions]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "px-5 py-6 sm:px-8",
						children
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
						className: "border-t border-border px-5 py-6 text-xs text-muted-foreground sm:px-8",
						children: "JanSetu · a digital public good prototype for citizen-to-policy infrastructure feedback."
					})
				]
			})
		]
	});
}
//#endregion
export { AppShell as t };
