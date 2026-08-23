import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Report, Ward } from "./jansetu";

function num(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const wardsQuery = queryOptions({
  queryKey: ["wards"],
  queryFn: async (): Promise<Ward[]> => {
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
      lng: num(w.lng),
    }));
  },
  staleTime: 5 * 60 * 1000,
});

export const reportsQuery = queryOptions({
  queryKey: ["reports"],
  queryFn: async (): Promise<Report[]> => {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
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
      image_paths: (r as { image_paths?: string[] | null }).image_paths ?? [],
      address: (r as { address?: string | null }).address ?? "",
      created_at: r.created_at,
    }));
  },
  staleTime: 30 * 1000,
});

export function useWards() {
  return useQuery(wardsQuery);
}

export function useReports() {
  return useQuery(reportsQuery);
}
