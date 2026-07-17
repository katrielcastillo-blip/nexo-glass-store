"use client";

import { CartModal, CheckoutModal, OrderSuccess } from "@/components/cart-checkout";
import { Catalog } from "@/components/catalog";
import { ChatWidget } from "@/components/chat-widget";
import { DeliveryOptimizer } from "@/components/delivery-optimizer";
import { Navbar } from "@/components/navbar";
import { SettingsModal } from "@/components/settings-modal";
import { initialDistances, nearestNeighborPath } from "@/lib/route-optimizer";
import { CartItem, DeliveryAddress, DistanceMatrix, Order, Product } from "@/types/store";
import { ArrowDown, Boxes, MapPin, PackageCheck, Route, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

export function Storefront() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [distances, setDistances] = useState<DistanceMatrix>(() => initialDistances.map((row) => [...row]));
  const [apiKey, setApiKey] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const activeStops = useMemo(() => [...new Set(cart.map((item) => item.deliveryNode))].sort(), [cart]);

  const addToCart = (product: Product) => setCart((current) => {
    const existing = current.find((item) => item.id === product.id);
    if (!existing) return [...current, { ...product, quantity: 1 }];
    if (existing.quantity >= existing.stock) return current;
    return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
  });

  const changeQuantity = (id: number, quantity: number) => setCart((current) => quantity <= 0
    ? current.filter((item) => item.id !== id)
    : current.map((item) => item.id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item));

  const confirmOrder = (address: DeliveryAddress) => {
    const stops = activeStops.length ? activeStops : [1];
    const order: Order = {
      id: `NX-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      address,
      items: cart.map((item) => ({ ...item })),
      total,
      route: nearestNeighborPath(distances, 0, [0, ...stops]),
    };
    setLastOrder(order);
    setCart([]);
    setCheckoutOpen(false);
    setSuccessOpen(true);
  };

  return (
    <main id="inicio">
      <Navbar cartCount={cartCount} hasApiKey={Boolean(apiKey)} onCart={() => setCartOpen(true)} onSettings={() => setSettingsOpen(true)} />

      <section className="relative mx-auto max-w-7xl px-4 pb-14 pt-20 sm:px-6 sm:pt-28 lg:pb-24 lg:pt-36">
        <div className="pointer-events-none absolute -left-28 top-20 h-72 w-72 animate-float rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[1.18fr_.82fr]">
          <div className="animate-reveal">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3 py-2 text-xs font-bold uppercase tracking-[.16em] text-slate-300 backdrop-blur-xl"><span className="h-2 w-2 rounded-full bg-acid shadow-[0_0_12px_#b8ff5c]" /> Diseño útil · entrega inteligente</div>
            <h1 className="font-display text-[clamp(3.5rem,9vw,7.8rem)] font-bold leading-[.82] tracking-[-.065em]">Tu mundo,<br /><span className="bg-gradient-to-r from-cyan via-frost to-acid bg-clip-text text-transparent">en ruta.</span></h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">Objetos cotidianos bien pensados. Un agente de búsqueda calcula cómo llevarlos hasta ti con menos recorrido y más claridad.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#catalogo" className="primary-button">Explorar colección <ArrowDown size={17} /></a><a href="#rutas" className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-5 py-3 text-sm font-bold transition hover:bg-white/10"><Route size={17} className="text-cyan" /> Ver agente</a></div>
          </div>

          <div className="relative mx-auto w-full max-w-lg animate-reveal [animation-delay:180ms]">
            <div className="glass relative aspect-[.92] overflow-hidden rounded-[3rem] p-6 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(184,255,92,.18),transparent_35%),radial-gradient(circle_at_15%_85%,rgba(87,216,255,.2),transparent_38%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-slate-400">Operación en vivo</p><p className="mt-2 font-display text-2xl font-bold">Depósito 00</p></div><span className="grid h-12 w-12 place-items-center rounded-2xl border border-acid/25 bg-acid/10 text-acid"><Boxes /></span></div>
                <div className="relative mx-auto grid h-48 w-48 place-items-center rounded-full border border-white/10 sm:h-56 sm:w-56"><div className="absolute inset-5 rounded-full border border-dashed border-cyan/30" /><div className="absolute inset-12 rounded-full border border-white/10" /><span className="grid h-16 w-16 place-items-center rounded-full bg-acid font-display text-xl font-black text-ink shadow-[0_0_45px_rgba(184,255,92,.35)]">0</span>{[["1","-top-3 left-1/2"],["2","right-0 top-1/3"],["3","bottom-2 right-6"],["4","bottom-2 left-6"],["5","left-0 top-1/3"]].map(([node, position]) => <span key={node} className={`absolute grid h-10 w-10 place-items-center rounded-full border border-cyan/30 bg-[#0b2035]/90 text-sm font-bold text-cyan backdrop-blur-xl ${position}`}>{node}</span>)}</div>
                <div className="grid grid-cols-2 gap-3"><div className="glass-soft rounded-2xl p-4"><MapPin size={17} className="mb-2 text-cyan" /><p className="font-display text-xl font-bold">5 nodos</p><p className="text-xs text-slate-500">Red editable</p></div><div className="glass-soft rounded-2xl p-4"><ShieldCheck size={17} className="mb-2 text-acid" /><p className="font-display text-xl font-bold">En sesión</p><p className="text-xs text-slate-500">Datos efímeros</p></div></div>
              </div>
            </div>
            <div className="glass absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl p-3 pr-5 sm:-left-8"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan/10 text-cyan"><PackageCheck size={19} /></span><div><p className="text-xs text-slate-500">Planificador</p><p className="text-sm font-bold">Listo para calcular</p></div></div>
          </div>
        </div>
      </section>

      <Catalog cart={cart} onAdd={addToCart} />
      <DeliveryOptimizer distances={distances} activeStops={activeStops} lastOrderRoute={lastOrder?.route} onDistances={setDistances} onReset={() => setDistances(initialDistances.map((row) => [...row]))} />

      <footer className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6"><div className="flex flex-col justify-between gap-4 border-t border-white/10 py-8 text-sm text-slate-500 sm:flex-row"><p className="font-display font-bold text-slate-300">NEXO / 2026</p><p>Demo ecommerce · Sin pagos ni persistencia</p></div></footer>

      <CartModal open={cartOpen} cart={cart} total={total} onClose={() => setCartOpen(false)} onQuantity={changeQuantity} onRemove={(id) => setCart((current) => current.filter((item) => item.id !== id))} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      <CheckoutModal open={checkoutOpen} total={total} onClose={() => setCheckoutOpen(false)} onConfirm={confirmOrder} />
      <OrderSuccess open={successOpen} order={lastOrder} onClose={() => setSuccessOpen(false)} />
      <SettingsModal open={settingsOpen} apiKey={apiKey} onClose={() => setSettingsOpen(false)} onSave={setApiKey} />
      <ChatWidget apiKey={apiKey} onSettings={() => setSettingsOpen(true)} />
    </main>
  );
}

