import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SubmitInput = z.object({
  wardId: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  text: z.string().max(4000).optional(),
  audioBase64: z.string().optional(),
  audioFormat: z.string().optional(),
  languageHint: z.string().default("auto"),
  channel: z.string().default("web"),
  reporterName: z.string().max(80).optional(),
  address: z.string().max(300).default(""),
  imagePaths: z.array(z.string().max(300)).max(3).default([]),
});

const BriefInput = z.object({
  wardId: z.string().min(1),
  category: z.string().min(1),
});

export const submitReport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SubmitInput.parse(input))
  .handler(async ({ data }) => {
    const { analyzeComplaint, AiGatewayError } = await import("./ai.server");
    const { createPublicServerClient } = await import("./supabase-public.server");

    if (!data.text?.trim() && !data.audioBase64) {
      return { ok: false as const, error: "Add a description or a voice note first." };
    }

    let analysis;
    try {
      analysis = await analyzeComplaint({
        text: data.text,
        audioBase64: data.audioBase64,
        audioFormat: data.audioFormat,
        languageHint: data.languageHint,
      });
    } catch (error) {
      if (error instanceof AiGatewayError) {
        return { ok: false as const, error: error.message, status: error.status };
      }
      console.error("analyze failed", error);
      return { ok: false as const, error: "Could not analyse the report. Please try again." };
    }

    if (!analysis.originalText.trim()) {
      return {
        ok: false as const,
        error: "We could not hear any speech in that recording. Try again or type the complaint.",
      };
    }

    const supabase = createPublicServerClient();
    const code = `JS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const { data: inserted, error } = await supabase
      .from("reports")
      .insert({
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
        image_paths: data.imagePaths,
      })
      .select()
      .single();

    if (error) {
      console.error("insert failed", error);
      return { ok: false as const, error: "Could not save the report. Please try again." };
    }

    return { ok: true as const, report: inserted, locationHint: analysis.locationHint };
  });

export const generateBrief = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => BriefInput.parse(input))
  .handler(async ({ data }) => {
    const { generatePolicyBrief, AiGatewayError } = await import("./ai.server");
    const { createPublicServerClient } = await import("./supabase-public.server");
    const { buildHotspots } = await import("./jansetu");

    const supabase = createPublicServerClient();
    const [{ data: wards }, { data: reports }] = await Promise.all([
      supabase.from("wards").select("*"),
      supabase.from("reports").select("*").eq("ward_id", data.wardId).eq("category", data.category),
    ]);

    const ward = wards?.find((w) => w.id === data.wardId);
    if (!ward || !reports?.length) {
      return { ok: false as const, error: "No reports found for this hotspot yet." };
    }

    const normalise = <T extends { lat: unknown; lng: unknown; population?: unknown; infra_score?: unknown }>(
      row: T,
    ) => ({
      ...row,
      lat: Number(row.lat),
      lng: Number(row.lng),
      ...(row.population === undefined ? {} : { population: Number(row.population) }),
      ...(row.infra_score === undefined ? {} : { infra_score: Number(row.infra_score) }),
    });

    const hotspot = buildHotspots(
      reports.map(normalise) as never,
      (wards ?? []).map(normalise) as never,
    ).find((h) => h.wardId === data.wardId && h.category === data.category);
    if (!hotspot) return { ok: false as const, error: "Hotspot could not be computed." };

    const context = [
      `City: ${ward.city} (${ward.country}). Ward: ${ward.name} (${ward.id}).`,
      `Ward population: ${ward.population}. Infrastructure readiness score: ${ward.infra_score}/10.`,
      `Issue category: ${data.category}.`,
      `Citizen reports in this cluster: ${hotspot.volume}. Open: ${hotspot.openCount}. Average urgency: ${hotspot.avgUrgency}/5.`,
      `Estimated residents affected: ${hotspot.peopleAffected}.`,
      `Computed JanSetu Priority Score: ${hotspot.priorityScore} (critical threshold 12).`,
      hotspot.weeksToCritical !== null
        ? `Trend projection: crosses critical threshold in about ${hotspot.weeksToCritical} week(s) at the current reporting rate.`
        : `Trend projection: stable, no acceleration detected.`,
      "",
      "Verbatim citizen reports (translated to English):",
      ...hotspot.reports.slice(0, 12).map((r, i) => `${i + 1}. [urgency ${r.urgency}] ${r.translated_text}`),
    ].join("\n");

    try {
      const brief = await generatePolicyBrief(context);
      return { ok: true as const, brief, priorityScore: hotspot.priorityScore };
    } catch (error) {
      if (error instanceof AiGatewayError) {
        return { ok: false as const, error: error.message, status: error.status };
      }
      console.error("brief failed", error);
      return { ok: false as const, error: "Could not generate the brief." };
    }
  });
