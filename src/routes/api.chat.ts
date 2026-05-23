import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { message, history, preferredLanguage } = await request.json();
          const apiKey = process.env.GROQ_API_KEY;

          if (!apiKey) {
            return new Response(JSON.stringify({ error: "Groq API Key missing on server" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const systemPrompt = `You are LexAI, a legal aid assistant for Indian citizens. 
CRITICAL: Always respond in the same language the user writes in or the preferred language specified.
Support languages: Hindi, English, Hinglish, Telugu, Tamil, Marathi, Bengali, Kannada, Malayalam, Gujarati, Punjabi, and other Indian regional languages.
Keep responses short (under 120 words), friendly, and actionable. 
Never use legal jargon. Always end with one clear next step the user can take. 
You know Indian law deeply — Consumer Protection Act, Labour Law, RTI, IPC/BNSS, DPDPA, Rent Acts.
User's current preferred language: ${preferredLanguage || 'Auto-detect'}.`;

          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                { role: "system", content: systemPrompt },
                ...(history || []),
                { role: "user", content: message }
              ],
              max_tokens: 500,
              temperature: 0.7,
            }),
          });

          const data = await response.json();
          
          if (!response.ok) {
            return new Response(JSON.stringify({ error: data.error?.message || "Failed to call Groq" }), {
              status: response.status,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ 
            reply: data.choices[0].message.content,
          }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
