import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Droplets,
  FileSearch,
  Headphones,
  Home,
  Languages,
  Lightbulb,
  MapPin,
  Mic,
  MoreHorizontal,
  Route as RouteIcon,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { AmbientBackdrop } from "@/components/jansetu/AmbientBackdrop";
import { ThemeToggle } from "@/components/jansetu/ThemeToggle";
import { Logo } from "@/components/jansetu/Logo";
import { PriorityExplainer } from "@/components/jansetu/PriorityExplainer";
import { useReports, useWards } from "@/lib/use-jansetu-data";
import {
  CATEGORIES,
  CATEGORY_COLOR,
  buildHotspots,
  severityLabel,
  type Category,
} from "@/lib/jansetu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JanSetu — your voice, our action, better India" },
      {
        name: "description",
        content:
          "Report civic problems in your own language, pin the exact location on the map, and track municipal action in real time. JanSetu turns citizen voice into ranked policy priorities.",
      },
      { property: "og:title", content: "JanSetu — your voice, our action, better India" },
      {
        property: "og:description",
        content:
          "Voice complaints in any Indian language, pinned to the exact spot, ranked into measurable civic priorities with public tracking codes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const NAV = [
  { to: "/", label: "Home", icon: Home, tint: "var(--nav-overview)", exact: true },
  { to: "/report", label: "Report a Problem", icon: Mic, tint: "var(--nav-report)", exact: false },
  { to: "/track", label: "Track My Case", icon: FileSearch, tint: "var(--nav-track)", exact: false },
  { to: "/dashboard", label: "Civic Data", icon: BarChart3, tint: "var(--nav-data)", exact: false },
] as const;

const REPORT_TILES = [
  { label: "Road / Pothole", icon: RouteIcon, tint: "var(--cat-roads)" },
  { label: "Streetlight", icon: Lightbulb, tint: "var(--cat-electricity)" },
  { label: "Water Supply", icon: Droplets, tint: "var(--cat-water)" },
  { label: "Garbage", icon: Trash2, tint: "var(--success)" },
  { label: "Sanitation", icon: Building2, tint: "var(--cat-sanitation)" },
  { label: "Electricity", icon: Zap, tint: "var(--warning)" },
  { label: "Other Issues", icon: MoreHorizontal, tint: "var(--cat-other)" },
];

const HERO_POINTS = [
  {
    icon: Languages,
    tint: "var(--nav-overview)",
    title: "Any Indian Language",
    body: "हिंदी, मराठी, বাংলা, தமிழ் and more",
  },
  {
    icon: MapPin,
    tint: "var(--nav-report)",
    title: "Exact Location",
    body: "Pin it on the map for faster resolution",
  },
  {
    icon: ShieldCheck,
    tint: "var(--nav-track)",
    title: "Track & Stay Updated",
    body: "A public tracking code at every step",
  },
];

const STEPS = [
  { n: "1", icon: Mic, tint: "var(--nav-report)", title: "Report", body: "Tell us what's wrong, in your own words." },
  { n: "2", icon: ShieldCheck, tint: "var(--warning)", title: "Verify", body: "AI checks the issue, category and location." },
  { n: "3", icon: Users, tint: "var(--nav-overview)", title: "Assign", body: "The responsible department is notified." },
  { n: "4", icon: CheckCircle2, tint: "var(--success)", title: "Resolve", body: "Action is taken and you are updated." },
];

const TRUST = [
  { icon: ShieldCheck, title: "Your data is secure" },
  { icon: MapPin, title: "Location used only for your report" },
  { icon: FileSearch, title: "Every complaint gets a tracking ID" },
  { icon: BarChart3, title: "Public accountability through open data" },
  { icon: Users, title: "Accessible for all citizens" },
];

const PROGRESS = ["Reported", "Verified", "Assigned", "In Progress", "Resolved"];

