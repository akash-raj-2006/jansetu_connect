import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { CATEGORIES, CATEGORY_COLOR, URGENCY_WEIGHT, buildHotspots, priorityScore, severityLabel } from "./jansetu-Wo0gHWAe.mjs";
import { C as Lightbulb, D as Headphones, E as House, G as Calculator, I as CircleCheck, K as Building2, M as Droplets, U as ChartColumn, _ as Mic, f as Search, h as RotateCcw, j as Ellipsis, k as FileSearch, m as Route, q as ArrowRight, r as Users, s as Trash2, t as Zap, u as ShieldCheck, w as Languages, y as MapPin } from "../_libs/lucide-react.mjs";
import { n as Logo, r as ThemeToggle, t as AmbientBackdrop } from "./Logo-CTm99nS3.mjs";
import { n as useWards, t as useReports } from "./use-jansetu-data-DyLqof76.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B71HrtCY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var URGENCY_LABEL = {
	1: "Minor",
	2: "Low",
	3: "Moderate",
	4: "High",
	5: "Critical"
};
var DEFAULTS = {
	volume: 6,
	urgency: 4,
	population: 42e3,
	infra: 5.4
};
function Slider({ label, value, min, max, step, hint, tint, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		style: { ["--tint"]: tint },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-mono",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-sm font-semibold tabular-nums text-[var(--tint)]",
				children: hint
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (event) => onChange(Number(event.target.value)),
			className: "mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-[var(--tint)]"
		})]
	});
}
/**
* Interactive walk-through of the Priority Score formula so citizens and
* officials can see exactly how a ward earns its ranking.
*/
function PriorityExplainer() {
	const [volume, setVolume] = (0, import_react.useState)(DEFAULTS.volume);
	const [urgency, setUrgency] = (0, import_react.useState)(DEFAULTS.urgency);
	const [population, setPopulation] = (0, import_react.useState)(DEFAULTS.population);
	const [infra, setInfra] = (0, import_react.useState)(DEFAULTS.infra);
	const weight = URGENCY_WEIGHT[urgency] ?? 1;
	const demandTerm = Math.round(volume * weight * 10) / 10;
	const strainTerm = Math.round(population / 1e3 / infra * 10) / 10;
	const score = priorityScore({
		volume,
		avgUrgency: urgency,
		peopleAffected: population,
		infraScore: infra
	});
	const demandShare = Math.round(demandTerm / Math.max(demandTerm + strainTerm, .1) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "sheet-ruled overflow-hidden rounded-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3 border-b border-border px-5 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "label-mono flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "size-3.5" }), " Priority Score — try it yourself"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Move the sliders to see how a ward climbs the queue."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					setVolume(DEFAULTS.volume);
					setUrgency(DEFAULTS.urgency);
					setPopulation(DEFAULTS.population);
					setInfra(DEFAULTS.infra);
				},
				className: "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), " Reset example"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 p-5 lg:grid-cols-[1fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Reports from this ward",
						value: volume,
						min: 1,
						max: 40,
						step: 1,
						hint: `${volume} reports`,
						tint: "var(--nav-report)",
						onChange: setVolume
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Average urgency",
						value: urgency,
						min: 1,
						max: 5,
						step: 1,
						hint: `${URGENCY_LABEL[urgency]} · weight ${weight}`,
						tint: "var(--cat-roads)",
						onChange: setUrgency
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Residents affected",
						value: population,
						min: 2e3,
						max: 2e5,
						step: 1e3,
						hint: population.toLocaleString("en-IN"),
						tint: "var(--cat-water)",
						onChange: setPopulation
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Infrastructure score (10 = strong)",
						value: infra,
						min: 1,
						max: 10,
						step: .1,
						hint: `${infra.toFixed(1)} / 10`,
						tint: "var(--nav-track)",
						onChange: setInfra
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tint-surface rounded-xl p-4",
						style: { ["--tint"]: "var(--nav-data)" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-mono text-[var(--tint)]",
								children: "Priority score"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-5xl font-semibold tabular-nums text-[var(--tint)]",
								children: score.toFixed(1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm font-medium",
								children: [severityLabel(score), " priority"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sheet rounded-xl p-4 font-mono text-xs leading-relaxed",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "score = (reports × urgency weight) + (residents ÷ 1000 ÷ infra)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2",
								children: [
									"= (",
									volume,
									" × ",
									weight,
									") + (",
									population.toLocaleString("en-IN"),
									" ÷ 1000 ÷ ",
									infra.toFixed(1),
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"= ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: { color: "var(--nav-report)" },
									children: demandTerm
								}),
								" +",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: { color: "var(--cat-water)" },
									children: strainTerm
								}),
								" =",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold",
									children: score.toFixed(1)
								})
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sheet rounded-xl p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-mono",
								children: "What is driving the score"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex h-3 overflow-hidden rounded-full bg-surface-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
									width: `${demandShare}%`,
									background: "var(--nav-report)"
								} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
									width: `${100 - demandShare}%`,
									background: "var(--cat-water)"
								} })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									style: { color: "var(--nav-report)" },
									children: [
										"Citizen demand ",
										demandShare,
										"%"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									style: { color: "var(--cat-water)" },
									children: [
										"Infrastructure strain ",
										100 - demandShare,
										"%"
									]
								})]
							})
						]
					})
				]
			})]
		})]
	});
}
var NAV = [
	{
		to: "/",
		label: "Home",
		icon: House,
		tint: "var(--nav-overview)",
		exact: true
	},
	{
		to: "/report",
		label: "Report a Problem",
		icon: Mic,
		tint: "var(--nav-report)",
		exact: false
	},
	{
		to: "/track",
		label: "Track My Case",
		icon: FileSearch,
		tint: "var(--nav-track)",
		exact: false
	},
	{
		to: "/dashboard",
		label: "Civic Data",
		icon: ChartColumn,
		tint: "var(--nav-data)",
		exact: false
	}
];
var REPORT_TILES = [
	{
		label: "Road / Pothole",
		icon: Route,
		tint: "var(--cat-roads)"
	},
	{
		label: "Streetlight",
		icon: Lightbulb,
		tint: "var(--cat-electricity)"
	},
	{
		label: "Water Supply",
		icon: Droplets,
		tint: "var(--cat-water)"
	},
	{
		label: "Garbage",
		icon: Trash2,
		tint: "var(--success)"
	},
	{
		label: "Sanitation",
		icon: Building2,
		tint: "var(--cat-sanitation)"
	},
	{
		label: "Electricity",
		icon: Zap,
		tint: "var(--warning)"
	},
	{
		label: "Other Issues",
		icon: Ellipsis,
		tint: "var(--cat-other)"
	}
];
var HERO_POINTS = [
	{
		icon: Languages,
		tint: "var(--nav-overview)",
		title: "Any Indian Language",
		body: "हिंदी, मराठी, বাংলা, தமிழ் and more"
	},
	{
		icon: MapPin,
		tint: "var(--nav-report)",
		title: "Exact Location",
		body: "Pin it on the map for faster resolution"
	},
	{
		icon: ShieldCheck,
		tint: "var(--nav-track)",
		title: "Track & Stay Updated",
		body: "A public tracking code at every step"
	}
];
var STEPS = [
	{
		n: "1",
		icon: Mic,
		tint: "var(--nav-report)",
		title: "Report",
		body: "Tell us what's wrong, in your own words."
	},
	{
		n: "2",
		icon: ShieldCheck,
		tint: "var(--warning)",
		title: "Verify",
		body: "AI checks the issue, category and location."
	},
	{
		n: "3",
		icon: Users,
		tint: "var(--nav-overview)",
		title: "Assign",
		body: "The responsible department is notified."
	},
	{
		n: "4",
		icon: CircleCheck,
		tint: "var(--success)",
		title: "Resolve",
		body: "Action is taken and you are updated."
	}
];
var TRUST = [
	{
		icon: ShieldCheck,
		title: "Your data is secure"
	},
	{
		icon: MapPin,
		title: "Location used only for your report"
	},
	{
		icon: FileSearch,
		title: "Every complaint gets a tracking ID"
	},
	{
		icon: ChartColumn,
		title: "Public accountability through open data"
	},
	{
		icon: Users,
		title: "Accessible for all citizens"
	}
];
var PROGRESS = [
	"Reported",
	"Verified",
	"Assigned",
	"In Progress",
	"Resolved"
];
function Landing() {
	const navigate = useNavigate();
	const { data: reports = [] } = useReports();
	const { data: wards = [] } = useWards();
	const [code, setCode] = (0, import_react.useState)("");
	const resolved = reports.filter((r) => r.status === "resolved").length;
	const rate = reports.length ? Math.round(resolved / reports.length * 100) : 0;
	const languageCount = new Set(reports.map((r) => r.language)).size;
	const mix = (0, import_react.useMemo)(() => {
		const total = reports.length || 1;
		return CATEGORIES.map((item) => {
			const count = reports.filter((r) => r.category === item.id).length;
			return {
				...item,
				count,
				share: Math.round(count / total * 100)
			};
		}).sort((a, b) => b.count - a.count);
	}, [reports]);
	const hotspots = (0, import_react.useMemo)(() => buildHotspots(reports, wards).slice(0, 3), [reports, wards]);
	const pulse = [
		{
			label: "Issues Reported",
			value: String(reports.length),
			tint: "var(--success)"
		},
		{
			label: "Issues Resolved",
			value: String(resolved),
			tint: "var(--cat-water)"
		},
		{
			label: "Resolution Rate",
			value: `${rate}%`,
			tint: "var(--cat-sanitation)"
		},
		{
			label: "Languages Heard",
			value: String(languageCount),
			tint: "var(--warning)"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen bg-transparent",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmbientBackdrop, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border bg-surface-2/80 px-4 py-1.5 text-[11px] backdrop-blur sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-mono",
						children: "भारत · Digital Public Good for India"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/login",
							className: "font-semibold text-accent hover:underline",
							children: "Official sign-in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, { className: "!py-1 !text-[10px]" })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border-strong bg-background/95 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-11" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "-mx-1 flex flex-1 items-center gap-1 overflow-x-auto px-1",
						children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							activeOptions: { exact: item.exact },
							style: { "--tint": item.tint },
							className: "flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--tint)_12%,transparent)] hover:text-[var(--tint)]",
							activeProps: { className: "text-[var(--tint)] font-semibold border-b-2 border-[var(--tint)] rounded-b-none" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
								className: "size-4",
								strokeWidth: 2.2
							}), item.label]
						}, item.to))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "sheet-ruled grid items-center gap-8 overflow-hidden rounded-2xl px-5 py-8 sm:px-8 lg:grid-cols-[1fr_minmax(18rem,0.85fr)] lg:gap-12 lg:py-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 order-2 lg:order-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-mono",
									children: "Citizen voice in · ranked civic action out"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "mt-2 text-[clamp(1.75rem,5.5vw,3rem)] leading-[1.15]",
									children: [
										"आपका शहर, आपकी आवाज़",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"हमारा संकल्प, ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-accent",
											children: "बेहतर समाधान"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base",
									children: "Report civic problems in your language, pin the exact location, and track action in real time."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-wrap gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/report",
										style: { "--tint": "var(--nav-report)" },
										className: "inline-flex items-center gap-3 rounded-xl bg-[var(--tint)] px-5 py-3 text-left text-primary-foreground transition-transform hover:-translate-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-sm font-semibold",
											children: "Report a Problem"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[11px] opacity-90",
											children: "Speak, don't fill forms"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/track",
										className: "sheet inline-flex items-center gap-3 rounded-xl px-5 py-3 text-left transition-transform hover:-translate-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSearch, { className: "size-5 shrink-0 text-[var(--nav-track)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-sm font-semibold",
											children: "Track My Complaint"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[11px] text-muted-foreground",
											children: "Enter your tracking code"
										})] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-7 grid gap-3 border-t border-border pt-5 sm:grid-cols-3",
									children: HERO_POINTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-w-0 items-start gap-2",
										style: { "--tint": item.tint },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tint-chip mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
												className: "size-3.5",
												strokeWidth: 2.4
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-xs font-semibold",
												children: item.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[11px] leading-snug text-muted-foreground",
												children: item.body
											})]
										})]
									}, item.title))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "order-1 flex flex-col items-center text-center lg:order-2 lg:items-end lg:text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-32 w-auto max-w-full object-contain sm:h-44 md:h-52 lg:h-56 xl:h-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-mono mt-3 text-[13px] tracking-[0.18em] sm:text-sm",
								children: "your voice · our action · better india"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "sheet rounded-2xl p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg",
							children: "What would you like to report?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7",
							children: REPORT_TILES.map((tile) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/report",
								style: { "--tint": tile.tint },
								className: "tint-surface flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-center text-xs font-semibold transition-transform hover:-translate-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tile.icon, {
									className: "size-6 text-[var(--tint)]",
									strokeWidth: 2.2
								}), tile.label]
							}, tile.label))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "tint-surface flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5",
						style: { "--tint": "var(--nav-report)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tint-chip flex size-10 items-center justify-center rounded-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
									className: "size-5",
									strokeWidth: 2.2
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: "Where is the problem?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Use your location or pin it on the map"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/report",
								className: "sheet inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }), " Use My Location"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/report",
								className: "sheet inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }), " Pin on Map"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-4 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sheet rounded-2xl p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-end justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg",
										children: "Civic Pulse"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Real-time updates from Indian cities"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/dashboard",
										className: "text-sm font-semibold text-accent hover:underline",
										children: "View All Data"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
									children: pulse.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "tint-surface rounded-xl p-3",
										style: { "--tint": item.tint },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-2xl font-semibold tabular-nums text-[var(--tint)]",
											children: item.value
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] leading-snug text-muted-foreground",
											children: item.label
										})]
									}, item.label))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-mono mt-5",
									children: "Most reported problems"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-2.5",
									children: mix.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										style: { "--tint": CATEGORY_COLOR[item.id] },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-[var(--tint)]",
												children: item.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono tabular-nums text-muted-foreground",
												children: [
													item.count,
													" · ",
													item.share,
													"%"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 h-2 overflow-hidden rounded-full bg-surface-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "tint-bar h-full rounded-full",
												style: { width: `${item.share}%` }
											})
										})]
									}, item.id))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tint-surface rounded-2xl p-5",
							style: { "--tint": "var(--nav-track)" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg",
									children: "Track Your Complaint"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Enter your tracking code to see real-time status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									className: "mt-4 flex flex-wrap gap-2",
									onSubmit: (event) => {
										event.preventDefault();
										const value = code.trim().toUpperCase();
										navigate({
											to: "/track",
											search: value ? { code: value } : {}
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: code,
										onChange: (event) => setCode(event.target.value),
										placeholder: "Enter tracking code (e.g. JS-4821)",
										"aria-label": "Tracking code",
										className: "min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-[var(--tint)]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										className: "inline-flex items-center gap-2 rounded-lg bg-[var(--tint)] px-4 py-2.5 text-sm font-semibold text-primary-foreground",
										children: ["Track Status ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-mono mt-6",
									children: "Complaint progress"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "mt-3 space-y-2",
									children: PROGRESS.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-3 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--tint)_18%,transparent)] font-mono text-[10px] text-[var(--tint)]",
												children: index + 1
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: step
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
										]
									}, step))
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "sheet rounded-2xl p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg",
								children: "Issues in your city"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Highest-priority open clusters right now"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/dashboard",
								className: "text-sm font-semibold text-accent hover:underline",
								children: ["View on data desk ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "inline size-3.5" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 grid gap-3 md:grid-cols-3",
							children: [hotspots.map((spot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "tint-surface rounded-xl p-4",
								style: { "--tint": CATEGORY_COLOR[spot.category] },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "label-mono text-[var(--tint)]",
											children: spot.category
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tint-chip rounded-full px-2 py-0.5 text-[10px] font-semibold",
											children: severityLabel(spot.priorityScore)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-sm font-semibold",
										children: [
											spot.ward.name,
											", ",
											spot.ward.city
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											spot.volume,
											" reports · ",
											spot.openCount,
											" open · score ",
											spot.priorityScore.toFixed(1)
										]
									})
								]
							}, `${spot.wardId}-${spot.category}`)), hotspots.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted-foreground",
								children: "No reports yet — be the first to file one."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityExplainer, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "sheet rounded-2xl p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg",
								children: "How JanSetu Works"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "A simple 4-step process"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
							children: STEPS.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tint-surface flex items-start gap-3 rounded-xl p-4",
								style: { "--tint": step.tint },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tint-chip flex size-9 shrink-0 items-center justify-center rounded-lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(step.icon, {
										className: "size-4",
										strokeWidth: 2.2
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-semibold",
									children: [
										step.n,
										". ",
										step.title
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-snug text-muted-foreground",
									children: step.body
								})] })]
							}, step.n))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-4 lg:grid-cols-[2.2fr_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sheet rounded-2xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: "Built for citizens. Accountable to citizens."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
								children: TRUST.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
										className: "size-4 shrink-0 text-[var(--nav-track)]",
										strokeWidth: 2.2
									}), item.title]
								}, item.title))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tint-surface rounded-2xl p-5",
							style: { "--tint": "var(--warning)" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, {
									className: "size-5 text-[var(--tint)]",
									strokeWidth: 2.2
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm font-semibold",
									children: "Need help?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Every report also reaches the ward helpdesk. Officials respond through the tracking code."
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "mt-6 border-t border-border-strong bg-sidebar px-4 py-8 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-7xl gap-6 md:grid-cols-[1.4fr_1fr_1fr]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-12" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-xs text-xs text-muted-foreground",
							children: "A digital public good to make citizen voice visible and civic action accountable."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-mono",
							children: "Quick links"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-2 space-y-1.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/report",
									className: "hover:text-accent",
									children: "Report a problem"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/track",
									className: "hover:text-accent",
									children: "Track my case"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard",
									className: "hover:text-accent",
									children: "Civic data"
								}) })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-mono",
							children: "For officials"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1.5 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/login",
								className: "hover:text-accent",
								children: "Official sign-in"
							}) })
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-6 max-w-7xl text-[11px] text-muted-foreground",
					children: "© 2026 JanSetu · Made in India · your voice, our action, better India."
				})]
			})
		]
	});
}
//#endregion
export { Landing as component };
