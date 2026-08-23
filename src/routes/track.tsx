import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import {
  Building2,
  Droplets,
  FilePlus2,
  Lightbulb,
  MapPin,
  MoreHorizontal,
  Route as RouteIcon,
  Search,
  Trash2,
} from "lucide-react";
import { getSavedCodes } from "@/lib/my-reports";
import { AppShell } from "@/components/jansetu/AppShell";
import { ImageGallery } from "@/components/jansetu/ImageGallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReports, useWards } from "@/lib/use-jansetu-data";
import { CATEGORY_COLOR, LANGUAGE_LABELS, STATUSES, type Category, type Report } from "@/lib/jansetu";

type Search = { code?: string | undefined };

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    code: typeof search["code"] === "string" ? search["code"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Track your complaint status — JanSetu" },
      {
        name: "description",
        content:
          "Enter your JanSetu tracking code to see whether your civic complaint is acknowledged, in progress or resolved.",
      },
      { property: "og:title", content: "Track your complaint status — JanSetu" },
      {
        property: "og:description",
        content: "Transparent status updates on every citizen infrastructure complaint.",
      },
    ],
  }),
  component: TrackPage,
});

const STEP_INDEX: Record<string, number> = {
  submitted: 0,
  acknowledged: 1,
  in_progress: 2,
  resolved: 3,
};

function Timeline({ report }: { report: Report }) {
  const current = STEP_INDEX[report.status] ?? 0;
  return (
    <ol className="mt-4 space-y-3">
      {STATUSES.map((status, index) => {
        const done = index <= current;
        return (
          <li key={status.id} className="flex items-start gap-3">
            <span
              className={`mt-1 size-3 shrink-0 rounded-full ${done ? "bg-primary" : "bg-muted"}`}
              aria-hidden
            />
            <div>
              <p className={done ? "text-sm font-medium" : "text-sm text-muted-foreground"}>
                {status.label}
              </p>
              {index === current && report.official_note && (
                <p className="text-xs text-muted-foreground">Official note: {report.official_note}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const CATEGORY_ICON: Record<string, typeof RouteIcon> = {
  roads: RouteIcon,
  water: Droplets,
  electricity: Lightbulb,
  sanitation: Building2,
  waste: Trash2,
  other: MoreHorizontal,
};

function RecentReports({
  reports,
  wardName,
  activeCode,
  onOpen,
}: {
  reports: Report[];
  wardName: (id: string) => string;
  activeCode: string;
  onOpen: (code: string) => void;
}) {
  const [codes, setCodes] = useState<string[] | null>(null);

  useEffect(() => setCodes(getSavedCodes()), []);

  if (codes === null) return null;

  const mine = codes
    .map((code) => reports.find((r) => r.tracking_code.toUpperCase() === code))
    .filter((r): r is Report => Boolean(r));

  return (
    <section className="mt-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Your recent reports</h2>
          <p className="text-xs text-muted-foreground">
            Saved on this device — tap any card to open its full timeline.
          </p>
        </div>
        <Link to="/report" className="text-sm font-semibold text-accent hover:underline">
          File a new report →
        </Link>
      </div>

      {mine.length === 0 ? (
        <div className="sheet mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl p-5">
          <div>
            <p className="text-sm font-semibold">No reports yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Once you file a complaint it will appear here automatically — no account needed.
            </p>
          </div>
          <Button asChild>
            <Link to="/report">
              <FilePlus2 className="size-4" /> File your first report
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {mine.map((report) => {
            const Icon = CATEGORY_ICON[report.category] ?? MoreHorizontal;
            const selected = report.tracking_code.toUpperCase() === activeCode;
            return (
              <li key={report.id}>
                <button
                  type="button"
                  onClick={() => onOpen(report.tracking_code)}
                  style={{ "--tint": CATEGORY_COLOR[report.category as Category] } as CSSProperties}
                  className={`tint-surface w-full rounded-xl p-4 text-left transition-transform hover:-translate-y-0.5 ${
                    selected ? "ring-2 ring-[var(--tint)]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <Icon className="size-4 text-[var(--tint)]" strokeWidth={2.2} />
                      <span className="font-mono text-xs">{report.tracking_code}</span>
                    </span>
                    <span className="tint-chip rounded-full px-2 py-0.5 text-[10px] font-semibold">
                      {STATUSES.find((s) => s.id === report.status)?.label ?? report.status}
                    </span>
                  </div>
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" />
                    <span className="line-clamp-2">
                      {report.address || wardName(report.ward_id)}
                    </span>
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {new Date(report.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function TrackPage() {
  const { code } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [value, setValue] = useState(code ?? "");
  const { data: reports = [], isLoading } = useReports();
  const { data: wards = [] } = useWards();

  const query = (code ?? "").trim().toUpperCase();
  const report = query ? reports.find((r) => r.tracking_code.toUpperCase() === query) : undefined;
  const ward = report ? wards.find((w) => w.id === report.ward_id) : undefined;

  return (
    <AppShell
      title="Track a case"
      subtitle="The loop closes here — every report keeps a public status trail."
    >
      <div className="max-w-3xl">
        <RecentReports
          reports={reports}
          wardName={(id) => wards.find((w) => w.id === id)?.name ?? id}
          activeCode={query}
          onOpen={(next) => {
            setValue(next);
            void navigate({ search: { code: next.toUpperCase() } });
          }}
        />

        <form
          className="mt-6 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void navigate({ search: { code: value.trim().toUpperCase() } });
          }}
        >
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="JS-4A7K21"
            className="font-mono"
          />
          <Button type="submit">
            <Search className="size-4" /> Track
          </Button>
        </form>

        {query && !isLoading && !report && (
          <p className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
            No report found for <span className="font-mono">{query}</span>. Check the code and try again.
          </p>
        )}

        {report && (
          <article className="sheet mt-6 space-y-4 rounded-md p-5">
            <header className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-mono text-sm text-primary">{report.tracking_code}</p>
                <h2 className="font-display text-xl font-semibold capitalize">
                  {report.category} · {ward?.name ?? report.ward_id}
                </h2>
              </div>
              <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {STATUSES.find((s) => s.id === report.status)?.label ?? report.status}
              </span>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  Your words ({LANGUAGE_LABELS[report.language] ?? report.language})
                </p>
                <p className="text-sm">{report.original_text}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">As officials see it</p>
                <p className="text-sm">{report.translated_text}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-md border border-border/70 bg-surface-2/50 p-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Urgency</p>
                <p>{report.urgency}/5</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Channel</p>
                <p className="capitalize">{report.channel}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Filed</p>
                <p>{new Date(report.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {report.address && (
              <div className="rounded-md border border-border/70 bg-surface-2/50 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Pinned location</p>
                <p>{report.address}</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {report.lat.toFixed(5)}, {report.lng.toFixed(5)}
                </p>
              </div>
            )}

            <ImageGallery paths={report.image_paths} />

            <Timeline report={report} />
          </article>
        )}
      </div>
    </AppShell>
  );
}
