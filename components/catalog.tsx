"use client";

import { categories, products } from "@/lib/products";
import { CartItem, Product } from "@/types/store";
import { ArrowUpRight, Check, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

interface CatalogProps {
  cart: CartItem[];
  onAdd: (product: Product) => void;
}

export function Catalog({ cart, onAdd }: CatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Todos");
  const filtered = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "Todos" || product.category === category;
    const term = query.toLocaleLowerCase("es");
    return matchesCategory && (product.name.toLocaleLowerCase("es").includes(term) || product.description.toLocaleLowerCase("es").includes(term));
  }), [query, category]);

  return (
    <section id="catalogo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.26em] text-acid">Selección esencial · 2026</p>
          <h2 className="max-w-2xl font-display text-4xl font-bold leading-[1.02] sm:text-5xl">Diseño que trabaja<br />a tu ritmo.</h2>
        </div>
        <label className="glass-soft flex w-full items-center gap-3 rounded-full px-4 py-3 lg:max-w-sm">
          <Search size={18} className="text-cyan" />
          <span className="sr-only">Buscar productos</span>
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en el catálogo" />
        </label>
      </div>

      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar por categoría">
        {categories.map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)} className={`focus-ring whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition ${category === item ? "border-acid bg-acid text-ink" : "border-white/15 bg-white/[.05] text-slate-300 hover:bg-white/10"}`}>{item}</button>
        ))}
      </div>

      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, index) => {
            const quantity = cart.find((item) => item.id === product.id)?.quantity ?? 0;
            return (
              <article key={product.id} style={{ animationDelay: `${index * 55}ms` }} className="glass-soft group animate-reveal overflow-hidden rounded-[1.75rem] p-3 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-glow">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.3rem] bg-[#0b1c2f]">
                  <Image src={product.image} alt={`Imagen de referencia de ${product.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-[#07111f]/65 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-xl">{product.category}</span>
                  <span className="absolute bottom-3 right-3 h-3 w-3 rounded-full shadow-[0_0_18px_currentColor]" style={{ backgroundColor: product.accent, color: product.accent }} />
                </div>
                <div className="p-3 pb-2 pt-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl font-bold leading-tight">{product.name}</h3>
                    <ArrowUpRight size={18} className="shrink-0 text-slate-500 transition group-hover:text-acid" />
                  </div>
                  <p className="min-h-10 text-sm leading-relaxed text-slate-400">{product.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <div><p className="font-display text-xl font-bold">${product.price.toFixed(2)}</p><p className="text-[11px] text-slate-500">{product.stock} disponibles</p></div>
                    <button type="button" disabled={quantity >= product.stock} onClick={() => onAdd(product)} className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-frost text-ink transition hover:rotate-6 hover:bg-acid disabled:opacity-40" aria-label={`Agregar ${product.name} al carrito`}>
                      {quantity ? <Check size={19} /> : <ShoppingBag size={18} />}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : <div className="glass-soft rounded-[2rem] px-6 py-20 text-center text-slate-400">No encontramos productos con esos filtros.</div>}
    </section>
  );
}
