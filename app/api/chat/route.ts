import { GoogleGenAI } from "@google/genai";
import { products } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

function geminiError(error: unknown): { message: string; status: number } {
  const status = typeof (error as { status?: unknown })?.status === "number"
    ? (error as { status: number }).status
    : 502;
  if (status === 401 || status === 403) return { status, message: "Gemini rechazó la API key. Comprueba la key de Google AI Studio." };
  if (status === 429) return { status, message: "Gemini alcanzó el límite de solicitudes. Inténtalo nuevamente en un momento." };
  return { status, message: "Gemini no pudo procesar la consulta. Inténtalo nuevamente." };
}

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-gemini-api-key")?.trim();
  if (!apiKey) return Response.json({ error: "Configura tu API key de Gemini" }, { status: 401 });

  let messages: ChatMessage[];
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  } catch {
    return Response.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (!messages.length || messages.some((message) => !message.content || !["user", "assistant"].includes(message.role))) {
    return Response.json({ error: "Falta el mensaje" }, { status: 400 });
  }

  const catalog = products.map(({ name, category, price, stock, description }) =>
    `${name} | ${category} | $${price.toFixed(2)} | stock ${stock} | ${description}`,
  ).join("\n");

  try {
    const gemini = new GoogleGenAI({ apiKey });
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
      config: {
        systemInstruction: `Eres el asistente de compras de Nexo. Responde en español, de forma breve y útil. Recomienda únicamente productos del catálogo y no inventes características. Precios en USD.\n\nCATÁLOGO:\n${catalog}`,
        maxOutputTokens: 2048,
      },
    });
    const reply = response.text?.trim();
    return Response.json({ reply: reply || "No pude generar una respuesta." });
  } catch (error) {
    const { message, status } = geminiError(error);
    return Response.json({ error: message }, { status });
  }
}
