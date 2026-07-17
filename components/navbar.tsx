"use client";

import { KeyRound, Route, ShoppingBag } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  hasApiKey: boolean;
  onCart: () => void;
  onSettings: () => void;
}

export function Navbar({ cartCount, hasApiKey, onCart, onSettings }: NavbarProps) {
  return (
    <header className="sticky top-3 z-40 mx-auto w-[calc(100%-1.5rem)] max-w-7xl pt-3">
      <nav className="glass flex items-center justify-between rounded-full px-3 py-2 sm:px-5" aria-label="Navegación principal">
        <a href="#inicio" className="focus-ring flex items-center gap-2 rounded-full">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-acid text-ink"><Route size={19} strokeWidth={2.7} /></span>
          <span className="font-display text-lg font-extrabold tracking-tight">NEXO</span>
        </a>
        <div className="hidden items-center gap-7 text-sm font-semibold text-slate-300 md:flex">
          <a className="transition hover:text-white" href="#catalogo">Catálogo</a>
          <a className="transition hover:text-white" href="#rutas">Optimizador</a>
        </div>
        <div className="flex gap-2">
          <button type="button" className="icon-button relative" onClick={onSettings} aria-label="Configurar API key">
            <KeyRound size={18} />
            <span className={`absolute right-1 top-1 h-2 w-2 rounded-full ${hasApiKey ? "bg-acid" : "bg-amber-400"}`} />
          </button>
          <button type="button" className="focus-ring flex h-11 items-center gap-2 rounded-full bg-frost px-4 text-sm font-extrabold text-ink transition hover:bg-acid" onClick={onCart}>
            <ShoppingBag size={18} /><span className="hidden sm:inline">Carrito</span>
            <span className="grid min-w-5 place-items-center rounded-full bg-ink px-1.5 text-xs text-white">{cartCount}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

