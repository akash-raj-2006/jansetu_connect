import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { CATEGORY_COLOR, LANGUAGE_LABELS, STATUSES } from "./jansetu-Wo0gHWAe.mjs";
import { t as Button } from "./button-DAOZKppQ.mjs";
import { t as Input } from "./input-COtCr2HY.mjs";
import { A as FilePlusCorner, C as Lightbulb, K as Building2, M as Droplets, f as Search, j as Ellipsis, m as Route, s as Trash2, y as MapPin } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-CYXJOvDL.mjs";
import { t as ImageGallery } from "./ImageGallery-CCXp9BtX.mjs";
import { n as useWards, t as useReports } from "./use-jansetu-data-DyLqof76.mjs";
import { t as getSavedCodes } from "./my-reports-FCHAQeFG.mjs";
import { t as Route$1 } from "./track-Cn9b4TQ9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track-BpENros0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STEP_INDEX = {
	submitted: 0,
	acknowledged: 1,
	in_progress: 2,
	resolved: 3
};
function Timeline({ report }) {
	const current = STEP_INDEX[report.status] ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "mt-4 space-y-3",
		children: STATUSES.map((status, index) => {
			const done = index <= current;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `mt-1 size-3 shrink-0 rounded-full ${done ? "bg-primary" : "bg-muted"}`,
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: done ? "text-sm font-medium" : "text-sm text-muted-foreground",
					children: status.label
				}), index === current && report.official_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: ["Official note: ", report.official_note]
				})] })]
			}, status.id);
		})
	});
}
var CATEGORY_ICON = {
	roads: Route,
	water: Droplets,
	electricity: Lightbulb,
	sanitation: Building2,
	waste: Trash2,
	other: Ellipsis
};
function RecentReports({ reports, wardName, activeCode, onOpen }) {
	const [codes, setCodes] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => setCodes(getSavedCodes()), []);
	if (codes === null) return null;
	const mine = codes.map((code) => reports.find((r) => r.tracking_code.toUpperCase() === code)).filter((r) => Boolean(r));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "Your recent reports"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Saved on this device — tap any card to open its full timeline."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/report",
				className: "text-sm font-semibold text-accent hover:underline",
				children: "File a new report →"
			})]
		}), mine.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sheet mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold",
				children: "No reports yet"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Once you file a complaint it will appear here automatically — no account needed."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/report",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlusCorner, { className: "size-4" }), " File your first report"]
				})
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 grid gap-3 sm:grid-cols-2",
			children: mine.map((report) => {
				const Icon = CATEGORY_ICON[report.category] ?? Ellipsis;
				const selected = report.tracking_code.toUpperCase() === activeCode;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onOpen(report.tracking_code),
					style: { "--tint": CATEGORY_COLOR[report.category] },
					className: `tint-surface w-full rounded-xl p-4 text-left transition-transform hover:-translate-y-0.5 ${selected ? "ring-2 ring-[var(--tint)]" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-4 text-[var(--tint)]",
									strokeWidth: 2.2
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: report.tracking_code
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tint-chip rounded-full px-2 py-0.5 text-[10px] font-semibold",
								children: STATUSES.find((s) => s.id === report.status)?.label ?? report.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 flex items-start gap-1.5 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-clamp-2",
								children: report.address || wardName(report.ward_id)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-[11px] text-muted-foreground",
							children: new Date(report.created_at).toLocaleDateString("en-IN", {
								day: "2-digit",
								month: "short",
								year: "numeric"
							})
						})
					]
				}) }, report.id);
			})
		})]
	});
}
function TrackPage() {
	const { code } = Route$1.useSearch();
	const navigate = Route$1.useNavigate();
	const [value, setValue] = (0, import_react.useState)(code ?? "");
	const { data: reports = [], isLoading } = useReports();
	const { data: wards = [] } = useWards();
	const query = (code ?? "").trim().toUpperCase();
	const report = query ? reports.find((r) => r.tracking_code.toUpperCase() === query) : void 0;
	const ward = report ? wards.find((w) => w.id === report.ward_id) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Track a case",
		subtitle: "The loop closes here — every report keeps a public status trail.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentReports, {
					reports,
					wardName: (id) => wards.find((w) => w.id === id)?.name ?? id,
					activeCode: query,
					onOpen: (next) => {
						setValue(next);
						navigate({ search: { code: next.toUpperCase() } });
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 flex gap-2",
					onSubmit: (event) => {
						event.preventDefault();
						navigate({ search: { code: value.trim().toUpperCase() } });
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value,
						onChange: (event) => setValue(event.target.value),
						placeholder: "JS-4A7K21",
						className: "font-mono"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }), " Track"]
					})]
				}),
				query && !isLoading && !report && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm",
					children: [
						"No report found for ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: query
						}),
						". Check the code and try again."
					]
				}),
				report && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "sheet mt-6 space-y-4 rounded-md p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm text-primary",
								children: report.tracking_code
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-display text-xl font-semibold capitalize",
								children: [
									report.category,
									" · ",
									ward?.name ?? report.ward_id
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
								children: STATUSES.find((s) => s.id === report.status)?.label ?? report.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Your words (",
									LANGUAGE_LABELS[report.language] ?? report.language,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: report.original_text
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "As officials see it"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: report.translated_text
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-3 rounded-md border border-border/70 bg-surface-2/50 p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Urgency"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [report.urgency, "/5"] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Channel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "capitalize",
									children: report.channel
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Filed"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: new Date(report.created_at).toLocaleDateString() })] })
							]
						}),
						report.address && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border/70 bg-surface-2/50 p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Pinned location"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: report.address }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 font-mono text-xs text-muted-foreground",
									children: [
										report.lat.toFixed(5),
										", ",
										report.lng.toFixed(5)
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageGallery, { paths: report.image_paths }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, { report })
					]
				})
			]
		})
	});
}
//#endregion
export { TrackPage as component };
