// Shared, client-safe domain logic for JanSetu.

export type Category = "water" | "roads" | "electricity" | "sanitation" | "other";
export type Status = "submitted" | "acknowledged" | "in_progress" | "resolved";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "water", label: "Water" },
  { id: "roads", label: "Roads" },
  { id: "electricity", label: "Electricity" },
  { id: "sanitation", label: "Sanitation" },
  { id: "other", label: "Other" },
];

export const STATUSES: { id: Status; label: string }[] = [
  { id: "submitted", label: "Submitted" },
  { id: "acknowledged", label: "Acknowledged" },
  { id: "in_progress", label: "In progress" },
  { id: "resolved", label: "Resolved" },
];

export const COUNTRIES: { id: string; label: string; city: string }[] = [
  { id: "IN", label: "India", city: "Pune" },
];


export const LANGUAGES: { id: string; label: string }[] = [
  { id: "auto", label: "Detect automatically" },
  { id: "hi", label: "हिंदी / Hindi" },
  { id: "mr", label: "मराठी / Marathi" },
  { id: "bn", label: "বাংলা / Bengali" },
  { id: "ta", label: "தமிழ் / Tamil" },
  { id: "te", label: "తెలుగు / Telugu" },
  { id: "pt", label: "Português" },
  { id: "en", label: "English" },
];

export const LANGUAGE_LABELS: Record<string, string> = {
  hi: "Hindi",
  mr: "Marathi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  pt: "Portuguese",
  en: "English",
  auto: "Auto",
};

export const CATEGORY_COLOR: Record<Category, string> = {
  water: "var(--cat-water)",
  roads: "var(--cat-roads)",
  electricity: "var(--cat-electricity)",
  sanitation: "var(--cat-sanitation)",
  other: "var(--cat-other)",
};

// Hex fallbacks for the WebGL layer (Three.js cannot read CSS vars).
export const CATEGORY_HEX: Record<Category, string> = {
  water: "#4aa8ff",
  roads: "#ffb545",
  electricity: "#e8d54a",
  sanitation: "#f065c0",
  other: "#8fa0b8",
};

// Urgency weight curve used by the Priority Score engine.
export const URGENCY_WEIGHT: Record<number, number> = { 1: 0.5, 2: 0.8, 3: 1.2, 4: 1.8, 5: 2.6 };

export const GRID_COLS = 4;
export const GRID_ROWS = 3;

export type Ward = {
  id: string;
  name: string;
  city: string;
  country: string;
  population: number;
  infra_score: number;
  grid_x: number;
  grid_y: number;
  lat: number;
  lng: number;
};

export type Report = {
  id: string;
  tracking_code: string;
  ward_id: string;
  lat: number;
  lng: number;
  category: string;
  urgency: number;
  sentiment: string;
  language: string;
  original_text: string;
  translated_text: string;
  summary: string;
  channel: string;
  status: string;
  official_note: string | null;
  image_paths: string[];
  address: string;
  created_at: string;
};

/** Nearest ward centroid to a pinned coordinate (haversine-free, good enough at city scale). */
export function nearestWard(wards: Ward[], lat: number, lng: number): Ward | null {
  let best: Ward | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const ward of wards) {
    const dx = (ward.lng - lng) * Math.cos((lat * Math.PI) / 180);
    const dy = ward.lat - lat;
    const distance = dx * dx + dy * dy;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = ward;
    }
  }
  return best;
}

export type Hotspot = {
  wardId: string;
  ward: Ward;
  category: Category;
  reports: Report[];
  volume: number;
  avgUrgency: number;
  peopleAffected: number;
  priorityScore: number;
  openCount: number;
  weeklyTrend: number;
  weeksToCritical: number | null;
};

export function isOpen(status: string) {
  return status !== "resolved";
}

/**
 * Priority Score = (report_volume x urgency_weight) + (population_affected / infra_score)
 * The second term is normalised per 1,000 residents so both terms stay comparable.
 */
export function priorityScore(input: {
  volume: number;
  avgUrgency: number;
  peopleAffected: number;
  infraScore: number;
}) {
  const weight = URGENCY_WEIGHT[Math.round(input.avgUrgency)] ?? 1;
  const infra = Math.max(input.infraScore, 0.5);
  return Math.round((input.volume * weight + input.peopleAffected / 1000 / infra) * 10) / 10;
}

/** Share of ward residents assumed affected, scaled by report volume. */
function affectedPopulation(population: number, volume: number) {
  const share = Math.min(0.05 + volume * 0.045, 0.6);
  return Math.round(population * share);
}

function weeksAgo(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24 * 7);
}

/** Group reports into ward + category hotspots (the demand-clustering step). */
export function buildHotspots(reports: Report[], wards: Ward[]): Hotspot[] {
  const wardById = new Map(wards.map((w) => [w.id, w]));
  const groups = new Map<string, Report[]>();

  for (const report of reports) {
    const key = `${report.ward_id}::${report.category}`;
    const list = groups.get(key);
    if (list) list.push(report);
    else groups.set(key, [report]);
  }

  const hotspots: Hotspot[] = [];
  for (const [key, group] of groups) {
    const [wardId, category] = key.split("::") as [string, Category];
    const ward = wardById.get(wardId);
    if (!ward) continue;

    const volume = group.length;
    const avgUrgency = group.reduce((sum, r) => sum + r.urgency, 0) / volume;
    const peopleAffected = affectedPopulation(ward.population, volume);
    const recent = group.filter((r) => weeksAgo(r.created_at) <= 1).length;
    const older = group.filter((r) => weeksAgo(r.created_at) > 1 && weeksAgo(r.created_at) <= 2).length;
    const weeklyTrend = recent - older;

    const score = priorityScore({ volume, avgUrgency, peopleAffected, infraScore: ward.infra_score });
    const CRITICAL = 12;
    const growthPerWeek = Math.max(weeklyTrend, 0) * (URGENCY_WEIGHT[Math.round(avgUrgency)] ?? 1);
    const weeksToCritical =
      score >= CRITICAL ? 0 : growthPerWeek > 0 ? Math.ceil((CRITICAL - score) / growthPerWeek) : null;

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
      weeksToCritical,
    });
  }

  return hotspots.sort((a, b) => b.priorityScore - a.priorityScore);
}

/** Simple lexical similarity so near-duplicate reports can be flagged. */
export function similarity(a: string, b: string) {
  const norm = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3),
    );
  const setA = norm(a);
  const setB = norm(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let shared = 0;
  for (const word of setA) if (setB.has(word)) shared += 1;
  return shared / Math.min(setA.size, setB.size);
}

export function formatScore(value: number) {
  return value.toFixed(1);
}

export function severityLabel(score: number) {
  if (score >= 12) return "Critical";
  if (score >= 7) return "High";
  if (score >= 3.5) return "Moderate";
  return "Watch";
}
