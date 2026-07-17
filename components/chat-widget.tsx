"use client";

import { Bot, KeyRound, LoaderCircle, MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

interface ChatWidgetProps { apiKey: string; onSettings: () => void; }

export function ChatWidget({ apiKey, onSettings }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Hola, soy Nexo. Puedo comparar productos y ayudarte a elegir." }]);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || loading || !apiKey) return;
    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json", "x-openai-api-key": apiKey }, body: JSON.stringify({ messages: nextMessages }) });
      const data = (await response.json()) as { reply?: string; error?: string };
      setMessages((current) => [...current, { role: "assistant", content: response.ok ? data.reply ?? "Sin respuesta." : data.error ?? "Ocurrió un error." }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "No pude conectar con el asistente. Inténtalo nuevamente." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      {open && (
        <section className="glass mb-3 flex h-[min(570px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-[2rem]" aria-label="Asistente de compras">
          <header className="flex items-center justify-between border-b border-white/10 p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-acid text-ink"><Bot size={19} /></span><div><p className="font-display font-bold">Nexo AI</p><p className="text-[11px] text-acid">Asistente de catálogo</p></div></div><button className="icon-button h-9 w-9" onClick={() => setOpen(false)} aria-label="Cerrar chat"><X size={17} /></button></header>
          {!apiKey ? (
            <div className="grid flex-1 place-items-center p-7 text-center"><div><span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-300"><KeyRound /></span><h3 className="font-display text-xl font-bold">Configura tu API key</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">Añade tu clave de OpenAI para conversar con el asistente.</p><button className="primary-button mt-5" onClick={onSettings}>Abrir configuración</button></div></div>
          ) : (
            <><div className="no-scrollbar flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">{messages.map((message, index) => <div key={index} className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "ml-auto rounded-br-md bg-acid text-ink" : "glass-soft rounded-bl-md text-slate-200"}`}>{message.content}</div>)}{loading && <div className="glass-soft flex w-fit items-center gap-2 rounded-2xl px-4 py-3 text-sm text-slate-400"><LoaderCircle size={15} className="animate-spin" /> Pensando</div>}<div ref={bottomRef} /></div><form onSubmit={send} className="flex gap-2 border-t border-white/10 p-3"><input className="field min-w-0 rounded-full py-2.5" value={input} onChange={(event) => setInput(event.target.value)} placeholder="¿Qué me recomiendas?" aria-label="Mensaje" /><button type="submit" disabled={!input.trim() || loading} className="icon-button shrink-0 bg-acid text-ink hover:bg-[#c8ff83]" aria-label="Enviar mensaje"><Send size={17} /></button></form></>
          )}
        </section>
      )}
      <button type="button" onClick={() => setOpen((value) => !value)} className="focus-ring ml-auto flex h-14 items-center gap-3 rounded-full border border-white/20 bg-[#eafcff] px-5 font-extrabold text-ink shadow-[0_18px_50px_rgba(0,0,0,.35)] transition hover:-translate-y-1 hover:bg-acid" aria-label={open ? "Cerrar asistente" : "Abrir asistente"}><MessageCircle size={20} /><span className="text-sm">Pregúntale a Nexo</span></button>
    </div>
  );
}
