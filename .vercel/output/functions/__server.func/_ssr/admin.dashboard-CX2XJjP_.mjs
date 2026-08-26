import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as supabase } from "./auth-attacher-CoQhurBi.mjs";
import { CATEGORIES, CATEGORY_COLOR, LANGUAGE_LABELS, STATUSES, isOpen } from "./jansetu-Wo0gHWAe.mjs";
import { t as Button } from "./button-DAOZKppQ.mjs";
import { t as Input } from "./input-COtCr2HY.mjs";
import { t as Textarea } from "./textarea-Dil9MIXY.mjs";
import { F as ClipboardList, S as LoaderCircle, b as LogIn, f as Search, p as Save, y as MapPin } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-UKJJwD3x.mjs";
import { t as Route } from "./admin.dashboard-DO34Li7S.mjs";
import { t as AppShell } from "./AppShell-CYXJOvDL.mjs";
import { t as ImageGallery } from "./ImageGallery-CCXp9BtX.mjs";
import { i as Panel, r as KpiCard } from "./charts-BBogfs3C.mjs";
import { t as Label } from "./label-DbtQc-0n.mjs";
import { n as useWards, t as useReports } from "./use-jansetu-data-DyLqof76.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard-CX2XJjP_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { data: wards = [] } = useWards();
	const { data: reports = [], refetch, isLoading } = useReports();
	const [email, setEmail] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("all");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [ward, setWard] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const [draftStatus, setDraftStatus] = (0, import_react.useState)("submitted");
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			const e = data.session?.user.email;
			if (e) setEmail(e);
			else if (typeof window !== "undefined") setEmail(localStorage.getItem("jansetu_official"));
		});
		const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setEmail(session?.user.email ?? (typeof window !== "undefined" ? localStorage.getItem("jansetu_official") : null)));
		return () => sub.subscription.unsubscribe();
	}, []);
	const { adminRole } = Route.useRouteContext();
	const navigate = useNavigate();
	async function signOut() {
		if (typeof window !== "undefined") localStorage.removeItem("jansetu_official");
		await supabase.auth.signOut();
		navigate({ to: "/admin/login" });
	}
	const wardName = (0, import_react.useMemo)(() => new Map(wards.map((w) => [w.id, w.name])), [wards]);
	const rows = (0, import_react.useMemo)(() => {
		const term = query.trim().toLowerCase();
		return reports.filter((report) => {
			if (wards.length && !wardName.has(report.ward_id)) return false;
			if (status === "open" && !isOpen(report.status)) return false;
			if (status !== "all" && status !== "open" && report.status !== status) return false;
			if (category !== "all" && report.category !== category) return false;
			if (ward !== "all" && report.ward_id !== ward) return false;
			if (term && ![
				report.tracking_code,
				report.translated_text,
				report.address,
				wardName.get(report.ward_id) ?? ""
			].join(" ").toLowerCase().includes(term)) return false;
			return true;
		});
	}, [
		reports,
		status,
		category,
		ward,
		query,
		wardName,
		wards.length
	]);
	const active = rows.find((r) => r.id === openId) ?? null;
	function openRow(report) {
		setOpenId(report.id);
		setDraftStatus(report.status);
		setNote(report.official_note ?? "");
	}
	async function save() {
		if (!active) return;
		setSaving(true);
		const { error } = await supabase.from("reports").update({
			status: draftStatus,
			official_note: note.trim() || null
		}).eq("id", active.id);
		setSaving(false);
		if (error) {
			toast.error("Update failed — sign in as an official first.");
			return;
		}
		toast.success(`${active.tracking_code} updated — the citizen sees it immediately.`);
		refetch();
	}
	const counts = STATUSES.map((s) => ({
		...s,
		value: reports.filter((r) => r.status === s.id).length
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Admin panel",
		subtitle: "Triage every citizen report, move it through the workflow and publish the note citizens see.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono rounded-md border border-border px-2 py-1",
					children: adminRole.replace("_", " ")
				}),
				email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono rounded-md border border-border px-2 py-1",
					children: email
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => void signOut(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-3.5" }), " Sign out"]
				})
			]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
					children: counts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: item.label,
						value: String(item.value),
						hint: "reports"
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Report queue",
					hint: `${rows.length} of ${reports.length} reports`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative min-w-[200px] flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: query,
										onChange: (event) => setQuery(event.target.value),
										placeholder: "Search code, address or text",
										className: "pl-9"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: status,
									onValueChange: setStatus,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[150px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "All statuses"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "open",
											children: "Open only"
										}),
										STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: s.id,
											children: s.label
										}, s.id))
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: category,
									onValueChange: setCategory,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[150px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All categories"
									}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c.id,
										children: c.label
									}, c.id))] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: ward,
									onValueChange: setWard,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[170px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All wards"
									}), wards.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: w.id,
										children: w.name
									}, w.id))] })]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-[720px] text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
									className: "border-b border-border-strong text-left",
									children: [
										"Code",
										"Ward",
										"Category",
										"Urgency",
										"Status",
										"Filed",
										""
									].map((head) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "label-mono px-2 py-2",
										children: head
									}, head))
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map((report) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: `border-b border-border/70 last:border-0 ${report.id === openId ? "bg-secondary" : "hover:bg-secondary/60"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2 font-mono text-xs font-medium",
											children: report.tracking_code
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2 whitespace-nowrap",
											children: wardName.get(report.ward_id) ?? report.ward_id
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1.5 text-xs capitalize",
												style: { color: CATEGORY_COLOR[report.category] },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "size-2 rounded-sm",
													style: { backgroundColor: CATEGORY_COLOR[report.category] }
												}), report.category]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-2 py-2 font-mono text-xs tabular-nums",
											children: [report.urgency, "/5"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2 text-xs capitalize",
											children: report.status.replace("_", " ")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2 font-mono text-xs text-muted-foreground",
											children: new Date(report.created_at).toLocaleDateString("en-IN")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "secondary",
												onClick: () => openRow(report),
												children: "Manage"
											})
										})
									]
								}, report.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 7,
									className: "px-2 py-6 text-center text-sm text-muted-foreground",
									children: isLoading ? "Loading reports…" : "No reports match these filters."
								}) })] })]
							})
						})]
					})
				}),
				active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: `Manage ${active.tracking_code}`,
					hint: `${wardName.get(active.ward_id) ?? active.ward_id} · ${active.category} · urgency ${active.urgency}/5`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid items-start gap-4 lg:grid-cols-[1.2fr_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-start gap-2 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [active.address || "No address captured", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block font-mono text-xs",
										children: [
											active.lat.toFixed(5),
											", ",
											active.lng.toFixed(5)
										]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: active.translated_text }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground italic",
									children: active.original_text
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "label-mono",
									children: [
										LANGUAGE_LABELS[active.language] ?? active.language,
										" · ",
										active.channel,
										" · ",
										active.sentiment
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageGallery, { paths: active.image_paths })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 rounded-xl border border-border-strong bg-surface-2/50 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: STATUSES.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: draftStatus === option.id ? "default" : "secondary",
											onClick: () => setDraftStatus(option.id),
											children: option.label
										}, option.id))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "admin-note",
										children: "Note shown to the citizen"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "admin-note",
										rows: 3,
										value: note,
										onChange: (event) => setNote(event.target.value),
										placeholder: "Tanker deployed today; pipeline repair scheduled Friday."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => void save(),
									disabled: !email || saving,
									className: "w-full",
									children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), saving ? "Saving…" : "Save update"]
								}),
								!email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Sign in as an official to save changes."
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-3.5" }), " Status changes are published instantly to the citizen's tracking page."]
				})
			]
		})
	});
}
//#endregion
export { AdminPage as component };
