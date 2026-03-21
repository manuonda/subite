"use client";

import Link from "next/link";
import type { MarkerData } from "@/app/components/Mapa";
import { getEstacion } from "@/lib/subte/estaciones";
import { getTrips } from "@/lib/subte/trips";

interface InfoParadaMapaProps {
  marker: MarkerData | null;
  onClose: () => void;
}

const SENTIDO_LABEL: Record<string, string> = {
  N: "Norte",
  S: "Sur",
  E: "Este",
  O: "Oeste",
};

/** Deriva el sentido del sufijo del stop_id (ej: "1164N" → "Norte") */
function getSentido(stopId: string): string {
  const sufijo = stopId.slice(-1).toUpperCase();
  return SENTIDO_LABEL[sufijo] ?? sufijo;
}

/** Busca el destino (headsign) del viaje que pasa por ese platform */
function getDestino(stopId: string): string | undefined {
  const trips = getTrips();
  return trips.find((t) => {
    const sufijo = stopId.slice(-1).toUpperCase();
    // direction=0 → ida (S/O), direction=1 → vuelta (N/E)
    if (sufijo === "N" || sufijo === "E") return t.direction === 1;
    if (sufijo === "S" || sufijo === "O") return t.direction === 0;
    return false;
  })?.headsign;
}

export function InfoParadaMapa({ marker, onClose }: InfoParadaMapaProps) {
  if (!marker || marker.type === "user") return null;

  const esSubte = marker.type === "subte";
  const estacion = esSubte ? getEstacion(marker.id!) : null;

  return (
    <div
      className="fixed left-3 right-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:left-[calc(220px+12px)] lg:right-auto lg:w-[min(100%,380px)] z-[1150]"
      role="dialog"
      aria-label="Detalle de parada"
    >
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-2xl p-4 space-y-3">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0" aria-hidden>
              {esSubte ? "🚇" : "🚏"}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-[var(--text-primary)] text-sm truncate">
                {marker.nombre || marker.label || "Parada"}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                {esSubte ? `Estación ${marker.id}` : `ID: ${marker.id}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg px-2 py-1 text-xs text-[var(--text-muted)] hover:bg-white/10"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Plataformas de la estación */}
        {estacion && estacion.plataformas.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-(--text-dim) uppercase tracking-wider">
              Andenes
            </p>
            {estacion.plataformas.map((platId) => {
              const sentido = getSentido(platId);
              const destino = getDestino(platId);
              return (
                <div
                  key={platId}
                  className="flex items-center gap-2 text-xs text-[var(--text-muted)]"
                >
                  <span className="font-mono text-(--primary) w-14 shrink-0">
                    {platId}
                  </span>
                  <span className="text-(--text-dim)">→</span>
                  <span>
                    {sentido}
                    {destino && (
                      <span className="text-(--text-dim)"> · {destino}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Colectivo: info simple */}
        {!esSubte && (
          <p className="text-xs text-(--text-dim)">Parada de colectivos</p>
        )}

        {/* Botón detalle */}
        {esSubte && estacion && (
          <Link
            href={`/parada/${estacion.plataformas[0]}`}
            onClick={onClose}
            className="block w-full text-center text-sm font-semibold py-2.5 rounded-xl bg-(--primary) text-white active:opacity-80 transition-opacity"
          >
            Más información
          </Link>
        )}
      </div>
    </div>
  );
}
