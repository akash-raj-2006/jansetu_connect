import { createFileRoute, isRedirect, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Loader2, LogIn, MapPin, Save, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/jansetu/AppShell";
import { ImageGallery } from "@/components/jansetu/ImageGallery";
import { KpiCard, Panel } from "@/components/jansetu/charts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useReports, useWards } from "@/lib/use-jansetu-data";
import { getMyAdminRole } from "@/lib/admin.functions";
import {
  CATEGORIES,
  CATEGORY_COLOR,
  isOpen,
  LANGUAGE_LABELS,
  STATUSES,
  type Category,
  type Report,
} from "@/lib/jansetu";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  beforeLoad: async () => {
    // During SSR on server, return default context to prevent premature redirect
    if (typeof window === "undefined") {
      return { adminRole: "super_admin" };
    }

    // Client-side authentication checks:
    const localOfficial = localStorage.getItem("jansetu_official");
    if (localOfficial) {
      return { adminRole: "super_admin" };
    }

    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user?.email) {
        localStorage.setItem("jansetu_official", data.session.user.email);
        return { adminRole: "super_admin" };
      }
    } catch {
      /* ignore auth error */
    }

    throw redirect({ to: "/admin/login", search: { denied: "1" } });
  },
  head: () => ({
    meta: [
      { title: "Admin dashboard — manage report status | JanSetu" },
      {
        name: "description",
        content:
          "Official control panel to filter citizen reports, update status from submitted to resolved, and publish notes citizens see on their tracking page.",
      },
      { property: "og:title", content: "Admin dashboard — JanSetu" },
      {
        property: "og:description",
        content: "Filter, triage and resolve citizen infrastructure reports in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { data: wards = [] } = useWards();
  const { data: reports = [], refetch, isLoading } = useReports();

  const [email, setEmail] = useState<string | null>(null);
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [ward, setWard] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [draftStatus, setDraftStatus] = useState<string>("submitted");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const e = data.session?.user.email;
      if (e) setEmail(e);
      else if (typeof window !== "undefined") {
        setEmail(localStorage.getItem("jansetu_official"));
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      setEmail(session?.user.email ?? (typeof window !== "undefined" ? localStorage.getItem("jansetu_official") : null)),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const adminRole = Route.useRouteContext()?.adminRole ?? "super_admin";
  const navigate = useNavigate();

  async function signOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jansetu_official");
    }
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    } else {
      void navigate({ to: "/admin/login" });
    }
  }


  const wardName = useMemo(() => new Map(wards.map((w) => [w.id, w.name])), [wards]);

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return reports.filter((report) => {
      if (wards.length && !wardName.has(report.ward_id)) return false;
      if (status === "open" && !isOpen(report.status)) return false;
      if (status !== "all" && status !== "open" && report.status !== status) return false;
      if (category !== "all" && report.category !== category) return false;
      if (ward !== "all" && report.ward_id !== ward) return false;
      if (
        term &&
        ![report.tracking_code, report.translated_text, report.address, wardName.get(report.ward_id) ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
        return false;
      return true;
    });
  }, [reports, status, category, ward, query, wardName, wards.length]);

  const active = rows.find((r) => r.id === openId) ?? null;

  function openRow(report: Report) {
    setOpenId(report.id);
    setDraftStatus(report.status);
    setNote(report.official_note ?? "");
  }

  async function save() {
    if (!active) return;
    setSaving(true);
    const { error } = await supabase
      .from("reports")
      .update({ status: draftStatus, official_note: note.trim() || null })
      .eq("id", active.id);
    setSaving(false);
    if (error) {
      toast.error("Update failed — sign in as an official first.");
      return;
    }
    toast.success(`${active.tracking_code} updated — the citizen sees it immediately.`);
    void refetch();
  }

  const counts = STATUSES.map((s) => ({
    ...s,
    value: reports.filter((r) => r.status === s.id).length,
  }));

  return (
    <AppShell
      title="Admin panel"
      subtitle="Triage every citizen report, move it through the workflow and publish the note citizens see."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-mono rounded-md border border-border px-2 py-1">
            {(adminRole || "super_admin").replace("_", " ")}
          </span>
          {email && (
            <span className="label-mono rounded-md border border-border px-2 py-1">{email}</span>
          )}
          <Button size="sm" variant="secondary" onClick={() => void signOut()}>
            <LogIn className="size-3.5" /> Sign out
          </Button>
        </div>
      }
    >
      <div className="space-y-5">


        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {counts.map((item) => (
            <KpiCard key={item.id} label={item.label} value={String(item.value)} hint="reports" />
          ))}
        </div>

        <Panel title="Report queue" hint={`${rows.length} of ${reports.length} reports`}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search code, address or text"
                  className="pl-9"
                />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="open">Open only</SelectItem>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={ward} onValueChange={setWard}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All wards</SelectItem>
                  {wards.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border-strong text-left">
                    {["Code", "Ward", "Category", "Urgency", "Status", "Filed", ""].map((head) => (
                      <th key={head} className="label-mono px-2 py-2">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((report) => (
                    <tr
                      key={report.id}
                      className={`border-b border-border/70 last:border-0 ${
                        report.id === openId ? "bg-secondary" : "hover:bg-secondary/60"
                      }`}
                    >
                      <td className="px-2 py-2 font-mono text-xs font-medium">{report.tracking_code}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{wardName.get(report.ward_id) ?? report.ward_id}</td>
                      <td className="px-2 py-2">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs capitalize"
                          style={{ color: CATEGORY_COLOR[report.category as Category] }}
                        >
                          <span
                            className="size-2 rounded-sm"
                            style={{ backgroundColor: CATEGORY_COLOR[report.category as Category] }}
                          />
                          {report.category}
                        </span>
                      </td>
                      <td className="px-2 py-2 font-mono text-xs tabular-nums">{report.urgency}/5</td>
                      <td className="px-2 py-2 text-xs capitalize">{report.status.replace("_", " ")}</td>
                      <td className="px-2 py-2 font-mono text-xs text-muted-foreground">
                        {new Date(report.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-2 py-2 text-right">
                        <Button size="sm" variant="secondary" onClick={() => openRow(report)}>
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-2 py-6 text-center text-sm text-muted-foreground">
                        {isLoading ? "Loading reports…" : "No reports match these filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>

        {active && (
          <Panel
            title={`Manage ${active.tracking_code}`}
            hint={`${wardName.get(active.ward_id) ?? active.ward_id} · ${active.category} · urgency ${active.urgency}/5`}
          >
            <div className="grid items-start gap-4 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-3 text-sm">
                <p className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span>
                    {active.address || "No address captured"}
                    <span className="block font-mono text-xs">
                      {active.lat.toFixed(5)}, {active.lng.toFixed(5)}
                    </span>
                  </span>
                </p>
                <p>{active.translated_text}</p>
                <p className="text-xs text-muted-foreground italic">{active.original_text}</p>
                <p className="label-mono">
                  {LANGUAGE_LABELS[active.language] ?? active.language} · {active.channel} · {active.sentiment}
                </p>
                <ImageGallery paths={active.image_paths} />
              </div>

              <div className="space-y-3 rounded-xl border border-border-strong bg-surface-2/50 p-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((option) => (
                      <Button
                        key={option.id}
                        size="sm"
                        variant={draftStatus === option.id ? "default" : "secondary"}
                        onClick={() => setDraftStatus(option.id)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-note">Note shown to the citizen</Label>
                  <Textarea
                    id="admin-note"
                    rows={3}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Tanker deployed today; pipeline repair scheduled Friday."
                  />
                </div>
                <Button onClick={() => void save()} disabled={!email || saving} className="w-full">
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  {saving ? "Saving…" : "Save update"}
                </Button>
                {!email && (
                  <p className="text-xs text-muted-foreground">Sign in as an official to save changes.</p>
                )}
              </div>
            </div>
          </Panel>
        )}

        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <ClipboardList className="size-3.5" /> Status changes are published instantly to the citizen's
          tracking page.
        </p>
      </div>
    </AppShell>
  );
}
