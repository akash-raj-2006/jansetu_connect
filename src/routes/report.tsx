import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Copy, Loader2, Mic, Square, Upload } from "lucide-react";
import { toast } from "sonner";
import { saveCode } from "@/lib/my-reports";
import { AppShell } from "@/components/jansetu/AppShell";
import { ClientOnly } from "@tanstack/react-router";
import { lazy } from "react";
import type { PickedLocation } from "@/components/jansetu/LocationMap";
import { ImageUploader } from "@/components/jansetu/ImageUploader";
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
import { submitReport } from "@/lib/jansetu.functions";
import { useReports, useWards } from "@/lib/use-jansetu-data";
import { CATEGORIES, LANGUAGES, LANGUAGE_LABELS, similarity, type Report } from "@/lib/jansetu";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report a civic issue in your language — JanSetu" },
      {
        name: "description",
        content:
          "File a water, road, electricity or sanitation complaint by voice note or text in Hindi, Marathi, English and more. AI classifies it and routes it to officials.",
      },
      { property: "og:title", content: "Report a civic issue in your language — JanSetu" },
      {
        property: "og:description",
        content: "Voice or text complaints in any Indian language, auto-classified and geo-tagged.",
      },
    ],
  }),
  component: ReportPage,
});

const LocationMap = lazy(() =>
  import("@/components/jansetu/LocationMap").then((m) => ({ default: m.LocationMap })),
);

