import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function getAiModelConfig() {
  const rawKey =
    process.env["LOVABLE_API_KEY"] ||
    process.env["GEMINI_API_KEY"] ||
    process.env["OPENAI_API_KEY"];

  if (!rawKey) return null;
  const apiKey = rawKey.trim();

  // 1. Lovable AI Gateway Key (starts with AQ. or LOVABLE_API_KEY set)
  if (process.env["LOVABLE_API_KEY"] || apiKey.startsWith("AQ.")) {
    const provider = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: {
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
    });
    return { provider, modelName: "google/gemini-3.7-flash" };
  }

  // 2. Google Gemini API Key (starts with AIzaSy)
  if (apiKey.startsWith("AIzaSy")) {
    const provider = createOpenAICompatible({
      name: "google-gemini",
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return { provider, modelName: "gemini-2.0-flash" };
  }

  // 3. OpenAI API Key (starts with sk-)
  if (apiKey.startsWith("sk-")) {
    const provider = createOpenAICompatible({
      name: "openai",
      baseURL: "https://api.openai.com/v1",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return { provider, modelName: "gpt-4o-mini" };
  }

  // Default to Lovable AI Gateway for other keys
  const provider = createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
  return { provider, modelName: "google/gemini-3.7-flash" };
}

/** Server-only provider for the Lovable AI Gateway (legacy signature compatibility). */
export function createLovableAiGatewayProvider(apiKey: string) {
  const config = getAiModelConfig();
  if (config) return config.provider;
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