function Landing() {
  const navigate = useNavigate();
  const { data: reports = [] } = useReports();
  const { data: wards = [] } = useWards();
  const [code, setCode] = useState("");

  const resolved = reports.filter((r) => r.status === "resolved").length;
  const rate = reports.length ? Math.round((resolved / reports.length) * 100) : 0;
  const languageCount = new Set(reports.map((r) => r.language)).size;

  const mix = useMemo(() => {
    const total = reports.length || 1;
    return CATEGORIES.map((item) => {
      const count = reports.filter((r) => r.category === item.id).length;
      return { ...item, count, share: Math.round((count / total) * 100) };
    }).sort((a, b) => b.count - a.count);
  }, [reports]);

  const hotspots = useMemo(() => buildHotspots(reports, wards).slice(0, 3), [reports, wards]);

  const pulse = [
    { label: "Issues Reported", value: String(reports.length), tint: "var(--success)" },
    { label: "Issues Resolved", value: String(resolved), tint: "var(--cat-water)" },
    { label: "Resolution Rate", value: `${rate}%`, tint: "var(--cat-sanitation)" },
    { label: "Languages Heard", value: String(languageCount), tint: "var(--warning)" },
  ];

  return (
    <div className="relative min-h-screen bg-transparent">
      <AmbientBackdrop />

      {/* Government strip */}
      <div className="border-b border-border bg-surface-2/80 px-4 py-1.5 text-[11px] backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <p className="label-mono">भारत · Digital Public Good for India</p>
          <div className="flex items-center gap-3">
            <Link to="/admin/login" className="font-semibold text-accent hover:underline">
              Official sign-in
            </Link>
            <ThemeToggle className="!py-1 !text-[10px]" />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border-strong bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="h-11" />
          </Link>
          <nav className="-mx-1 flex flex-1 items-center gap-1 overflow-x-auto px-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                style={{ "--tint": item.tint } as CSSProperties}
                className="flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--tint)_12%,transparent)] hover:text-[var(--tint)]"
                activeProps={{
                  className:
                    "text-[var(--tint)] font-semibold border-b-2 border-[var(--tint)] rounded-b-none",
                }}
              >
                <item.icon className="size-4" strokeWidth={2.2} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {/* Hero */}
        <section className="sheet-ruled grid items-center gap-8 overflow-hidden rounded-2xl px-5 py-8 sm:px-8 lg:grid-cols-[1fr_minmax(18rem,0.85fr)] lg:gap-12 lg:py-12">
          <div className="min-w-0 order-2 lg:order-1">
            <p className="label-mono">Citizen voice in · ranked civic action out</p>
            <h1 className="mt-2 text-[clamp(1.75rem,5.5vw,3rem)] leading-[1.15]">
              आपका शहर, आपकी आवाज़
              <br />
              हमारा संकल्प, <span className="text-accent">बेहतर समाधान</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Report civic problems in your language, pin the exact location, and track action in real time.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/report"
                style={{ "--tint": "var(--nav-report)" } as CSSProperties}
                className="inline-flex items-center gap-3 rounded-xl bg-[var(--tint)] px-5 py-3 text-left text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <Mic className="size-5 shrink-0" />
                <span>
                  <span className="block text-sm font-semibold">Report a Problem</span>
                  <span className="block text-[11px] opacity-90">Speak, don't fill forms</span>
                </span>
              </Link>
              <Link
                to="/track"
                className="sheet inline-flex items-center gap-3 rounded-xl px-5 py-3 text-left transition-transform hover:-translate-y-0.5"
              >
                <FileSearch className="size-5 shrink-0 text-[var(--nav-track)]" />
                <span>
                  <span className="block text-sm font-semibold">Track My Complaint</span>
                  <span className="block text-[11px] text-muted-foreground">Enter your tracking code</span>
                </span>
              </Link>
            </div>

            <div className="mt-7 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
              {HERO_POINTS.map((item) => (
                <div key={item.title} className="flex min-w-0 items-start gap-2" style={{ "--tint": item.tint } as CSSProperties}>
                  <span className="tint-chip mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg">
                    <item.icon className="size-3.5" strokeWidth={2.4} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold">{item.title}</span>
                    <span className="block text-[11px] leading-snug text-muted-foreground">{item.body}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 flex flex-col items-center text-center lg:order-2 lg:items-end lg:text-right">
            <Logo className="h-32 w-auto max-w-full object-contain sm:h-44 md:h-52 lg:h-56 xl:h-64" />
            <p className="label-mono mt-3 text-[13px] tracking-[0.18em] sm:text-sm">
              your voice · our action · better india
            </p>
          </div>



        </section>

        {/* Category tiles */}
        <section className="sheet rounded-2xl p-5">
          <h2 className="text-lg">What would you like to report?</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
            {REPORT_TILES.map((tile) => (
              <Link
                key={tile.label}
                to="/report"
                style={{ "--tint": tile.tint } as CSSProperties}
                className="tint-surface flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-center text-xs font-semibold transition-transform hover:-translate-y-0.5"
              >
                <tile.icon className="size-6 text-[var(--tint)]" strokeWidth={2.2} />
                {tile.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Location bar */}
        <section
          className="tint-surface flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5"
          style={{ "--tint": "var(--nav-report)" } as CSSProperties}
        >
          <div className="flex items-center gap-3">
            <span className="tint-chip flex size-10 items-center justify-center rounded-xl">
              <MapPin className="size-5" strokeWidth={2.2} />
            </span>
            <div>
              <p className="text-sm font-semibold">Where is the problem?</p>
              <p className="text-xs text-muted-foreground">Use your location or pin it on the map</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/report" className="sheet inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold">
              <MapPin className="size-4" /> Use My Location
            </Link>
            <Link to="/report" className="sheet inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold">
              <Search className="size-4" /> Pin on Map
            </Link>
          </div>
        </section>

        {/* Civic pulse + tracking */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="sheet rounded-2xl p-5">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-lg">Civic Pulse</h2>
                <p className="text-xs text-muted-foreground">Real-time updates from Indian cities</p>
              </div>
              <Link to="/dashboard" className="text-sm font-semibold text-accent hover:underline">
                View All Data
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {pulse.map((item) => (
                <div key={item.label} className="tint-surface rounded-xl p-3" style={{ "--tint": item.tint } as CSSProperties}>
                  <p className="font-display text-2xl font-semibold tabular-nums text-[var(--tint)]">{item.value}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>

            <p className="label-mono mt-5">Most reported problems</p>
            <ul className="mt-3 space-y-2.5">
              {mix.map((item) => (
                <li key={item.id} style={{ "--tint": CATEGORY_COLOR[item.id as Category] } as CSSProperties}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--tint)]">{item.label}</span>
                    <span className="font-mono tabular-nums text-muted-foreground">
                      {item.count} · {item.share}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2">
                    <div className="tint-bar h-full rounded-full" style={{ width: `${item.share}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="tint-surface rounded-2xl p-5"
            style={{ "--tint": "var(--nav-track)" } as CSSProperties}
          >
            <h2 className="text-lg">Track Your Complaint</h2>
            <p className="text-xs text-muted-foreground">Enter your tracking code to see real-time status</p>
            <form
              className="mt-4 flex flex-wrap gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                const value = code.trim().toUpperCase();
                void navigate({ to: "/track", search: value ? { code: value } : {} });
              }}
            >
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Enter tracking code (e.g. JS-4821)"
                aria-label="Tracking code"
                className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-[var(--tint)]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--tint)] px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Track Status <ArrowRight className="size-4" />
              </button>
            </form>

            <p className="label-mono mt-6">Complaint progress</p>
            <ol className="mt-3 space-y-2">
              {PROGRESS.map((step, index) => (
                <li key={step} className="flex items-center gap-3 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--tint)_18%,transparent)] font-mono text-[10px] text-[var(--tint)]">
                    {index + 1}
                  </span>
                  <span className="font-medium">{step}</span>
                  <span className="h-px flex-1 bg-border" />
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Issues near you */}
        <section className="sheet rounded-2xl p-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg">Issues in your city</h2>
              <p className="text-xs text-muted-foreground">Highest-priority open clusters right now</p>
            </div>
            <Link to="/dashboard" className="text-sm font-semibold text-accent hover:underline">
              View on data desk <ArrowRight className="inline size-3.5" />
            </Link>
          </div>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {hotspots.map((spot) => (
              <li
                key={`${spot.wardId}-${spot.category}`}
                className="tint-surface rounded-xl p-4"
                style={{ "--tint": CATEGORY_COLOR[spot.category] } as CSSProperties}
              >
                <div className="flex items-center justify-between">
                  <span className="label-mono text-[var(--tint)]">{spot.category}</span>
                  <span className="tint-chip rounded-full px-2 py-0.5 text-[10px] font-semibold">
                    {severityLabel(spot.priorityScore)}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold">
                  {spot.ward.name}, {spot.ward.city}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {spot.volume} reports · {spot.openCount} open · score {spot.priorityScore.toFixed(1)}
                </p>
              </li>
            ))}
            {hotspots.length === 0 && (
              <li className="text-sm text-muted-foreground">No reports yet — be the first to file one.</li>
            )}
          </ul>
        </section>

        {/* Priority score explainer (interactive) */}
        <PriorityExplainer />

        {/* How it works */}
        <section className="sheet rounded-2xl p-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-lg">How JanSetu Works</h2>
            <p className="text-xs text-muted-foreground">A simple 4-step process</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="tint-surface flex items-start gap-3 rounded-xl p-4"
                style={{ "--tint": step.tint } as CSSProperties}
              >
                <span className="tint-chip flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <step.icon className="size-4" strokeWidth={2.2} />
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {step.n}. {step.title}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust strip */}
        <section className="grid gap-4 lg:grid-cols-[2.2fr_1fr]">
          <div className="sheet rounded-2xl p-5">
            <p className="text-sm font-semibold">Built for citizens. Accountable to citizens.</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {TRUST.map((item) => (
                <li key={item.title} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <item.icon className="size-4 shrink-0 text-[var(--nav-track)]" strokeWidth={2.2} />
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="tint-surface rounded-2xl p-5" style={{ "--tint": "var(--warning)" } as CSSProperties}>
            <Headphones className="size-5 text-[var(--tint)]" strokeWidth={2.2} />
            <p className="mt-2 text-sm font-semibold">Need help?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Every report also reaches the ward helpdesk. Officials respond through the tracking code.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-6 border-t border-border-strong bg-sidebar px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="h-12" />
            <p className="mt-3 max-w-xs text-xs text-muted-foreground">
              A digital public good to make citizen voice visible and civic action accountable.
            </p>
          </div>
          <div>
            <p className="label-mono">Quick links</p>
            <ul className="mt-2 space-y-1.5 text-xs">
              <li><Link to="/report" className="hover:text-accent">Report a problem</Link></li>
              <li><Link to="/track" className="hover:text-accent">Track my case</Link></li>
              <li><Link to="/dashboard" className="hover:text-accent">Civic data</Link></li>
            </ul>
          </div>
          <div>
            <p className="label-mono">For officials</p>
            <ul className="mt-2 space-y-1.5 text-xs">
              <li><Link to="/admin/login" className="hover:text-accent">Official sign-in</Link></li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-7xl text-[11px] text-muted-foreground">
          © 2026 JanSetu · Made in India · your voice, our action, better India.
        </p>
      </footer>
    </div>
  );
}
