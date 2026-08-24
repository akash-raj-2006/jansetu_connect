import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are "Setu Sahayak", the helpdesk assistant for JanSetu — an Indian civic platform that turns citizen infrastructure complaints into ranked, data-driven priorities for city officials.

What you know about JanSetu:
- Citizens file reports by voice note or text in ANY Indian language (Hindi, Marathi, Bengali, Tamil, Telugu, English and more) at /report. AI transcribes, translates and classifies each report.
- Each report gets a category (water, roads, electricity, sanitation, other), an urgency score 1-5 and a sentiment reading.
- Reports need a pinned location on the map (drag the pin, search an address, or tap "Use my location") plus up to 3 photos.
- After submitting, the citizen gets a case code. They can check progress any time at /track — recent case codes filed on that device are listed there automatically.
- Statuses move: submitted -> acknowledged -> in progress -> resolved. Officials can add a citizen-facing note.
- /dashboard shows public policy data: demand hotspots, category mix, trends and Priority Score rankings.
- Priority Score = (report volume x urgency weight) + (residents affected / infrastructure score). Higher score = the ward needs attention sooner.
- Government staff sign in separately at /admin/login. There is no self-signup for officials; a super admin creates accounts.

How to answer:
- Be warm, brief and practical. 2-5 sentences or a short bullet list. No long essays.
- Reply in the language the user writes in (Hindi, Hinglish, etc.).
- Guide people to the right page and explain what to do next.
- You cannot look up a specific case code, file a report, or change a status yourself — point the user to /report or /track instead.
- Never invent statistics, deadlines, phone numbers or government policies. If you don't know, say so.
- For emergencies (fire, medical, gas leak, live wire, collapse) tell the user to call the official emergency services immediately, then file a report.`;

type IncomingMessage = { role?: string; content?: string; text?: string };

function getFallbackAnswer(userText: string): string {
  const query = userText.toLowerCase();
  if (
    query.includes("report") ||
    query.includes("file") ||
    query.includes("complaint") ||
    query.includes("शिकायत") ||
    query.includes("मदद")
  ) {
    return "Namaste! To file a civic complaint, head to the /report page. You can record a voice note in any Indian language or type your issue, pin your exact location on the map, and attach up to 3 photos. You will instantly get a unique tracking code!";
  }
  if (
    query.includes("track") ||
    query.includes("code") ||
    query.includes("status") ||
    query.includes("ट्रैक")
  ) {
    return "You can track your report status anytime on the /track page. Simply enter your 8-character case code (e.g. JS-X1Y2Z3). Reports filed on your current device are also remembered there automatically!";
  }
  if (
    query.includes("score") ||
    query.includes("priority") ||
    query.includes("formula") ||
    query.includes("calculate") ||
    query.includes("स्कोर")
  ) {
    return "JanSetu calculates the Priority Score as: Priority = (report volume × urgency weight) + (residents affected ÷ infrastructure score). Wards with higher scores are prioritized for fast resolution by city officials!";
  }
  if (
    query.includes("admin") ||
    query.includes("login") ||
    query.includes("official") ||
    query.includes("staff")
  ) {
    return "Municipal officials can log in at /admin/login to view public complaints, update resolution status, and generate AI policy briefs. Official accounts are created by a super admin.";
  }
  return "Namaste! I am Setu Sahayak, your JanSetu civic assistant. I can guide you on filing reports (/report), tracking progress (/track), or understanding public civic priority scores (/dashboard). What can I help you with today?";
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let messages: IncomingMessage[] = [];
        try {
          const body = (await request.json()) as { messages?: IncomingMessage[] };
          messages = Array.isArray(body.messages) ? body.messages : [];
        } catch {
          messages = [];
        }

        const lastMsg = messages[messages.length - 1];
        const userQuery = lastMsg?.content || lastMsg?.text || "";
        const fallbackReply = getFallbackAnswer(userQuery);

        const lovableKey = process.env["LOVABLE_API_KEY"];
        const geminiKey = process.env["GEMINI_API_KEY"];
        const openaiKey = process.env["OPENAI_API_KEY"];
        const activeKey = (lovableKey || geminiKey || openaiKey || "").trim();

        if (activeKey) {
          try {
            let endpoint = "https://ai.gateway.lovable.dev/v1/chat/completions";
            let modelName = "google/gemini-3.7-flash";
            const headers: Record<string, string> = {
              "Content-Type": "application/json",
            };

            if (lovableKey || activeKey.startsWith("AQ.")) {
              endpoint = "https://ai.gateway.lovable.dev/v1/chat/completions";
              headers["Lovable-API-Key"] = activeKey;
              headers["X-Lovable-AIG-SDK"] = "fetch";
              modelName = "google/gemini-3.7-flash";
            } else if (activeKey.startsWith("AIzaSy")) {
              endpoint =
                "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
              headers["Authorization"] = `Bearer ${activeKey}`;
              modelName = "gemini-2.0-flash";
            } else if (activeKey.startsWith("sk-")) {
              endpoint = "https://api.openai.com/v1/chat/completions";
              headers["Authorization"] = `Bearer ${activeKey}`;
              modelName = "gpt-4o-mini";
            }

            const formattedMessages = [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.map((m) => ({
                role: m.role || "user",
                content: m.content || m.text || "",
              })),
            ];

            const response = await fetch(endpoint, {
              method: "POST",
              headers,
              body: JSON.stringify({
                model: modelName,
                messages: formattedMessages,
              }),
            });

            if (response.ok) {
              const data = (await response.json()) as {
                choices?: { message?: { content?: string } }[];
              };
              const aiReply = data.choices?.[0]?.message?.content?.trim();
              if (aiReply) {
                return Response.json({ reply: aiReply });
              }
            }
          } catch (err) {
            console.error("AI gateway completion failed, using fallback:", err);
          }
        }

        return Response.json({ reply: fallbackReply });
      },
    },
  },
});


