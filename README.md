# JanSetu — जनसेतु

**An AI bridge between citizen voice and civic action.**

JanSetu lets any citizen report an infrastructure problem — in their own language, by voice or text, with photos and an exact map pin — and turns those reports into ranked, decision-ready intelligence for municipal officials.

---

## The problem

Infrastructure complaints (water, roads, electricity, sanitation) are scattered across phone calls, walk-ins, disconnected portals and social media. There is almost no coverage for regional-language and low-literacy users. Officials cannot see where demand actually concentrates, budgets stay reactive instead of data-driven, and citizens never learn what happened to their complaint.

## The solution

One multilingual intake pipe → AI structuring → geo-clustered demand hotspots → a Priority Score officials can defend → a policy brief → a status update back to the citizen.

```
Citizen (voice / text, any Indian language)
        ↓
AI intake: transcribe → translate → classify (category, urgency, sentiment) → extract location
        ↓
Geo-tagged report with photos, lat/lng and formatted address
        ↓
Hotspot clustering + Priority Score ranking
        ↓
Official dashboard: charts, SLA view, AI policy brief, status workflow
        ↓
Citizen tracks the case with a unique code
```

---

## Features

### For citizens
- **Voice or text reports in any Indian language** — a voice note is transcribed, translated and understood automatically.
- **Automatic classification** — category (water / roads / electricity / sanitation / other), urgency 1–5, sentiment, and a one-line English summary for officials.
- **Real map pinning** — search an address with autocomplete, drag the pin to the exact spot, or tap "Use my location". The reverse-geocoded address is confirmed and stored with lat/lng.
- **Photo evidence** — up to 3 images per report with drag-and-drop, camera capture, client-side resizing, validation and per-image upload progress.
- **Track my case** — every report returns a unique case code; the tracking page also remembers reports filed on that device.
- **Setu Sahayak helpdesk chatbot** — a floating AI assistant on every page that answers questions about filing, tracking, the Priority Score and official sign-in.
- **Light / dark ("space") theme** with an accessible, high-contrast palette and a persisted preference.

### For officials
- **Separate `/admin` portal behind a login gate** — no self-signup for staff; roles are `super_admin`, `department_admin` and `field_officer`, verified server-side.
- **Login audit trail** for official sign-in attempts.
- **Reports console** — filter by ward, category, urgency and status; open a detail view with images, location, translation and internal notes.
- **Status workflow** — move cases through the resolution lifecycle with notes attached.
- **Policy data dashboard** — priority bars, category donut, trend area chart and a numeric heat grid, plus KPI summaries.
- **AI policy briefs** — one click generates a commissioner-ready brief (situation, evidence, recommended intervention, indicative cost and timeline, risk if deferred).

### The Priority Score engine

```
Priority = (report volume × urgency weight) + (residents affected ÷ infrastructure score)
```

The overview page includes an **interactive explainer** where anyone can move the sliders and watch the score change — the ranking is transparent, not a black box.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | TanStack Start (React 19, Vite 7, SSR + server functions) |
| Styling | Tailwind CSS v4 with semantic `oklch` design tokens |
| UI | shadcn/ui, AI Elements, Lucide icons |
| Charts | Custom SVG chart set (no 3D dependency) |
| Maps | Leaflet + OpenStreetMap, Nominatim geocoding |
| Backend | Lovable Cloud (Postgres, Auth, Storage) with row-level security |
| AI | Lovable AI Gateway → Gemini 3.7 Flash (multimodal audio + text) |

### Data model (core tables)
- `wards` — Indian wards with population and infrastructure scores
- `reports` — citizen submissions: original + translated text, category, urgency, sentiment, coordinates, address, image paths, status
- `hotspot_briefs` — generated policy briefs per hotspot
- `user_roles` — official roles, kept in a dedicated table and checked through a security-definer function
- `admin_login_audit` — official sign-in log

### Notable design points
- Every public table has explicit `GRANT`s plus RLS policies; roles are never stored on a profile row.
- Report images live in a private storage bucket and are shown through short-lived signed URLs.
- All AI calls and secrets stay server-side; the browser never sees an API key.

---

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Overview — mission, problem/solution, live civic pulse, Priority Score explainer |
| `/report` | File a report: voice/text, map pin, photos |
| `/track` | Track a case by code, plus reports from this device |
| `/dashboard` | Public policy data: charts and hotspot rankings |
| `/admin/login` | Official sign-in |
| `/admin` | Official console: reports, status workflow, notes, KPIs |

---

## Running locally

```bash
bun install
bun run dev      # http://localhost:8080
```

Backend environment variables (Supabase URL/keys and `LOVABLE_API_KEY`) are provisioned automatically by Lovable Cloud.

---

JanSetu is built as a **digital public good prototype** for citizen-to-policy infrastructure feedback.
