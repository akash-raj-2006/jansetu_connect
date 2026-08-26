import { n as supabase } from "./auth-attacher-CoQhurBi.mjs";
import { n as useQuery, t as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-jansetu-data-DyLqof76.js
function num(value, fallback = 0) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}
var wardsQuery = queryOptions({
	queryKey: ["wards"],
	queryFn: async () => {
		const { data, error } = await supabase.from("wards").select("*").eq("country", "IN").order("id");
		if (error) throw new Error(error.message);
		return (data ?? []).map((w) => ({
			id: w.id,
			name: w.name,
			city: w.city,
			country: w.country,
			population: num(w.population),
			infra_score: num(w.infra_score, 5),
			grid_x: num(w.grid_x),
			grid_y: num(w.grid_y),
			lat: num(w.lat),
			lng: num(w.lng)
		}));
	},
	staleTime: 3e5
});
var reportsQuery = queryOptions({
	queryKey: ["reports"],
	queryFn: async () => {
		const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false }).limit(1e3);
		if (error) throw new Error(error.message);
		return (data ?? []).map((r) => ({
			id: r.id,
			tracking_code: r.tracking_code,
			ward_id: r.ward_id,
			lat: num(r.lat),
			lng: num(r.lng),
			category: r.category,
			urgency: num(r.urgency, 3),
			sentiment: r.sentiment,
			language: r.language,
			original_text: r.original_text,
			translated_text: r.translated_text,
			summary: r.summary,
			channel: r.channel,
			status: r.status,
			official_note: r.official_note,
			image_paths: r.image_paths ?? [],
			address: r.address ?? "",
			created_at: r.created_at
		}));
	},
	staleTime: 3e4
});
function useWards() {
	return useQuery(wardsQuery);
}
function useReports() {
	return useQuery(reportsQuery);
}
//#endregion
export { useWards as n, useReports as t };
