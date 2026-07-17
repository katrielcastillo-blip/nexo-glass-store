"use client";

import { Modal } from "@/components/modal";
import { Check, Eye, EyeOff, KeyRound, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

interface SettingsModalProps {
  open: boolean;
  apiKey: string;
  onClose: () => void;
  onSave: (key: string) => void;
}

export function SettingsModal({ open, apiKey, onClose, onSave }: SettingsModalProps) {
  const [draft, setDraft] = useState(apiKey);
  const [visible, setVisible] = useState(false);
  const isGoogleAiStudioKey = draft.trim().startsWith("AIza");
  useEffect(() => setDraft(apiKey), [apiKey, open]);
  const submit = (event: FormEvent) => { event.preventDefault(); onSave(draft.trim()); onClose(); };
  return (
    <Modal open={open} onClose={onClose} title="Configuración" eyebrow="Asistente de compras">
      <form onSubmit={submit}>
        <div className="mb-5 flex gap-4 rounded-3xl border border-cyan/20 bg-cyan/[.06] p-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cyan/10 text-cyan"><KeyRound size={20} /></span><div><p className="font-bold">Tu clave permanece en esta pestaña</p><p className="mt-1 text-xs leading-relaxed text-slate-400">Se guarda únicamente en el estado de React. Se envía al route handler en cada consulta y desaparece al recargar o cerrar la página.</p></div></div>
        <label className="block"><span className="mb-2 block text-sm font-bold">API key de OpenAI</span><div className="relative"><input className="field pr-12" type={visible ? "text" : "password"} autoComplete="off" spellCheck={false} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="sk-..." /><button type="button" className="focus-ring absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white" onClick={() => setVisible((value) => !value)} aria-label={visible ? "Ocultar API key" : "Mostrar API key"}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
        {isGoogleAiStudioKey && <p role="alert" className="mt-3 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm leading-relaxed text-amber-100">Detectamos una key de Google AI Studio (<code>AIza…</code>). Esta aplicación usa OpenAI: pega una key creada en platform.openai.com, no una key de Gemini.</p>}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {apiKey && <button type="button" onClick={() => { onSave(""); setDraft(""); onClose(); }} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-400/10"><Trash2 size={16} /> Quitar key</button>}
          <button type="submit" disabled={!draft.trim() || isGoogleAiStudioKey} className="primary-button"><Check size={17} /> Guardar en sesión</button>
        </div>
      </form>
    </Modal>
  );
}
