"use client";

import type { MarkerData } from "@/app/components/Mapa";

interface InfoParadaMapaProps {
  marker: MarkerData | null;
  onClose: () => void;
}

export function InfoParadaMapa({ marker, onClose }: InfoParadaMapaProps) {
  if (!marker || marker.type === "user") return null;

  const esSubte = marker.type === "subte";

  return (
    <div
      className="fixed left-3 right-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:left-[calc(220px+12px)] lg:right-auto lg:w-[min(100%,380px)] z-[1150]"
      role="dialog"
      aria-label="Detalle de parada"
    >
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-2xl p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="text-2xl shrink-0"
              aria-hidden
            >
              {esSubte ? "🚇" : "🚏"}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-[var(--text-primary)] text-sm truncate">
                {marker.nombre || marker.label || "Parada"}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                ID: {marker.id ?? "—"}
              </p>
              {esSubte && marker.parent ? (
                <p className="text-xs text-[var(--text-dim)] mt-1">
                  Estación (agrupada): <span className="font-mono">{marker.parent}</span>
                </p>
              ) : null}
              {!esSubte ? (
                <p className="text-xs text-[var(--text-dim)] mt-1">Parada de colectivos</p>
              ) : null}
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
        <p className="text-[10px] text-[var(--text-dim)] mt-3">
          {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
        </p>
      </div>
    </div>
  );
}
