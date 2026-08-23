import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { FileText, Loader2, LogIn, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/jansetu/AppShell";
import { ImageGallery } from "@/components/jansetu/ImageGallery";
import { CategoryDonut, HeatGrid, KpiCard, Panel, PriorityBars, TrendArea } from "@/components/jansetu/charts";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { generateBrief } from "@/lib/jansetu.functions";
import { useReports, useWards } from "@/lib/use-jansetu-data";
import {
  buildHotspots,
  CATEGORIES,
  CATEGORY_COLOR,
  formatScore,
  isOpen,
  LANGUAGE_LABELS,
  severityLabel,
  STATUSES,
  type Category,
} from "@/lib/jansetu";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Policy data — demand hotspots & priority scores | JanSetu" },
      {
        name: "description",
        content:
          "Charted citizen demand: ward priority rankings, category breakdown, weekly trend, ward × category heat matrix and AI-generated policy briefs for municipal decision makers.",
      },
      { property: "og:title", content: "Policy data dashboard — JanSetu" },
      {
        property: "og:description",
        content: "Ranked civic hotspots, priority score charts and AI policy briefs for officials.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data: wards = [] } = useWards();
  const { data: reports = [], refetch } = useReports();
  const runBrief = useServerFn(generateBrief);

  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("open");
  const [selected, setSelected] = useState<string | null>(null);
  const [brief, setBrief] = useState<{ key: string; text: string } | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [budget, setBudget] = useState([40]);
  const [note, setNote] = useState("");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      setEmail(session?.user.email ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const countryWards = useMemo(() => wards.filter((w) => w.country === "IN"), [wards]);
  const wardIds = useMemo(() => new Set(countryWards.map((w) => w.id)), [countryWards]);

  const scopedReports = useMemo(
    () =>
      reports.filter((report) => {
        if (!wardIds.has(report.ward_id)) return false;
        if (category !== "all" && report.category !== category) return false;
        if (status === "open" && !isOpen(report.status)) return false;
        if (status !== "all" && status !== "open" && report.status !== status) return false;
        return true;
      }),
    [reports, wardIds, category, status],
  );

  const hotspots = useMemo(() => buildHotspots(scopedReports, countryWards), [scopedReports, countryWards]);
  const activeHotspot = hotspots.find((h) => `${h.wardId}::${h.category}` === selected) ?? hotspots[0];
  const activeKey = activeHotspot ? `${activeHotspot.wardId}::${activeHotspot.category}` : null;

  const criticalCount = hotspots.filter((h) => h.priorityScore >= 7).length;
  const peopleReached = hotspots.reduce((sum, h) => sum + h.peopleAffected, 0);
  const voiceShare = scopedReports.length
    ? Math.round(
        (scopedReports.filter((r) => r.channel === "voice" || r.channel === "whatsapp").length /
          scopedReports.length) *
          100,
      )
    : 0;

  // ---- chart series (presentation-only projections of the same hotspot data) ----
  const rankingData = useMemo(
    () =>
      hotspots.slice(0, 12).map((spot) => ({
        key: `${spot.wardId}::${spot.category}`,
        label: `${spot.ward.name.slice(0, 12)} · ${spot.category.slice(0, 5)}`,
        score: spot.priorityScore,
        category: spot.category,
      })),
    [hotspots],
  );

  const categoryData = useMemo(
    () =>
      CATEGORIES.map((item) => ({
        category: item.id,
        label: item.label,
        value: scopedReports.filter((report) => report.category === item.id).length,
      })),
    [scopedReports],
  );

  const trendData = useMemo(() => {
    const weeks = 8;
    const now = Date.now();
    const buckets = Array.from({ length: weeks }, (_, index) => ({
      week: `W-${weeks - 1 - index}`,
      reports: 0,
      cumulative: 0,
    }));
    for (const report of scopedReports) {
      const age = Math.floor((now - new Date(report.created_at).getTime()) / (7 * 86400_000));
      const bucket = buckets[weeks - 1 - age];
      if (bucket) bucket.reports += 1;
    }
    let running = 0;
    for (const bucket of buckets) {
      running += bucket.reports;
      bucket.cumulative = running;
    }
    return buckets;
  }, [scopedReports]);

  const heatValues = useMemo(() => {
    const map = new Map<string, number>();
    for (const spot of hotspots) map.set(`${spot.wardId}::${spot.category}`, spot.priorityScore);
    return map;
  }, [hotspots]);

  const heatMax = useMemo(() => Math.max(1, ...hotspots.map((h) => h.priorityScore)), [hotspots]);

  // Budget simulator: spend reduces the infrastructure gap term of the priority score.
  const projectedScore = useMemo(() => {
    if (!activeHotspot) return 0;
    const spend = budget[0] ?? 0;
    const infraLift = Math.min(activeHotspot.ward.infra_score + spend / 12, 10);
    const weight = activeHotspot.avgUrgency;
    const resolvedShare = Math.min(spend / 100, 0.85);
    const volume = activeHotspot.volume * (1 - resolvedShare);
    return (
      Math.round((volume * (weight / 2) + activeHotspot.peopleAffected / 1000 / infraLift) * 10) / 10
    );
  }, [activeHotspot, budget]);

  async function onGenerateBrief() {
    if (!activeHotspot) return;
    setBriefLoading(true);
    try {
      const response = await runBrief({
        data: { wardId: activeHotspot.wardId, category: activeHotspot.category },
      });
      if (!response.ok) {
        toast.error(response.error);
        return;
      }
      setBrief({ key: `${activeHotspot.wardId}::${activeHotspot.category}`, text: response.brief });
    } catch (error) {
      console.error(error);
      toast.error("Could not generate the brief.");
    } finally {
      setBriefLoading(false);
    }
  }

  async function updateStatus(reportId: string, nextStatus: string) {
    const { error } = await supabase
      .from("reports")
      .update({ status: nextStatus, official_note: note.trim() || null })
      .eq("id", reportId);
    if (error) {
      toast.error("Sign in as an official to update status.");
      return;
    }
    toast.success("Status updated — the citizen sees this immediately.");
    setNote("");
    void refetch();
  }

  return (
    <AppShell
      title="Policy data"
      subtitle="Citizen demand clustered into ward × category hotspots and ranked by priority score."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open only</SelectItem>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard index="01" label="Citizen reports" value={String(scopedReports.length)} hint="in current filter" />
          <KpiCard
            index="02"
            label="Demand hotspots"
            value={String(hotspots.length)}
            hint={`${criticalCount} high or critical`}
          />
          <KpiCard
            index="03"
            label="Residents affected"
            value={peopleReached.toLocaleString()}
            hint="modelled from ward demographics"
          />
          <KpiCard index="04" label="Voice / WhatsApp share" value={`${voiceShare}%`} hint="non-text channels" />
        </div>

        <div className="grid items-start gap-4 xl:grid-cols-[1.4fr_1fr]">
          <Panel title="Fig. 1 — Priority score ranking" hint="click a bar to inspect the hotspot" className="self-start">
            <PriorityBars data={rankingData} activeKey={activeKey} onSelect={setSelected} />
          </Panel>
          <div className="grid gap-4">
            <Panel title="Fig. 2 — Reports by category" hint={`${scopedReports.length} reports`}>
              <CategoryDonut data={categoryData} />
            </Panel>
            <Panel title="Fig. 3 — Weekly report volume" hint="last 8 weeks, cumulative dashed">
              <TrendArea data={trendData} />
            </Panel>
          </div>
        </div>

        <Panel
          title="Fig. 4 — Ward × category priority matrix"
          hint="numbers are priority scores; deeper ink = higher severity"
        >
          <HeatGrid
            wards={countryWards}
            categories={CATEGORIES}
            values={heatValues}
            max={heatMax}
            activeKey={activeKey}
            onSelect={(key) => heatValues.has(key) && setSelected(key)}
          />
        </Panel>

        <Panel title="Table 1 — Ranked recommendations" hint="priority = (volume × urgency weight) + (residents ÷ infra)">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr>
                  {["#", "Ward", "Category", "Score", "Severity", "Reports", "Urgency", "Residents", "Trend"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="label-mono border-b border-border px-2 py-2 text-left whitespace-nowrap"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {hotspots.map((spot, index) => {
                  const key = `${spot.wardId}::${spot.category}`;
                  const active = key === activeKey;
                  return (
                    <tr
                      key={key}
                      onClick={() => setSelected(key)}
                      className={`cursor-pointer border-b border-border/70 transition-colors last:border-0 ${
                        active ? "bg-secondary" : "hover:bg-secondary/60"
                      }`}
                    >
                      <td className="font-mono px-2 py-2 text-xs text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="px-2 py-2 font-medium whitespace-nowrap">{spot.ward.name}</td>
                      <td className="px-2 py-2">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs capitalize"
                          style={{ color: CATEGORY_COLOR[spot.category] }}
                        >
                          <span
                            className="size-2 rounded-sm"
                            style={{ backgroundColor: CATEGORY_COLOR[spot.category] }}
                          />
                          {spot.category}
                        </span>
                      </td>
                      <td className="font-mono px-2 py-2 font-semibold tabular-nums">
                        {formatScore(spot.priorityScore)}
                      </td>
                      <td className="px-2 py-2 text-xs">{severityLabel(spot.priorityScore)}</td>
                      <td className="font-mono px-2 py-2 text-xs tabular-nums">{spot.volume}</td>
                      <td className="font-mono px-2 py-2 text-xs tabular-nums">{spot.avgUrgency}/5</td>
                      <td className="font-mono px-2 py-2 text-xs tabular-nums">
                        {spot.peopleAffected.toLocaleString()}
                      </td>
                      <td className="px-2 py-2 text-xs whitespace-nowrap">
                        {spot.weeksToCritical !== null ? (
                          <span className="inline-flex items-center gap-1 text-accent">
                            <TrendingUp className="size-3" />
                            {spot.weeksToCritical === 0 ? "already critical" : `~${spot.weeksToCritical}w`}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">stable</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {hotspots.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-2 py-6 text-center text-sm text-muted-foreground">
                      No reports match these filters yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        {activeHotspot && (
          <div className="grid items-start gap-4 xl:grid-cols-[1.4fr_1fr]">
            <Panel
              title={`Case file — ${activeHotspot.ward.name} · ${activeHotspot.category}`}
              hint={`${activeHotspot.ward.city} · pop ${activeHotspot.ward.population.toLocaleString()} · infra ${activeHotspot.ward.infra_score}/10`}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Score", value: formatScore(activeHotspot.priorityScore) },
                    { label: "Reports", value: String(activeHotspot.volume) },
                    { label: "Urgency", value: `${activeHotspot.avgUrgency}/5` },
                    { label: "Open", value: String(activeHotspot.openCount) },
                  ].map((item) => (
                    <div key={item.label} className="rounded-md border border-border bg-surface-2/50 p-2.5">
                      <p className="label-mono">{item.label}</p>
                      <p className="font-display mt-0.5 text-lg font-semibold tabular-nums">{item.value}</p>
                    </div>
                  ))}
                </div>

                <Button onClick={onGenerateBrief} disabled={briefLoading} className="w-full sm:w-auto">
                  {briefLoading ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
                  {briefLoading ? "Writing brief…" : "Generate policy brief"}
                </Button>

                {brief?.key === activeKey && (
                  <div className="rounded-md border border-border border-l-2 border-l-accent bg-surface-2/40 p-4">
                    <p className="label-mono mb-2 text-accent">AI policy brief</p>
                    <div className="space-y-2 text-sm leading-relaxed whitespace-pre-wrap">{brief.text}</div>
                  </div>
                )}

                <div>
                  <h3 className="label-mono">Citizen reports in this cluster</h3>
                  <ul className="mt-2 space-y-2">
                    {activeHotspot.reports.map((report) => (
                      <li key={report.id} className="rounded-md border border-border bg-surface-2/40 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span className="font-mono font-medium text-foreground">{report.tracking_code}</span>
                          <span className="font-mono">
                            {LANGUAGE_LABELS[report.language] ?? report.language} · {report.channel} · urgency{" "}
                            {report.urgency}/5 · {report.sentiment}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm">{report.translated_text}</p>
                        <p className="mt-1 text-xs text-muted-foreground italic">{report.original_text}</p>
                        <ImageGallery paths={report.image_paths} className="mt-2" />
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {STATUSES.map((option) => (
                            <Button
                              key={option.id}
                              size="sm"
                              variant={report.status === option.id ? "default" : "secondary"}
                              disabled={!email}
                              onClick={() => void updateStatus(report.id, option.id)}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 rounded-md border border-border p-3">
                  {email ? (
                    <>
                      <Label htmlFor="note">Official note sent to citizens (optional)</Label>
                      <Textarea
                        id="note"
                        rows={2}
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Tanker deployed today; pipeline repair scheduled Friday."
                      />
                      <p className="text-xs text-muted-foreground">Signed in as {email}</p>
                    </>
                  ) : (
                    <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <LogIn className="size-4" />
                      <Link to="/admin/login" className="font-medium text-accent hover:underline">
                        Sign in as an official
                      </Link>
                      to acknowledge, progress or resolve reports.
                    </p>
                  )}
                </div>
              </div>
            </Panel>

            <div className="space-y-4">
              <Panel title="Fig. 5 — Budget allocation impact" hint="model spend before committing it">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="label-mono">Allocation</span>
                      <span className="font-mono font-semibold">₹{budget[0]} lakh</span>
                    </div>
                    <Slider value={budget} onValueChange={setBudget} min={0} max={200} step={5} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md border border-border bg-surface-2/50 p-3">
                      <p className="label-mono">Score now</p>
                      <p className="font-display mt-1 text-2xl font-semibold tabular-nums">
                        {formatScore(activeHotspot.priorityScore)}
                      </p>
                    </div>
                    <div className="rounded-md border border-accent/50 bg-accent/10 p-3">
                      <p className="label-mono">Projected</p>
                      <p className="font-display mt-1 text-2xl font-semibold text-accent tabular-nums">
                        {formatScore(projectedScore)}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-sm bg-surface-2">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(0, ((activeHotspot.priorityScore - projectedScore) / Math.max(activeHotspot.priorityScore, 0.1)) * 100))}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {projectedScore < activeHotspot.priorityScore
                      ? `Reduces severity by ${Math.round(((activeHotspot.priorityScore - projectedScore) / activeHotspot.priorityScore) * 100)}% and lifts ward infra readiness.`
                      : "Increase the allocation to see a measurable severity reduction."}
                  </p>
                </div>
              </Panel>

              <Panel title="Legend & interoperability">
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {CATEGORIES.map((item) => (
                    <span key={item.id} className="inline-flex items-center gap-1.5">
                      <span
                        className="size-2.5 rounded-sm"
                        style={{ backgroundColor: CATEGORY_COLOR[item.id as Category] }}
                      />
                      {item.label}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  The same engine runs across every Indian ward dataset loaded into JanSetu — one dashboard,
                  one methodology, an open API-ready schema.
                </p>
              </Panel>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
