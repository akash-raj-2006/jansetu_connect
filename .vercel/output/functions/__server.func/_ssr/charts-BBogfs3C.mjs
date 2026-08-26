import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { CATEGORY_COLOR } from "./jansetu-Wo0gHWAe.mjs";
import { a as XAxis, c as Pie, d as Tooltip, f as Legend, i as YAxis, l as Cell, n as PieChart, o as Area, r as BarChart, s as Bar, t as AreaChart, u as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/charts-BBogfs3C.js
var import_jsx_runtime = require_jsx_runtime();
var AXIS = {
	stroke: "var(--muted-foreground)",
	fontSize: 11,
	fontFamily: "var(--font-mono)"
};
var tooltipStyle = {
	contentStyle: {
		background: "var(--surface)",
		border: "1px solid var(--border-strong)",
		borderRadius: 4,
		fontSize: 12,
		fontFamily: "var(--font-sans)",
		color: "var(--foreground)"
	},
	labelStyle: {
		fontFamily: "var(--font-mono)",
		fontSize: 11,
		color: "var(--muted-foreground)"
	}
};
function Panel({ title, hint, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `sheet-ruled rounded-md p-4 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-3 flex flex-wrap items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-sm font-semibold tracking-tight",
				children: title
			}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: hint
			})]
		}), children]
	});
}
/** Fig. 1 — horizontal ranking of hotspot priority scores. */
function PriorityBars({ data, onSelect, activeKey, rowHeight = 34 }) {
	if (data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: Math.max(220, data.length * rowHeight + 30),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
			data,
			layout: "vertical",
			margin: {
				left: 4,
				right: 24,
				top: 4,
				bottom: 4
			},
			barCategoryGap: "22%",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					type: "number",
					...AXIS,
					tickLine: false,
					axisLine: { stroke: "var(--border)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					type: "category",
					dataKey: "label",
					width: 168,
					...AXIS,
					tickLine: false,
					axisLine: { stroke: "var(--border)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
					...tooltipStyle,
					formatter: (value) => [value, "priority score"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: "score",
					radius: [
						0,
						2,
						2,
						0
					],
					onClick: (entry) => entry?.key && onSelect?.(entry.key),
					cursor: onSelect ? "pointer" : void 0,
					children: data.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						fill: CATEGORY_COLOR[row.category],
						opacity: !activeKey || activeKey === row.key ? 1 : .35
					}, row.key))
				})
			]
		})
	});
}
/** Fig. 2 — share of reports by infrastructure category. */
function CategoryDonut({ data }) {
	const rows = data.filter((row) => row.value > 0);
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: 240,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
				data: rows,
				dataKey: "value",
				nameKey: "label",
				innerRadius: 55,
				outerRadius: 85,
				paddingAngle: 2,
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
					fill: CATEGORY_COLOR[row.category],
					stroke: "var(--surface)"
				}, row.category))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
				verticalAlign: "bottom",
				iconType: "square",
				formatter: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
				...tooltipStyle,
				formatter: (value) => [`${value} reports`, ""]
			})
		] })
	});
}
/** Fig. 3 — weekly report volume with cumulative load. */
function TrendArea({ data }) {
	if (data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: 240,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
			data,
			margin: {
				left: -16,
				right: 8,
				top: 8,
				bottom: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "jsFill",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "var(--accent)",
						stopOpacity: .35
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "var(--accent)",
						stopOpacity: .02
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "week",
					...AXIS,
					tickLine: false,
					axisLine: { stroke: "var(--border)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					...AXIS,
					tickLine: false,
					axisLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...tooltipStyle }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "cumulative",
					stroke: "var(--border-strong)",
					strokeDasharray: "4 4",
					fill: "none",
					name: "cumulative"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "reports",
					stroke: "var(--accent)",
					strokeWidth: 2,
					fill: "url(#jsFill)",
					name: "reports"
				})
			]
		})
	});
}
/** Fig. 4 — numeric ward × category matrix (replaces the old 3D map). */
function HeatGrid({ wards, categories, values, max, onSelect, activeKey }) {
	if (wards.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[560px] border-collapse text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "label-mono border-b border-border px-2 py-2 text-left",
					children: "Ward"
				}),
				categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "label-mono border-b border-border px-2 py-2 text-center",
					children: category.label
				}, category.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "label-mono border-b border-border px-2 py-2 text-right",
					children: "Total"
				})
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: wards.map((ward) => {
				const total = categories.reduce((sum, category) => sum + (values.get(`${ward.id}::${category.id}`) ?? 0), 0);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/70 last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "row",
							className: "px-2 py-1.5 text-left text-sm font-medium whitespace-nowrap",
							children: ward.name
						}),
						categories.map((category) => {
							const key = `${ward.id}::${category.id}`;
							const value = values.get(key) ?? 0;
							const intensity = max > 0 ? value / max : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-0.5 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: value === 0,
									onClick: () => onSelect?.(key),
									className: `font-mono w-full rounded-sm px-2 py-1.5 text-xs transition-all disabled:cursor-default ${activeKey === key ? "ring-2 ring-foreground" : ""}`,
									style: {
										backgroundColor: value === 0 ? "transparent" : `color-mix(in oklab, ${CATEGORY_COLOR[category.id]} ${Math.round(12 + intensity * 78)}%, var(--surface))`,
										color: value === 0 ? "var(--muted-foreground)" : intensity > .45 ? "var(--primary-foreground)" : "var(--foreground)"
									},
									children: value === 0 ? "·" : value.toFixed(1)
								})
							}, category.id);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "font-mono px-2 py-1.5 text-right text-xs font-semibold",
							children: total.toFixed(1)
						})
					]
				}, ward.id);
			}) })]
		})
	});
}
function KpiCard({ label, value, hint, index }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sheet rounded-md p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-mono",
					children: label
				}), index && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] text-muted-foreground",
					children: index
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display mt-2 text-3xl font-semibold tracking-tight tabular-nums",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function Empty() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid-lines flex h-40 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground",
		children: "No data in this selection yet."
	});
}
//#endregion
export { PriorityBars as a, Panel as i, HeatGrid as n, TrendArea as o, KpiCard as r, CategoryDonut as t };
