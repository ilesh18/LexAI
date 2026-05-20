import { createServerFn } from "@tanstack/react-start";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `
You are LexAI, a professional and empathetic legal aid assistant for Indian citizens.
Your goal is to provide clear, accessible legal information and aid.

Supported Languages: English, Hindi, Hinglish, and regional Indian languages.
Respond in the language the user uses, or in Hinglish if they use a mix.

Scope: LEGAL AID ONLY.
- If the user asks about anything unrelated to legal aid (e.g., recipes, jokes, general knowledge, tech support), politely decline and remind them that you are a dedicated legal aid assistant.
- Provide information about Indian laws, rights, and legal procedures (IPC, BNSS, Consumer Protection, Labour Law, etc.).
- Suggest next steps like generating documents or seeking a lawyer if appropriate.
- ALWAYS include a disclaimer that you are an AI, not a lawyer, and your advice is for informational purposes only.

Tone: Professional, supportive, and authoritative yet accessible. Use serif fonts formatting for legal sections if possible (via markdown).
`.trim();


export const chatWithGroq = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const messages = ctx.data as { role: "user" | "assistant" | "system"; content: string }[];
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.5,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as any;
      throw new Error(errorData.error?.message || "Failed to call Groq API");
    }

    return response.json();
  });

const ANALYZER_SYSTEM_PROMPT = `
You are LexAI's Situation Analyzer, an elite AI legal assistant.
Analyze the user's legal situation and return a precise, structured legal analysis in JSON.

Structure:
{
  "languageDetected": "string",
  "legalDomain": "string",
  "keyFacts": ["fact 1", "fact 2"],
  "relevantLaws": [{"law": "name", "explanation": "how it applies"}],
  "suggestedActions": ["action 1", "action 2"],
  "riskLevel": "Low" | "Medium" | "High",
  "riskExplanation": "why"
}
`.trim();

const RIGHTS_ENGINE_PROMPT = `
You are LexAI's Know Your Rights Engine — a specialized Indian legal rights advisor.
Identify EXACTLY which Indian laws protect the user. Return ONLY JSON.

Structure:
{
  "legalDomain": "string",
  "situationSummary": "string",
  "rightsOverview": "string",
  "laws": [
    {
      "id": number,
      "name": "Full Official Act Name, Year",
      "shortName": "abbreviation",
      "sections": ["Section X"],
      "relevance": "primary | secondary | indirect",
      "protection": "One sentence summary",
      "plainExplanation": "2-3 sentences explaining it simply",
      "keyRights": ["right 1", "right 2"],
      "penalty": "penalty details"
    }
  ],
  "timeLimit": { "exists": boolean, "duration": "string", "warning": "string" },
  "immediateActions": ["action 1", "action 2"],
  "strengthOfCase": "strong | moderate | weak",
  "strengthReason": "why",
  "importantWarning": "critical warning or null"
}
`.trim();

export const analyzeLegalSituation = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const messages = ctx.data as { role: "user" | "assistant"; content: string }[];
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: ANALYZER_SYSTEM_PROMPT }, ...messages],
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });
    return response.json();
  });

export const getLegalRights = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const messages = ctx.data as { role: "user" | "assistant"; content: string }[];
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: RIGHTS_ENGINE_PROMPT }, ...messages],
        temperature: 0.4,
        response_format: { type: "json_object" }
      }),
    });
    return response.json();
  });

export const transcribeAudio = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const formData = ctx.data as FormData;
    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = (await response.json()) as any;
      throw new Error(errorData.error?.message || "Failed to transcribe audio");
    }

    return response.json();
  });