function ReportPage() {
  const { data: wards = [] } = useWards();
  const { data: reports = [], refetch } = useReports();
  const submit = useServerFn(submitReport);

  const [language, setLanguage] = useState("auto");
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [pin, setPin] = useState<PickedLocation | null>(null);
  const [audio, setAudio] = useState<{ base64: string; format: string; url: string } | null>(null);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [recording, setRecording] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Report | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const countryWards = useMemo(() => wards.filter((w) => w.country === "IN"), [wards]);

  const similar = useMemo(() => {
    if (!result) return [];
    return reports
      .filter(
        (r) => r.id !== result.id && r.ward_id === result.ward_id && r.category === result.category,
      )
      .map((r) => ({ report: r, score: similarity(result.translated_text, r.translated_text) }))
      .filter((r) => r.score >= 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [result, reports]);

  async function toBase64(blob: Blob) {
    const buffer = await blob.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
    return btoa(binary);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        setAudio({
          base64: await toBase64(blob),
          format: (recorder.mimeType || "audio/webm").includes("mp4") ? "mp4" : "webm",
          url: URL.createObjectURL(blob),
        });
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      toast.error("Microphone unavailable. You can upload an audio file instead.");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  async function onUpload(file: File) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const format = ["wav", "mp3", "m4a", "mp4", "webm", "ogg", "aac", "flac"].includes(ext)
      ? ext
      : "wav";
    setAudio({ base64: await toBase64(file), format, url: URL.createObjectURL(file) });
  }

  async function onSubmit() {
    if (!pin) {
      toast.error("Pin the location on the map first.");
      return;
    }
    if (!text.trim() && !audio) {
      toast.error("Describe the problem or add a voice note.");
      return;
    }
    if (imagePaths.length === 0) {
      toast.error("Attach at least one photo of the issue.");
      return;
    }
    setPending(true);
    setResult(null);
    try {
      const response = await submit({
        data: {
          wardId: pin.wardId,
          lat: pin.lat,
          lng: pin.lng,
          text: text.trim() || undefined,
          audioBase64: audio?.base64,
          audioFormat: audio?.format,
          languageHint: language,
          channel: audio ? "voice" : "web",
          reporterName: name.trim() || undefined,
          address: pin.address,
          imagePaths,
        },
      });
      if (!response.ok) {
        toast.error(response.error);
        return;
      }
      setResult(response.report as unknown as Report);
      setText("");
      setAudio(null);
      setImagePaths([]);
      saveCode(response.report.tracking_code);
      toast.success(`Report filed · ${response.report.tracking_code}`);
      void refetch();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong sending the report.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AppShell
      title="File a report"
      subtitle="Speak or type in any language. JanSetu transcribes, translates, classifies category and urgency, and pins it to your ward."
    >
      <div className="max-w-6xl">
        <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
          <section className="sheet space-y-5 rounded-md p-5">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complaint">Describe the problem</Label>
              <Textarea
                id="complaint"
                rows={5}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="जैसे: हमारे इलाके में चार दिन से पानी नहीं आया है…"
              />
            </div>

            <div className="rounded-md border border-border/70 bg-surface-2/50 p-4">
              <div className="flex flex-wrap items-center gap-3">
                {recording ? (
                  <Button type="button" variant="destructive" onClick={stopRecording}>
                    <Square className="size-4" /> Stop recording
                  </Button>
                ) : (
                  <Button type="button" variant="secondary" onClick={startRecording}>
                    <Mic className="size-4" /> Record voice note
                  </Button>
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                  <Upload className="size-4" /> Upload audio
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void onUpload(file);
                    }}
                  />
                </label>
                {recording && (
                  <span className="flex items-center gap-2 text-sm text-destructive">
                    <span className="size-2 animate-pulse rounded-full bg-destructive" /> listening…
                  </span>
                )}
              </div>
              {audio && (
                <div className="mt-3 flex items-center gap-3">
                  <audio controls src={audio.url} className="h-9 w-full max-w-xs" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => setAudio(null)}>
                    Remove
                  </Button>
                </div>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                Voice works in any language — Gemini transcribes and translates it for officials.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Photo evidence</Label>
              <ImageUploader paths={imagePaths} onChange={setImagePaths} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your name (optional)</Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Anonymous"
              />
            </div>

            <Button
              onClick={onSubmit}
              disabled={pending || !pin || imagePaths.length === 0}
              className="w-full"
              size="lg"
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              {pending ? "Analysing with AI…" : "Submit report"}
            </Button>
            {(!pin || imagePaths.length === 0) && (
              <p className="text-xs text-muted-foreground">
                Required before submitting:{" "}
                {[imagePaths.length === 0 ? "at least one photo" : null, !pin ? "a map pin" : null]
                  .filter(Boolean)
                  .join(" and ")}
                .
              </p>
            )}
          </section>

          <section className="space-y-6">
            <div className="sheet rounded-md p-5">
              <h2 className="font-display text-lg font-semibold">Pin the exact location</h2>
              <p className="mb-3 text-xs text-muted-foreground">
                Search, tap or drag the pin on the live map. We confirm the street address and detect
                your ward automatically.
              </p>
              <ClientOnly
                fallback={
                  <div className="h-[340px] animate-pulse rounded-2xl border border-border bg-surface-2/60" />
                }
              >
                <LocationMap wards={countryWards} value={pin} onChange={setPin} />
              </ClientOnly>
            </div>

            {result && (
              <div className="sheet glow-primary space-y-4 rounded-md p-5">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="size-5" />
                  <h2 className="font-display text-lg font-semibold">Report filed</h2>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2">
                  <span className="font-mono text-lg font-semibold">{result.tracking_code}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      void navigator.clipboard.writeText(result.tracking_code);
                      toast.success("Tracking code copied");
                    }}
                  >
                    <Copy className="size-3.5" /> Copy
                  </Button>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Category</dt>
                    <dd className="capitalize">
                      {CATEGORIES.find((c) => c.id === result.category)?.label ?? result.category}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Urgency</dt>
                    <dd>{result.urgency}/5</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Detected language</dt>
                    <dd>{LANGUAGE_LABELS[result.language] ?? result.language}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Sentiment</dt>
                    <dd className="capitalize">{result.sentiment}</dd>
                  </div>
                </dl>
                <div className="space-y-1 text-sm">
                  <p className="text-xs text-muted-foreground">English translation for officials</p>
                  <p>{result.translated_text}</p>
                </div>
                {similar.length > 0 && (
                  <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
                    <p className="flex items-center gap-2 font-medium text-warning">
                      <AlertTriangle className="size-4" /> {similar.length} similar report(s)
                      already in this ward
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {similar.map(({ report, score }) => (
                        <li key={report.id}>
                          {report.tracking_code} · {Math.round(score * 100)}% match ·{" "}
                          {report.summary}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Clustered together — repeat voices raise the ward's priority score instead of
                      creating noise.
                    </p>
                  </div>
                )}
                <Link
                  to="/track"
                  search={{ code: result.tracking_code }}
                  className="inline-flex text-sm font-medium text-accent hover:underline"
                >
                  Track this report →
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
