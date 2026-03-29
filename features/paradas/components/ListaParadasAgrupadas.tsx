"use client";

import { useState, useMemo } from "react";
import { TarjetaParada } from "./TarjetaParada";
import { SearchIcon } from "@/shared/components/ui/Icons";
import { COLORES_SUBTE } from "@/constants/subtes";
import type { Parada } from "./ListaParadas";

const LINEAS_SUBTE_ORDER = ["A", "B", "C", "D", "E", "H"];

function getLineaKey(linea: string): string {
  const trimmed = linea.trim();
  const m = trimmed.match(/(?:línea\s*)?([a-h])/i);
  return m ? m[1].toUpperCase() : trimmed;
}

function matchesSearch(p: Parada, q: string): boolean {
  if (!q.trim()) return true;
  const term = q.trim().toLowerCase();
  const nombreMatch = p.nombre.toLowerCase().includes(term);
  const lineasMatch = p.lineas.some((l) => getLineaKey(l).toLowerCase().includes(term) || l.toLowerCase().includes(term));
  return nombreMatch || lineasMatch;
}

interface ListaParadasAgrupadasProps {
  paradas: Parada[];
  onParadaSelect?: (parada: Parada) => void;
}

/** Agrupa paradas por tipo (subte/colectivo) y por línea. Muestra todas las paradas divididas por secciones. */
export function ListaParadasAgrupadas({ paradas, onParadaSelect }: ListaParadasAgrupadasProps) {
  const [busqueda, setBusqueda] = useState("");

  const paradasFiltradas = useMemo(
    () => (busqueda.trim() ? paradas.filter((p) => matchesSearch(p, busqueda)) : paradas),
    [paradas, busqueda]
  );

  const grupos = useMemo(() => {
    const subteByLinea = new Map<string, Parada[]>();
    const colectivoByLinea = new Map<string, Parada[]>();

    for (const p of paradasFiltradas) {
      if (p.tipo === "subte") {
        for (const l of p.lineas) {
          const key = getLineaKey(l);
          if (!subteByLinea.has(key)) subteByLinea.set(key, []);
          if (!subteByLinea.get(key)!.some((x) => x.id === p.id)) {
            subteByLinea.get(key)!.push(p);
          }
        }
      } else {
        for (const l of p.lineas) {
          const key = l.trim();
          if (!colectivoByLinea.has(key)) colectivoByLinea.set(key, []);
          if (!colectivoByLinea.get(key)!.some((x) => x.id === p.id)) {
            colectivoByLinea.get(key)!.push(p);
          }
        }
      }
    }

    const subteOrdenados = LINEAS_SUBTE_ORDER.filter((k) => subteByLinea.has(k)).map((k) => {
      const list = subteByLinea.get(k)!;
      return {
        linea: `Línea ${k}`,
        lineaKey: k,
        paradas: [...list].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
        tipo: "subte" as const,
      };
    });

    const colectivoOrdenados = [...colectivoByLinea.entries()]
      .sort(([a], [b]) => {
        const na = parseInt(a, 10);
        const nb = parseInt(b, 10);
        if (!isNaN(na) && !isNaN(nb)) return na - nb;
        return a.localeCompare(b);
      })
      .map(([k, paradas]) => ({
        linea: `Línea ${k}`,
        lineaKey: k,
        paradas: [...paradas].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
        tipo: "colectivo" as const,
      }));

    return [...subteOrdenados, ...colectivoOrdenados];
  }, [paradasFiltradas]);

  if (paradas.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)] py-6 text-center">
        No hay paradas en esta zona.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="pb-0.5">
        <div
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
          style={{ background: "var(--bg-panel-subtle)", border: "1px solid var(--border)" }}
        >
          <SearchIcon size={18} className="shrink-0 opacity-60 text-[var(--text-muted)]" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar estación o línea…"
            className="flex-1 min-w-0 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
            aria-label="Buscar estación o línea"
          />
        </div>
      </div>

      {grupos.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] py-6 text-center">
          No hay resultados
        </p>
      ) : (
        <div className="space-y-6">
          {grupos.map(({ linea, lineaKey, paradas: ps, tipo }) => {
            const color =
              tipo === "subte"
                ? (COLORES_SUBTE[lineaKey] ?? "var(--text-dim)")
                : "var(--primary)";
            return (
              <section key={`${tipo}-${linea}`}>
                <h4
                  className="text-xs font-semibold uppercase tracking-wide mb-2 pl-2.5 py-1 rounded-r"
                  style={{
                    color: "var(--text-dim)",
                    borderLeft: `3px solid ${color}`,
                    background: `${color}12`,
                  }}
                >
                  {linea}
                </h4>
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                  {ps.map((p) => (
                    <TarjetaParada
                      key={`${p.id}-${linea}`}
                      nombre={p.nombre}
                      lineas={p.lineas}
                      tiempo={p.tiempo}
                      tipo={p.tipo}
                      colorLinea={tipo === "subte" ? color : undefined}
                      onClick={() => onParadaSelect?.(p)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
