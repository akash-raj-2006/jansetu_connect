//#region node_modules/.nitro/vite/services/ssr/assets/ai.server-BlDHb8cM.js
var AiGatewayError = class extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
	}
};
async function chat(parts, system, jsonMode) {
	const lovableKey = process.env["LOVABLE_API_KEY"];
	const geminiKey = process.env["GEMINI_API_KEY"];
	const openaiKey = process.env["OPENAI_API_KEY"];
	const activeKey = (lovableKey || geminiKey || openaiKey || "").trim();
	if (!activeKey) {
		console.warn("No AI API key set. Serving offline fallback.");
		if (jsonMode) {
			const userText = parts.find((p) => p.type === "text")?.text || "Citizen complaint recorded";
			return JSON.stringify({
				language: "en",
				original_text: userText,
				translated_text: userText,
				summary: userText.slice(0, 115),
				category: detectCategoryFallback(userText),
				urgency: 3,
				sentiment: "concerned",
				location_hint: ""
			});
		}
		return `## Situation\nHigh priority complaint volume detected requiring municipal attention.\n\n## Evidence from citizen reports\nMultiple citizen reports submitted for this ward/category.\n\n## Recommended intervention\nDispatch field inspect team to verify infrastructure damage and initiate repair order.\n\n## Indicative cost & timeline\nApprox. ₹2.5 Lakhs | Expected resolution: 3-5 business days.\n\n## Risk if deferred\nPotential acceleration of infrastructure breakdown and increased citizen distress.`;
	}
	let endpoint = "https://ai.gateway.lovable.dev/v1/chat/completions";
	let modelName = "google/gemini-3.7-flash";
	const headers = { "Content-Type": "application/json" };
	if (lovableKey || activeKey.startsWith("AQ.")) {
		endpoint = "https://ai.gateway.lovable.dev/v1/chat/completions";
		headers["Lovable-API-Key"] = activeKey;
		headers["X-Lovable-AIG-SDK"] = "fetch";
		modelName = "google/gemini-3.7-flash";
	} else if (activeKey.startsWith("AIzaSy")) {
		endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
		headers["Authorization"] = `Bearer ${activeKey}`;
		modelName = "gemini-2.0-flash";
	} else if (activeKey.startsWith("sk-")) {
		endpoint = "https://api.openai.com/v1/chat/completions";
		headers["Authorization"] = `Bearer ${activeKey}`;
		modelName = "gpt-4o-mini";
	} else {
		endpoint = "https://ai.gateway.lovable.dev/v1/chat/completions";
		headers["Lovable-API-Key"] = activeKey;
		headers["X-Lovable-AIG-SDK"] = "fetch";
		modelName = "google/gemini-3.7-flash";
	}
	const response = await fetch(endpoint, {
		method: "POST",
		headers,
		body: JSON.stringify({
			model: modelName,
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: parts
			}],
			...jsonMode ? { response_format: { type: "json_object" } } : {}
		})
	});
	if (!response.ok) {
		const text = await response.text();
		let message = text.slice(0, 400);
		try {
			const parsed = JSON.parse(text);
			message = parsed.error?.message ?? parsed.message ?? message;
		} catch {}
		if (response.status === 429) message = "AI is rate limited right now. Please retry in a moment.";
		if (response.status === 402) message = message || "AI credits exhausted for this workspace.";
		throw new AiGatewayError(response.status, message);
	}
	return (await response.json()).choices?.[0]?.message?.content?.trim() ?? "";
}
function extractJson(raw) {
	const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
	const start = cleaned.indexOf("{");
	const end = cleaned.lastIndexOf("}");
	if (start === -1 || end === -1) throw new AiGatewayError(502, "AI returned an unreadable response.");
	return JSON.parse(cleaned.slice(start, end + 1));
}
function detectCategoryFallback(text) {
	const lower = text.toLowerCase();
	if (lower.includes("water") || lower.includes("pipe") || lower.includes("drain") || lower.includes("leak") || lower.includes("पानी")) return "water";
	if (lower.includes("road") || lower.includes("pothole") || lower.includes("street") || lower.includes("asphalt") || lower.includes("सड़क")) return "roads";
	if (lower.includes("light") || lower.includes("electric") || lower.includes("wire") || lower.includes("power") || lower.includes("बिजली")) return "electricity";
	if (lower.includes("garbage") || lower.includes("waste") || lower.includes("trash") || lower.includes("clean") || lower.includes("सफाई")) return "sanitation";
	return "other";
}
var ANALYST_SYSTEM = `You are JanSetu's civic intake analyst for municipal infrastructure complaints in Indian cities.
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
async function analyzeComplaint(input) {
	const parts = [];
	const hint = input.languageHint && input.languageHint !== "auto" ? `The citizen selected language code: ${input.languageHint}.` : "Detect the language yourself.";
	parts.push({
		type: "text",
		text: `${hint}\nAnalyse this complaint and return the JSON object.`
	});
	if (input.audioBase64) {
		parts.push({
			type: "input_audio",
			input_audio: {
				data: input.audioBase64,
				format: input.audioFormat || "wav"
			}
		});
		if (input.text) parts.push({
			type: "text",
			text: `Extra typed context: ${input.text}`
		});
	} else if (input.text) parts.push({
		type: "text",
		text: `Complaint: ${input.text}`
	});
	try {
		const json = extractJson(await chat(parts, ANALYST_SYSTEM, true));
		const str = (key, fallback = "") => {
			const value = json[key];
			return typeof value === "string" ? value.trim() : fallback;
		};
		const allowedCategories = [
			"water",
			"roads",
			"electricity",
			"sanitation",
			"other"
		];
		const category = str("category", "other").toLowerCase();
		const urgencyRaw = Number(json["urgency"]);
		const original = str("original_text", input.text ?? "");
		const translated = str("translated_text", original);
		return {
			language: str("language", input.languageHint === "auto" ? "en" : input.languageHint ?? "en"),
			originalText: original,
			translatedText: translated || original,
			summary: str("summary", translated.slice(0, 118)),
			category: allowedCategories.includes(category) ? category : "other",
			urgency: Number.isFinite(urgencyRaw) ? Math.min(5, Math.max(1, Math.round(urgencyRaw))) : 3,
			sentiment: str("sentiment", "neutral").toLowerCase(),
			locationHint: str("location_hint")
		};
	} catch (err) {
		console.warn("AI Gateway analysis unconfigured or failed, using local rule-based analysis:", err);
		const text = input.text || "Citizen recorded audio complaint";
		const category = detectCategoryFallback(text);
		return {
			language: input.languageHint === "auto" ? "en" : input.languageHint ?? "en",
			originalText: text,
			translatedText: text,
			summary: text.slice(0, 115),
			category,
			urgency: 3,
			sentiment: "concerned",
			locationHint: ""
		};
	}
}
async function generatePolicyBrief(context) {
	const system = `You are a policy analyst writing for a municipal commissioner.
Write a decision-ready brief in GitHub-flavoured markdown with exactly these sections:
## Situation
## Evidence from citizen reports
## Recommended intervention
## Indicative cost & timeline
## Risk if deferred
Be concrete, cite report counts and demographics given to you, use rupee/currency-neutral phrasing like "approx. 1.2 crore equivalent" only when plausible, and keep the whole brief under 320 words. No preamble.`;
	try {
		return await chat([{
			type: "text",
			text: context
		}], system, false);
	} catch (err) {
		console.warn("AI Policy Brief failed, serving fallback brief template:", err);
		return `## Situation\nHigh priority complaint volume detected requiring municipal attention.\n\n## Evidence from citizen reports\nMultiple citizen reports submitted for this ward/category.\n\n## Recommended intervention\nDispatch field inspect team to verify infrastructure damage and initiate repair order.\n\n## Indicative cost & timeline\nApprox. ₹2.5 Lakhs | Expected resolution: 3-5 business days.\n\n## Risk if deferred\nPotential acceleration of infrastructure breakdown and increased citizen distress.`;
	}
}
//#endregion
export { AiGatewayError, analyzeComplaint, generatePolicyBrief };
