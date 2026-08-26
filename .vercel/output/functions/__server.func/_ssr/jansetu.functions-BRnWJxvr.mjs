import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as stringType, i as objectType, r as numberType, t as arrayType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jansetu.functions-BRnWJxvr.js
var SubmitInput = objectType({
	wardId: stringType().min(1),
	lat: numberType(),
	lng: numberType(),
	text: stringType().max(4e3).optional(),
	audioBase64: stringType().optional(),
	audioFormat: stringType().optional(),
	languageHint: stringType().default("auto"),
	channel: stringType().default("web"),
	reporterName: stringType().max(80).optional(),
	address: stringType().max(300).default(""),
	imagePaths: arrayType(stringType().max(300)).max(3).default([])
});
var BriefInput = objectType({
	wardId: stringType().min(1),
	category: stringType().min(1)
});
var submitReport_createServerFn_handler = createServerRpc({
	id: "6c8238152658904ed03ec1ad12301e4d3a04805e50126e369a1b00882464bda2",
	name: "submitReport",
	filename: "src/lib/jansetu.functions.ts"
}, (opts) => submitReport.__executeServer(opts));
var submitReport = createServerFn({ method: "POST" }).inputValidator((input) => SubmitInput.parse(input)).handler(submitReport_createServerFn_handler, async ({ data }) => {
	const { analyzeComplaint, AiGatewayError } = await import("./ai.server-BlDHb8cM.mjs");
	const { createPublicServerClient } = await import("./supabase-public.server-BMC50eTv.mjs");
	if (!data.text?.trim() && !data.audioBase64) return {
		ok: false,
		error: "Add a description or a voice note first."
	};
	let analysis;
	try {
		analysis = await analyzeComplaint({
			text: data.text,
			audioBase64: data.audioBase64,
			audioFormat: data.audioFormat,
			languageHint: data.languageHint
		});
	} catch (error) {
		if (error instanceof AiGatewayError) return {
			ok: false,
			error: error.message,
			status: error.status
		};
		console.error("analyze failed", error);
		return {
			ok: false,
			error: "Could not analyse the report. Please try again."
		};
	}
	if (!analysis.originalText.trim()) return {
		ok: false,
		error: "We could not hear any speech in that recording. Try again or type the complaint."
	};
	const supabase = createPublicServerClient();
	const code = `JS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
	const { data: inserted, error } = await supabase.from("reports").insert({
		tracking_code: code,
		ward_id: data.wardId,
		lat: data.lat,
		lng: data.lng,
		category: analysis.category,
		urgency: analysis.urgency,
		sentiment: analysis.sentiment,
		language: analysis.language,
		original_text: analysis.originalText,
		translated_text: analysis.translatedText,
		summary: analysis.summary,
		channel: data.channel,
		status: "submitted",
		reporter_name: data.reporterName?.trim() || null,
		address: data.address,
		image_paths: data.imagePaths
	}).select().single();
	if (error) {
		console.error("insert failed", error);
		return {
			ok: false,
			error: "Could not save the report. Please try again."
		};
	}
	return {
		ok: true,
		report: inserted,
		locationHint: analysis.locationHint
	};
});
var generateBrief_createServerFn_handler = createServerRpc({
	id: "f6e82f3d98e68944d8a00fb4ea2a56123910f3a6dc699bca06d49605b16aeeef",
	name: "generateBrief",
	filename: "src/lib/jansetu.functions.ts"
}, (opts) => generateBrief.__executeServer(opts));
var generateBrief = createServerFn({ method: "POST" }).inputValidator((input) => BriefInput.parse(input)).handler(generateBrief_createServerFn_handler, async ({ data }) => {
	const { generatePolicyBrief, AiGatewayError } = await import("./ai.server-BlDHb8cM.mjs");
	const { createPublicServerClient } = await import("./supabase-public.server-BMC50eTv.mjs");
	const { buildHotspots } = await import("./jansetu-Wo0gHWAe.mjs");
	const supabase = createPublicServerClient();
	const [{ data: wards }, { data: reports }] = await Promise.all([supabase.from("wards").select("*"), supabase.from("reports").select("*").eq("ward_id", data.wardId).eq("category", data.category)]);
	const ward = wards?.find((w) => w.id === data.wardId);
	if (!ward || !reports?.length) return {
		ok: false,
		error: "No reports found for this hotspot yet."
	};
	const normalise = (row) => ({
		...row,
		lat: Number(row.lat),
		lng: Number(row.lng),
		...row.population === void 0 ? {} : { population: Number(row.population) },
		...row.infra_score === void 0 ? {} : { infra_score: Number(row.infra_score) }
	});
	const hotspot = buildHotspots(reports.map(normalise), (wards ?? []).map(normalise)).find((h) => h.wardId === data.wardId && h.category === data.category);
	if (!hotspot) return {
		ok: false,
		error: "Hotspot could not be computed."
	};
	const context = [
		`City: ${ward.city} (${ward.country}). Ward: ${ward.name} (${ward.id}).`,
		`Ward population: ${ward.population}. Infrastructure readiness score: ${ward.infra_score}/10.`,
		`Issue category: ${data.category}.`,
		`Citizen reports in this cluster: ${hotspot.volume}. Open: ${hotspot.openCount}. Average urgency: ${hotspot.avgUrgency}/5.`,
		`Estimated residents affected: ${hotspot.peopleAffected}.`,
		`Computed JanSetu Priority Score: ${hotspot.priorityScore} (critical threshold 12).`,
		hotspot.weeksToCritical !== null ? `Trend projection: crosses critical threshold in about ${hotspot.weeksToCritical} week(s) at the current reporting rate.` : `Trend projection: stable, no acceleration detected.`,
		"",
		"Verbatim citizen reports (translated to English):",
		...hotspot.reports.slice(0, 12).map((r, i) => `${i + 1}. [urgency ${r.urgency}] ${r.translated_text}`)
	].join("\n");
	try {
		return {
			ok: true,
			brief: await generatePolicyBrief(context),
			priorityScore: hotspot.priorityScore
		};
	} catch (error) {
		if (error instanceof AiGatewayError) return {
			ok: false,
			error: error.message,
			status: error.status
		};
		console.error("brief failed", error);
		return {
			ok: false,
			error: "Could not generate the brief."
		};
	}
});
//#endregion
export { generateBrief_createServerFn_handler, submitReport_createServerFn_handler };
