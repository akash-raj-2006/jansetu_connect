//#region node_modules/.nitro/vite/services/ssr/assets/jansetu-Wo0gHWAe.js
var CATEGORIES = [
	{
		id: "water",
		label: "Water"
	},
	{
		id: "roads",
		label: "Roads"
	},
	{
		id: "electricity",
		label: "Electricity"
	},
	{
		id: "sanitation",
		label: "Sanitation"
	},
	{
		id: "other",
		label: "Other"
	}
];
var STATUSES = [
	{
		id: "submitted",
		label: "Submitted"
	},
	{
		id: "acknowledged",
		label: "Acknowledged"
	},
	{
		id: "in_progress",
		label: "In progress"
	},
	{
		id: "resolved",
		label: "Resolved"
	}
];
var LANGUAGES = [
	{
		id: "auto",
		label: "Detect automatically"
	},
	{
		id: "hi",
		label: "हिंदी / Hindi"
	},
	{
		id: "mr",
		label: "मराठी / Marathi"
	},
	{
		id: "bn",
		label: "বাংলা / Bengali"
	},
	{
		id: "ta",
		label: "தமிழ் / Tamil"
	},
	{
		id: "te",
		label: "తెలుగు / Telugu"
	},
	{
		id: "pt",
		label: "Português"
	},
	{
		id: "en",
		label: "English"
	}
];
var LANGUAGE_LABELS = {
	hi: "Hindi",
	mr: "Marathi",
	bn: "Bengali",
	ta: "Tamil",
	te: "Telugu",
	pt: "Portuguese",
	en: "English",
	auto: "Auto"
};
var CATEGORY_COLOR = {
	water: "var(--cat-water)",
	roads: "var(--cat-roads)",
	electricity: "var(--cat-electricity)",
	sanitation: "var(--cat-sanitation)",
	other: "var(--cat-other)"
};
var URGENCY_WEIGHT = {
	1: .5,
	2: .8,
	3: 1.2,
	4: 1.8,
	5: 2.6
};
function isOpen(status) {
	return status !== "resolved";
}
/**
* Priority Score = (report_volume x urgency_weight) + (population_affected / infra_score)
* The second term is normalised per 1,000 residents so both terms stay comparable.
*/
function priorityScore(input) {
	const weight = URGENCY_WEIGHT[Math.round(input.avgUrgency)] ?? 1;
	const infra = Math.max(input.infraScore, .5);
	return Math.round((input.volume * weight + input.peopleAffected / 1e3 / infra) * 10) / 10;
}
/** Share of ward residents assumed affected, scaled by report volume. */
function affectedPopulation(population, volume) {
	const share = Math.min(.05 + volume * .045, .6);
	return Math.round(population * share);
}
function weeksAgo(iso) {
	return (Date.now() - new Date(iso).getTime()) / 6048e5;
}
/** Group reports into ward + category hotspots (the demand-clustering step). */
function buildHotspots(reports, wards) {
	const wardById = new Map(wards.map((w) => [w.id, w]));
	const groups = /* @__PURE__ */ new Map();
	for (const report of reports) {
		const key = `${report.ward_id}::${report.category}`;
		const list = groups.get(key);
		if (list) list.push(report);
		else groups.set(key, [report]);
	}
	const hotspots = [];
	for (const [key, group] of groups) {
		const [wardId, category] = key.split("::");
		const ward = wardById.get(wardId);
		if (!ward) continue;
		const volume = group.length;
		const avgUrgency = group.reduce((sum, r) => sum + r.urgency, 0) / volume;
		const peopleAffected = affectedPopulation(ward.population, volume);
		const weeklyTrend = group.filter((r) => weeksAgo(r.created_at) <= 1).length - group.filter((r) => weeksAgo(r.created_at) > 1 && weeksAgo(r.created_at) <= 2).length;
		const score = priorityScore({
			volume,
			avgUrgency,
			peopleAffected,
			infraScore: ward.infra_score
		});
		const CRITICAL = 12;
		const growthPerWeek = Math.max(weeklyTrend, 0) * (URGENCY_WEIGHT[Math.round(avgUrgency)] ?? 1);
		const weeksToCritical = score >= CRITICAL ? 0 : growthPerWeek > 0 ? Math.ceil((CRITICAL - score) / growthPerWeek) : null;
		hotspots.push({
			wardId,
			ward,
			category,
			reports: group.slice().sort((a, b) => b.created_at.localeCompare(a.created_at)),
			volume,
			avgUrgency: Math.round(avgUrgency * 10) / 10,
			peopleAffected,
			priorityScore: score,
			openCount: group.filter((r) => isOpen(r.status)).length,
			weeklyTrend,
			weeksToCritical
		});
	}
	return hotspots.sort((a, b) => b.priorityScore - a.priorityScore);
}
/** Simple lexical similarity so near-duplicate reports can be flagged. */
function similarity(a, b) {
	const norm = (s) => new Set(s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length > 3));
	const setA = norm(a);
	const setB = norm(b);
	if (setA.size === 0 || setB.size === 0) return 0;
	let shared = 0;
	for (const word of setA) if (setB.has(word)) shared += 1;
	return shared / Math.min(setA.size, setB.size);
}
function formatScore(value) {
	return value.toFixed(1);
}
function severityLabel(score) {
	if (score >= 12) return "Critical";
	if (score >= 7) return "High";
	if (score >= 3.5) return "Moderate";
	return "Watch";
}
//#endregion
export { CATEGORIES, CATEGORY_COLOR, LANGUAGES, LANGUAGE_LABELS, STATUSES, URGENCY_WEIGHT, buildHotspots, formatScore, isOpen, priorityScore, severityLabel, similarity };
