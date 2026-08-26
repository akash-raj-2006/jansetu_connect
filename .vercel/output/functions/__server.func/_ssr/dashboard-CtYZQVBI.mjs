import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as supabase } from "./auth-attacher-CoQhurBi.mjs";
import { CATEGORIES, CATEGORY_COLOR, LANGUAGE_LABELS, STATUSES, buildHotspots, formatScore, isOpen, severityLabel } from "./jansetu-Wo0gHWAe.mjs";
import { n as cn, t as Button } from "./button-DAOZKppQ.mjs";
import { t as Textarea } from "./textarea-Dil9MIXY.mjs";
import { O as FileText, S as LoaderCircle, b as LogIn, o as TrendingUp } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-UKJJwD3x.mjs";
import { t as AppShell } from "./AppShell-CYXJOvDL.mjs";
import { t as ImageGallery } from "./ImageGallery-CCXp9BtX.mjs";
import { a as PriorityBars, i as Panel, n as HeatGrid, o as TrendArea, r as KpiCard, t as CategoryDonut } from "./charts-BBogfs3C.mjs";
import { t as Label } from "./label-DbtQc-0n.mjs";
import { n as useWards, t as useReports } from "./use-jansetu-data-DyLqof76.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useServerFn, t as generateBrief } from "./jansetu.functions-DixiE17k.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CtYZQVBI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
function DashboardPage() {
	const { data: wards = [] } = useWards();
	const { data: reports = [], refetch } = useReports();
	const runBrief = useServerFn(generateBrief);
	const [category, setCategory] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("open");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [brief, setBrief] = (0, import_react.useState)(null);
	const [briefLoading, setBriefLoading] = (0, import_react.useState)(false);
	const [budget, setBudget] = (0, import_react.useState)([40]);
	const [note, setNote] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
		const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setEmail(session?.user.email ?? null));
		return () => sub.subscription.unsubscribe();
	}, []);
	const countryWards = (0, import_react.useMemo)(() => wards.filter((w) => w.country === "IN"), [wards]);
	const wardIds = (0, import_react.useMemo)(() => new Set(countryWards.map((w) => w.id)), [countryWards]);
	const scopedReports = (0, import_react.useMemo)(() => reports.filter((report) => {
		if (!wardIds.has(report.ward_id)) return false;
		if (category !== "all" && report.category !== category) return false;
		if (status === "open" && !isOpen(report.status)) return false;
		if (status !== "all" && status !== "open" && report.status !== status) return false;
		return true;
	}), [
		reports,
		wardIds,
		category,
		status
	]);
	const hotspots = (0, import_react.useMemo)(() => buildHotspots(scopedReports, countryWards), [scopedReports, countryWards]);
	const activeHotspot = hotspots.find((h) => `${h.wardId}::${h.category}` === selected) ?? hotspots[0];
	const activeKey = activeHotspot ? `${activeHotspot.wardId}::${activeHotspot.category}` : null;
	const criticalCount = hotspots.filter((h) => h.priorityScore >= 7).length;
	const peopleReached = hotspots.reduce((sum, h) => sum + h.peopleAffected, 0);
	const voiceShare = scopedReports.length ? Math.round(scopedReports.filter((r) => r.channel === "voice" || r.channel === "whatsapp").length / scopedReports.length * 100) : 0;
	const rankingData = (0, import_react.useMemo)(() => hotspots.slice(0, 12).map((spot) => ({
		key: `${spot.wardId}::${spot.category}`,
		label: `${spot.ward.name.slice(0, 12)} · ${spot.category.slice(0, 5)}`,
		score: spot.priorityScore,
		category: spot.category
	})), [hotspots]);
	const categoryData = (0, import_react.useMemo)(() => CATEGORIES.map((item) => ({
		category: item.id,
		label: item.label,
		value: scopedReports.filter((report) => report.category === item.id).length
	})), [scopedReports]);
	const trendData = (0, import_react.useMemo)(() => {
		const weeks = 8;
		const now = Date.now();
		const buckets = Array.from({ length: weeks }, (_, index) => ({
			week: `W-${7 - index}`,
			reports: 0,
			cumulative: 0
		}));
		for (const report of scopedReports) {
			const bucket = buckets[7 - Math.floor((now - new Date(report.created_at).getTime()) / 6048e5)];
			if (bucket) bucket.reports += 1;
		}
		let running = 0;
		for (const bucket of buckets) {
			running += bucket.reports;
			bucket.cumulative = running;
		}
		return buckets;
	}, [scopedReports]);
	const heatValues = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const spot of hotspots) map.set(`${spot.wardId}::${spot.category}`, spot.priorityScore);
		return map;
	}, [hotspots]);
	const heatMax = (0, import_react.useMemo)(() => Math.max(1, ...hotspots.map((h) => h.priorityScore)), [hotspots]);
	const projectedScore = (0, import_react.useMemo)(() => {
		if (!activeHotspot) return 0;
		const spend = budget[0] ?? 0;
		const infraLift = Math.min(activeHotspot.ward.infra_score + spend / 12, 10);
		const weight = activeHotspot.avgUrgency;
		const resolvedShare = Math.min(spend / 100, .85);
		const volume = activeHotspot.volume * (1 - resolvedShare);
		return Math.round((volume * (weight / 2) + activeHotspot.peopleAffected / 1e3 / infraLift) * 10) / 10;
	}, [activeHotspot, budget]);
	async function onGenerateBrief() {
		if (!activeHotspot) return;
		setBriefLoading(true);
		try {
			const response = await runBrief({ data: {
				wardId: activeHotspot.wardId,
				category: activeHotspot.category
			} });
			if (!response.ok) {
				toast.error(response.error);
				return;
			}
			setBrief({
				key: `${activeHotspot.wardId}::${activeHotspot.category}`,
				text: response.brief
			});
		} catch (error) {
			console.error(error);
			toast.error("Could not generate the brief.");
		} finally {
			setBriefLoading(false);
		}
	}
	async function updateStatus(reportId, nextStatus) {
		const { error } = await supabase.from("reports").update({
			status: nextStatus,
			official_note: note.trim() || null
		}).eq("id", reportId);
		if (error) {
			toast.error("Sign in as an official to update status.");
			return;
		}
		toast.success("Status updated — the citizen sees this immediately.");
		setNote("");
		refetch();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Policy data",
		subtitle: "Citizen demand clustered into ward × category hotspots and ranked by priority score.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: category,
				onValueChange: setCategory,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "w-[150px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "all",
					children: "All categories"
				}), CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: item.id,
					children: item.label
				}, item.id))] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: status,
				onValueChange: setStatus,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "w-[150px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "open",
						children: "Open only"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "All statuses"
					}),
					STATUSES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: item.id,
						children: item.label
					}, item.id))
				] })]
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
							index: "01",
							label: "Citizen reports",
							value: String(scopedReports.length),
							hint: "in current filter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
							index: "02",
							label: "Demand hotspots",
							value: String(hotspots.length),
							hint: `${criticalCount} high or critical`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
							index: "03",
							label: "Residents affected",
							value: peopleReached.toLocaleString(),
							hint: "modelled from ward demographics"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
							index: "04",
							label: "Voice / WhatsApp share",
							value: `${voiceShare}%`,
							hint: "non-text channels"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid items-start gap-4 xl:grid-cols-[1.4fr_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Fig. 1 — Priority score ranking",
						hint: "click a bar to inspect the hotspot",
						className: "self-start",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBars, {
							data: rankingData,
							activeKey,
							onSelect: setSelected
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Fig. 2 — Reports by category",
							hint: `${scopedReports.length} reports`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryDonut, { data: categoryData })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Fig. 3 — Weekly report volume",
							hint: "last 8 weeks, cumulative dashed",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendArea, { data: trendData })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Fig. 4 — Ward × category priority matrix",
					hint: "numbers are priority scores; deeper ink = higher severity",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeatGrid, {
						wards: countryWards,
						categories: CATEGORIES,
						values: heatValues,
						max: heatMax,
						activeKey,
						onSelect: (key) => heatValues.has(key) && setSelected(key)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Table 1 — Ranked recommendations",
					hint: "priority = (volume × urgency weight) + (residents ÷ infra)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[720px] border-collapse text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
								"#",
								"Ward",
								"Category",
								"Score",
								"Severity",
								"Reports",
								"Urgency",
								"Residents",
								"Trend"
							].map((heading) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "label-mono border-b border-border px-2 py-2 text-left whitespace-nowrap",
								children: heading
							}, heading)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [hotspots.map((spot, index) => {
								const key = `${spot.wardId}::${spot.category}`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									onClick: () => setSelected(key),
									className: `cursor-pointer border-b border-border/70 transition-colors last:border-0 ${key === activeKey ? "bg-secondary" : "hover:bg-secondary/60"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "font-mono px-2 py-2 text-xs text-muted-foreground",
											children: String(index + 1).padStart(2, "0")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2 font-medium whitespace-nowrap",
											children: spot.ward.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1.5 text-xs capitalize",
												style: { color: CATEGORY_COLOR[spot.category] },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "size-2 rounded-sm",
													style: { backgroundColor: CATEGORY_COLOR[spot.category] }
												}), spot.category]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "font-mono px-2 py-2 font-semibold tabular-nums",
											children: formatScore(spot.priorityScore)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2 text-xs",
											children: severityLabel(spot.priorityScore)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "font-mono px-2 py-2 text-xs tabular-nums",
											children: spot.volume
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "font-mono px-2 py-2 text-xs tabular-nums",
											children: [spot.avgUrgency, "/5"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "font-mono px-2 py-2 text-xs tabular-nums",
											children: spot.peopleAffected.toLocaleString()
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2 text-xs whitespace-nowrap",
											children: spot.weeksToCritical !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 text-accent",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-3" }), spot.weeksToCritical === 0 ? "already critical" : `~${spot.weeksToCritical}w`]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "stable"
											})
										})
									]
								}, key);
							}), hotspots.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 9,
								className: "px-2 py-6 text-center text-sm text-muted-foreground",
								children: "No reports match these filters yet."
							}) })] })]
						})
					})
				}),
				activeHotspot && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid items-start gap-4 xl:grid-cols-[1.4fr_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: `Case file — ${activeHotspot.ward.name} · ${activeHotspot.category}`,
						hint: `${activeHotspot.ward.city} · pop ${activeHotspot.ward.population.toLocaleString()} · infra ${activeHotspot.ward.infra_score}/10`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
									children: [
										{
											label: "Score",
											value: formatScore(activeHotspot.priorityScore)
										},
										{
											label: "Reports",
											value: String(activeHotspot.volume)
										},
										{
											label: "Urgency",
											value: `${activeHotspot.avgUrgency}/5`
										},
										{
											label: "Open",
											value: String(activeHotspot.openCount)
										}
									].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md border border-border bg-surface-2/50 p-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "label-mono",
											children: item.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display mt-0.5 text-lg font-semibold tabular-nums",
											children: item.value
										})]
									}, item.label))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: onGenerateBrief,
									disabled: briefLoading,
									className: "w-full sm:w-auto",
									children: [briefLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), briefLoading ? "Writing brief…" : "Generate policy brief"]
								}),
								brief?.key === activeKey && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-border border-l-2 border-l-accent bg-surface-2/40 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "label-mono mb-2 text-accent",
										children: "AI policy brief"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2 text-sm leading-relaxed whitespace-pre-wrap",
										children: brief.text
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "label-mono",
									children: "Citizen reports in this cluster"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 space-y-2",
									children: activeHotspot.reports.map((report) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "rounded-md border border-border bg-surface-2/40 p-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium text-foreground",
													children: report.tracking_code
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono",
													children: [
														LANGUAGE_LABELS[report.language] ?? report.language,
														" · ",
														report.channel,
														" · urgency",
														" ",
														report.urgency,
														"/5 · ",
														report.sentiment
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1.5 text-sm",
												children: report.translated_text
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-muted-foreground italic",
												children: report.original_text
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageGallery, {
												paths: report.image_paths,
												className: "mt-2"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 flex flex-wrap items-center gap-2",
												children: STATUSES.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: report.status === option.id ? "default" : "secondary",
													disabled: !email,
													onClick: () => void updateStatus(report.id, option.id),
													children: option.label
												}, option.id))
											})
										]
									}, report.id))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2 rounded-md border border-border p-3",
									children: email ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "note",
											children: "Official note sent to citizens (optional)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "note",
											rows: 2,
											value: note,
											onChange: (event) => setNote(event.target.value),
											placeholder: "Tanker deployed today; pipeline repair scheduled Friday."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: ["Signed in as ", email]
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/admin/login",
												className: "font-medium text-accent hover:underline",
												children: "Sign in as an official"
											}),
											"to acknowledge, progress or resolve reports."
										]
									})
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Fig. 5 — Budget allocation impact",
							hint: "model spend before committing it",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "label-mono",
												children: "Allocation"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono font-semibold",
												children: [
													"₹",
													budget[0],
													" lakh"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											value: budget,
											onValueChange: setBudget,
											min: 0,
											max: 200,
											step: 5
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md border border-border bg-surface-2/50 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "label-mono",
												children: "Score now"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-display mt-1 text-2xl font-semibold tabular-nums",
												children: formatScore(activeHotspot.priorityScore)
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md border border-accent/50 bg-accent/10 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "label-mono",
												children: "Projected"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-display mt-1 text-2xl font-semibold text-accent tabular-nums",
												children: formatScore(projectedScore)
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-2 w-full overflow-hidden rounded-sm bg-surface-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-accent transition-all",
											style: { width: `${Math.min(100, Math.max(0, (activeHotspot.priorityScore - projectedScore) / Math.max(activeHotspot.priorityScore, .1) * 100))}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: projectedScore < activeHotspot.priorityScore ? `Reduces severity by ${Math.round((activeHotspot.priorityScore - projectedScore) / activeHotspot.priorityScore * 100)}% and lifts ward infra readiness.` : "Increase the allocation to see a measurable severity reduction."
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							title: "Legend & interoperability",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-3 text-xs text-muted-foreground",
								children: CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-2.5 rounded-sm",
										style: { backgroundColor: CATEGORY_COLOR[item.id] }
									}), item.label]
								}, item.id))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs leading-relaxed text-muted-foreground",
								children: "The same engine runs across every Indian ward dataset loaded into JanSetu — one dashboard, one methodology, an open API-ready schema."
							})]
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { DashboardPage as component };
