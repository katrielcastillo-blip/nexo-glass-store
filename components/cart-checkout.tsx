"use client";

import { Modal } from "@/components/modal";
import { CartItem, DeliveryAddress, DistanceMatrix, Order } from "@/types/store";
import { Minus, PackageCheck, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";

interface CartModalProps {
  open: boolean;
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onQuantity: (id: number, next: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}

export function CartModal({ open, cart, total, onClose, onQuantity, onRemove, onCheckout }: CartModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Tu selección" eyebrow={`${cart.reduce((sum, item) => sum + item.quantity, 0)} artículos`}>
      {!cart.length ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-white/15 py-16 text-center">
          <ShoppingBag size={32} className="mb-4 text-slate-500" /><p className="font-display text-xl font-bold">El carrito está vacío</p><p className="mt-1 text-sm text-slate-400">Agrega algo que te mueva.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="glass-soft flex items-center gap-3 rounded-2xl p-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan/20 to-acid/10 font-display text-lg font-bold">{item.name.slice(0, 1)}</div>
                <div className="min-w-0 flex-1"><p className="truncate font-bold">{item.name}</p><p className="text-sm text-slate-400">${(item.price * item.quantity).toFixed(2)}</p></div>
                <div className="flex items-center rounded-full border border-white/10 bg-white/[.06] p-1">
                  <button className="focus-ring grid h-8 w-8 place-items-center rounded-full hover:bg-white/10" onClick={() => onQuantity(item.id, item.quantity - 1)} aria-label={`Quitar una unidad de ${item.name}`}><Minus size={14} /></button>
                  <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                  <button className="focus-ring grid h-8 w-8 place-items-center rounded-full hover:bg-white/10 disabled:opacity-30" disabled={item.quantity >= item.stock} onClick={() => onQuantity(item.id, item.quantity + 1)} aria-label={`Agregar una unidad de ${item.name}`}><Plus size={14} /></button>
                </div>
                <button type="button" className="focus-ring rounded-full p-2 text-slate-500 transition hover:bg-red-400/10 hover:text-red-300" onClick={() => onRemove(item.id)} aria-label={`Eliminar ${item.name}`}><Trash2 size={17} /></button>
              </div>
            ))}
          </div>
          <div className="my-6 flex items-end justify-between border-t border-white/10 pt-5"><div><p className="text-sm text-slate-400">Total estimado</p><p className="text-xs text-slate-500">Envío incluido</p></div><p className="font-display text-3xl font-bold">${total.toFixed(2)}</p></div>
          <button type="button" className="primary-button w-full" onClick={onCheckout}>Continuar al checkout</button>
        </>
      )}
    </Modal>
  );
}

interface CheckoutModalProps {
  open: boolean;
  total: number;
  onClose: () => void;
  onConfirm: (address: DeliveryAddress) => void;
}

const emptyAddress: DeliveryAddress = { name: "", street: "", city: "", postalCode: "" };

export function CheckoutModal({ open, total, onClose, onConfirm }: CheckoutModalProps) {
  const [address, setAddress] = useState(emptyAddress);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onConfirm(address);
    setAddress(emptyAddress);
  };
  const update = (key: keyof DeliveryAddress, value: string) => setAddress((current) => ({ ...current, [key]: value }));
  return (
    <Modal open={open} onClose={onClose} title="¿Dónde lo llevamos?" eyebrow="Checkout simulado">
      <form onSubmit={submit} className="space-y-4">
        <label className="block"><span className="mb-2 block text-sm font-bold">Nombre completo</span><input required className="field" value={address.name} onChange={(e) => update("name", e.target.value)} placeholder="Ada Lovelace" /></label>
        <label className="block"><span className="mb-2 block text-sm font-bold">Dirección</span><input required className="field" value={address.street} onChange={(e) => update("street", e.target.value)} placeholder="Av. Principal 123" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="mb-2 block text-sm font-bold">Ciudad</span><input required className="field" value={address.city} onChange={(e) => update("city", e.target.value)} placeholder="La Paz" /></label>
          <label className="block"><span className="mb-2 block text-sm font-bold">Código postal</span><input required className="field" value={address.postalCode} onChange={(e) => update("postalCode", e.target.value)} placeholder="0000" /></label>
        </div>
        <div className="glass-soft mt-6 flex items-center justify-between rounded-2xl p-4"><span className="text-sm text-slate-400">Total a simular</span><strong className="font-display text-2xl">${total.toFixed(2)}</strong></div>
        <p className="text-xs leading-relaxed text-slate-500">Esta demo no procesa pagos ni almacena la dirección. El pedido existe solo durante esta sesión.</p>
        <button type="submit" className="primary-button w-full"><PackageCheck size={18} /> Generar pedido</button>
      </form>
    </Modal>
  );
}

interface OrderSuccessProps { order: Order | null; open: boolean; onClose: () => void; }

export function OrderSuccess({ order, open, onClose }: OrderSuccessProps) {
  if (!order) return null;
  return (
    <Modal open={open} onClose={onClose} title="Pedido en camino" eyebrow={`Pedido ${order.id}`}>
      <div className="rounded-3xl border border-acid/25 bg-acid/[.07] p-5">
        <PackageCheck size={34} className="mb-4 text-acid" />
        <p className="font-display text-xl font-bold">Ruta calculada automáticamente</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">Entrega para {order.address.name} en {order.address.city}. El planificador visitará {order.route.path.length - 1} paradas con un costo de {order.route.cost} unidades.</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {order.route.path.map((node, index) => <div className="flex items-center gap-2" key={`${node}-${index}`}><span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-extrabold ${node === 0 ? "bg-acid text-ink" : "bg-cyan/15 text-cyan"}`}>{node}</span>{index < order.route.path.length - 1 && <span className="text-slate-600">→</span>}</div>)}
        </div>
      </div>
      <button className="primary-button mt-5 w-full" onClick={onClose}>Seguir explorando</button>
    </Modal>
  );
}
