// Server-only Lovable AI Gateway helpers for JanSetu.
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

type Part =
  | { type: "text"; text: string }
  | { type: "input_audio"; input_audio: { data: string; format: string } };

export type GatewayError = { status: number; message: string };

export class AiGatewayError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function chat(parts: Part[], system: string, jsonMode: boolean) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiGatewayError(401, "AI is not configured for this project.");

  const response = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: parts },
      ],
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text.slice(0, 400);
    try {
      const parsed = JSON.parse(text) as { error?: { message?: string }; message?: string };
      message = parsed.error?.message ?? parsed.message ?? message;
    } catch {
      /* keep raw text */
    }
    if (response.status === 429) message = "AI is rate limited right now. Please retry in a moment.";
    if (response.status === 402) message = message || "AI credits exhausted for this workspace.";
    throw new AiGatewayError(response.status, message);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

function extractJson(raw: string) {
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new AiGatewayError(502, "AI returned an unreadable response.");
  return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
}

export type Analysis = {
  language: string;
  originalText: string;
  translatedText: string;
  summary: string;
  category: string;
  urgency: number;
  sentiment: string;
  locationHint: string;
};

const ANALYST_SYSTEM = `You are JanSetu's civic intake analyst for municipal infrastructure complaints in Indian cities.
You receive a citizen complaint as text or as a voice note in any language (Hindi, Marathi, Bengali, Tamil, Telugu, Portuguese, English and more).
Return ONLY a JSON object with these keys:
"language": ISO 639-1 code of the citizen's language,
"original_text": faithful transcription in the original language (for text input, echo the input),
"translated_text": accurate English translation,
"summary": one neutral English sentence an official can scan (max 120 characters),
"category": one of water, roads, electricity, sanitation, other,
"urgency": integer 1-5 where 5 means danger to life, health or total service loss,
"sentiment": one of calm, neutral, concerned, frustrated, angry,
"location_hint": any place, landmark, street or ward named by the citizen, else "".
Never invent facts. If the audio has no intelligible speech, set original_text to "" and summary to "".`;

export async function analyzeComplaint(input: {
  text?: string | undefined;
  audioBase64?: string | undefined;
  audioFormat?: string | undefined;
  languageHint?: string | undefined;
}): Promise<Analysis> {
  const parts: Part[] = [];
  const hint =
    input.languageHint && input.languageHint !== "auto"
      ? `The citizen selected language code: ${input.languageHint}.`
      : "Detect the language yourself.";
  parts.push({ type: "text", text: `${hint}\nAnalyse this complaint and return the JSON object.` });

  if (input.audioBase64) {
    parts.push({
      type: "input_audio",
      input_audio: { data: input.audioBase64, format: input.audioFormat || "wav" },
    });
    if (input.text) parts.push({ type: "text", text: `Extra typed context: ${input.text}` });
  } else if (input.text) {
    parts.push({ type: "text", text: `Complaint: ${input.text}` });
  }

  const raw = await chat(parts, ANALYST_SYSTEM, true);
  const json = extractJson(raw);

  const str = (key: string, fallback = "") => {
    const value = json[key];
    return typeof value === "string" ? value.trim() : fallback;
  };
  const allowedCategories = ["water", "roads", "electricity", "sanitation", "other"];
  const category = str("category", "other").toLowerCase();
  const urgencyRaw = Number(json["urgency"]);
  const original = str("original_text", input.text ?? "");
  const translated = str("translated_text", original);

  return {
    language: str("language", input.languageHint === "auto" ? "en" : (input.languageHint ?? "en")),
    originalText: original,
    translatedText: translated || original,
    summary: str("summary", translated.slice(0, 118)),
    category: allowedCategories.includes(category) ? category : "other",
    urgency: Number.isFinite(urgencyRaw) ? Math.min(5, Math.max(1, Math.round(urgencyRaw))) : 3,
    sentiment: str("sentiment", "neutral").toLowerCase(),
    locationHint: str("location_hint"),
  };
}

export async function generatePolicyBrief(context: string) {
  const system = `You are a policy analyst writing for a municipal commissioner.
Write a decision-ready brief in GitHub-flavoured markdown with exactly these sections:
## Situation
## Evidence from citizen reports
## Recommended intervention
## Indicative cost & timeline
## Risk if deferred
Be concrete, cite report counts and demographics given to you, use rupee/currency-neutral phrasing like "approx. 1.2 crore equivalent" only when plausible, and keep the whole brief under 320 words. No preamble.`;
  return chat([{ type: "text", text: context }], system, false);
}
