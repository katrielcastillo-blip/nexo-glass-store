"use client";

import { nearestNeighborPath } from "@/lib/route-optimizer";
import { DistanceMatrix, RouteResult } from "@/types/store";
import { RotateCcw, Route, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

interface DeliveryOptimizerProps {
  distances: DistanceMatrix;
  activeStops: number[];
  lastOrderRoute?: RouteResult;
  onDistances: (distances: DistanceMatrix) => void;
  onReset: () => void;
}

export function DeliveryOptimizer({ distances, activeStops, lastOrderRoute, onDistances, onReset }: DeliveryOptimizerProps) {
  const [manualStops, setManualStops] = useState<number[]>([]);
  const stops = activeStops.length ? activeStops : manualStops.length ? manualStops : [1, 2, 3, 4, 5];
  const result = useMemo(() => nearestNeighborPath(distances, 0, [0, ...stops]), [distances, stops]);

  const editDistance = (row: number, column: number, raw: string) => {
    const value = Math.max(0, Number(raw) || 0);
    const next = distances.map((line) => [...line]);
    next[row][column] = value;
    next[column][row] = value;
    onDistances(next);
  };

  const toggleStop = (node: number) => {
    if (activeStops.length) return;
    setManualStops((current) => current.includes(node) ? current.filter((item) => item !== node) : [...current, node].sort());
  };

  return (
    <section id="rutas" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="glass overflow-hidden rounded-[2.4rem] p-5 sm:p-8 lg:p-10">
        <div className="grid gap-9 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
          <div>
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan"><Route /></div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[.26em] text-cyan">Agente planificador · Vecino más cercano</p>
            <h2 className="font-display text-4xl font-bold leading-[1.02] sm:text-5xl">La ruta corta.<br /><span className="text-slate-500">La decisión clara.</span></h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">El agente parte del depósito 0, evalúa las paradas pendientes mediante un min-heap y elige siempre la más cercana. Es una búsqueda voraz: rápida y determinista.</p>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between"><p className="text-sm font-bold">Paradas activas</p><span className="text-xs text-slate-500">{activeStops.length ? "Según el carrito" : "Selección demo"}</span></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((node) => {
                  const active = stops.includes(node);
                  return <button key={node} type="button" disabled={activeStops.length > 0} onClick={() => toggleStop(node)} className={`focus-ring rounded-full border px-3 py-2 text-xs font-bold transition ${active ? "border-cyan/50 bg-cyan/15 text-cyan" : "border-white/10 text-slate-500"} disabled:cursor-default`}>Nodo {node}</button>;
                })}
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-acid/20 bg-acid/[.055] p-5">
              <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-acid">Ruta encontrada</p><p className="mt-1 text-sm text-slate-400">Desde el depósito</p></div><Sparkles className="text-acid" size={20} /></div>
              <div className="flex flex-wrap items-center gap-2">
                {result.path.map((node, index) => <div className="flex items-center gap-2" key={`${node}-${index}`}><span className={`grid h-10 w-10 place-items-center rounded-full text-sm font-extrabold ${node === 0 ? "bg-acid text-ink" : "border border-white/15 bg-white/[.08]"}`}>{node}</span>{index < result.path.length - 1 && <span className="w-5 border-t border-dashed border-cyan/50" />}</div>)}
              </div>
              <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-4"><span className="text-sm text-slate-400">Costo acumulado</span><strong className="font-display text-3xl">{result.cost} <small className="text-sm font-medium text-slate-500">uds.</small></strong></div>
            </div>
            {lastOrderRoute && <p className="mt-3 text-xs text-slate-500">Último pedido: {lastOrderRoute.path.join(" → ")} · {lastOrderRoute.cost} uds.</p>}
          </div>

          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3"><div><p className="font-display text-xl font-bold">Matriz de distancias</p><p className="text-xs text-slate-500">Editar una celda actualiza su reflejo</p></div><button type="button" className="focus-ring flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/[.07]" onClick={onReset}><RotateCcw size={14} /> Restablecer</button></div>
            <div className="no-scrollbar overflow-x-auto rounded-3xl border border-white/10 bg-black/10 p-3 sm:p-4">
              <table className="w-full min-w-[520px] border-separate border-spacing-2 text-center text-sm">
                <thead><tr><th className="text-slate-600">de \ a</th>{distances.map((_, index) => <th key={index} className="font-display text-cyan">{index}</th>)}</tr></thead>
                <tbody>{distances.map((row, rowIndex) => <tr key={rowIndex}><th className="font-display text-cyan">{rowIndex}</th>{row.map((value, columnIndex) => <td key={columnIndex}><input aria-label={`Distancia del nodo ${rowIndex} al ${columnIndex}`} type="number" min="0" disabled={rowIndex === columnIndex} value={value} onChange={(event) => editDistance(rowIndex, columnIndex, event.target.value)} className="focus-ring h-11 w-full min-w-12 rounded-xl border border-white/10 bg-white/[.06] text-center font-bold text-frost transition focus:border-cyan/50 disabled:cursor-not-allowed disabled:opacity-25" /></td>)}</tr>)}</tbody>
              </table>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500"><div className="glass-soft rounded-xl p-3"><strong className="block text-sm text-frost">0</strong>Depósito</div><div className="glass-soft rounded-xl p-3"><strong className="block text-sm text-frost">1—5</strong>Entregas</div><div className="glass-soft rounded-xl p-3"><strong className="block text-sm text-frost">↔</strong>Simétrica</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
