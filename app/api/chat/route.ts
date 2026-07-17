import { products } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

function extractText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const data = payload as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };
  if (data.output_text) return data.output_text;
  return (data.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text")
    .map((item) => item.text ?? "")
    .join("\n");
}

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-openai-api-key")?.trim();
  if (!apiKey) return Response.json({ error: "Configura tu API key" }, { status: 401 });

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
    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        instructions: `Eres el asistente de compras de Nexo. Responde en español, de forma breve y útil. Recomienda únicamente productos del catálogo y no inventes características. Precios en USD.\n\nCATÁLOGO:\n${catalog}`,
        // Las cadenas conservan correctamente el rol de los turnos anteriores,
        // incluidos los mensajes generados por el asistente.
        input: messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        max_output_tokens: 350,
      }),
      cache: "no-store",
    });

    const payload = await openAIResponse.json();
    if (!openAIResponse.ok) {
      const errorMessage = payload?.error?.message ?? "OpenAI no pudo procesar la solicitud";
      return Response.json({ error: errorMessage }, { status: openAIResponse.status });
    }

    const reply = extractText(payload);
    return Response.json({ reply: reply || "No pude generar una respuesta." });
  } catch {
    return Response.json({ error: "No fue posible conectar con OpenAI" }, { status: 502 });
  }
}
