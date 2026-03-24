"use client";

import Link from "next/link";
import type { MarkerData } from "@/shared/types/mapa";
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

function getSentido(stopId: string): string {
  const sufijo = stopId.slice(-1).toUpperCase();
  return SENTIDO_LABEL[sufijo] ?? sufijo;
}

function getDestino(stopId: string): string | undefined {
  const trips = getTrips();
  return trips.find((t) => {
    const sufijo = stopId.slice(-1).toUpperCase();
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
      className="absolute left-3 bottom-16 z-[1150] w-[min(100%-24px,360px)]"
      role="dialog"
      aria-label="Detalle de parada"
    >
      <div
        className="rounded-2xl p-4 space-y-3 shadow-2xl"
        style={{
          background: "rgba(11, 15, 27, 0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(61, 157, 243, 0.18)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{
                background: "var(--primary-muted)",
                border: "1px solid var(--primary-border)",
              }}
            >
              {esSubte ? "🚇" : "🚏"}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-[var(--text-primary)] truncate">
                {marker.nombre || marker.label || "Parada"}
              </p>
              <p
                className="text-[10px] mt-0.5"
                style={{ color: "var(--primary)", fontFamily: "var(--font-space-mono)" }}
              >
                {esSubte ? `Estación ${marker.id}` : `ID: ${marker.id}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors"
            style={{
              color: "var(--text-muted)",
              background: "rgba(255,255,255,0.06)",
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Andenes */}
        {estacion && estacion.plataformas.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-dim)]">
              Andenes
            </p>
            {estacion.plataformas.map((platId) => {
              const sentido = getSentido(platId);
              const destino = getDestino(platId);
              return (
                <div key={platId} className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold w-14 shrink-0"
                    style={{ color: "var(--primary)", fontFamily: "var(--font-space-mono)" }}
                  >
                    {platId}
                  </span>
                  <span className="text-[var(--text-dim)] text-xs">→</span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {sentido}
                    {destino && <span className="text-[var(--text-dim)]"> · {destino}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Colectivo */}
        {!esSubte && (
          <p className="text-xs text-[var(--text-dim)]">Parada de colectivos</p>
        )}

        {/* Botón acción — redirige a pantalla de detalle */}
        {marker.id && (
          <Link
            href={esSubte && estacion ? `/parada/${estacion.plataformas[0]}` : `/parada/${marker.id}`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full text-sm font-bold py-2.5 rounded-xl text-white transition-opacity active:opacity-80"
            style={{
              background: "var(--primary)",
              boxShadow: "0 0 20px var(--primary-glow)",
            }}
          >
            Ver más información →
          </Link>
        )}
      </div>
    </div>
  );
}
