"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  wide?: boolean;
}

export function Modal({ open, onClose, title, eyebrow, children, wide = false }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020914]/75 p-4 backdrop-blur-md" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
        className={`glass max-h-[92vh] w-full overflow-y-auto rounded-[2rem] p-5 sm:p-7 ${wide ? "max-w-5xl" : "max-w-xl"}`}
      >
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-[.24em] text-cyan">{eyebrow}</p>}
            <h2 id="modal-title" className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
          </div>
          <button type="button" className="icon-button shrink-0" onClick={onClose} aria-label="Cerrar modal"><X size={19} /></button>
        </header>
        {children}
      </section>
    </div>
  );
}

