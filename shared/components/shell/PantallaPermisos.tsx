"use client";
import type { GPSState } from "@/shared/types/gps";

interface PantallaPermisosProps {
  gps: GPSState;
  onSkip: () => void;
}

const LINEAS = [
  { letra: "A", color: "#60a5fa" },
  { letra: "B", color: "#f87171" },
  { letra: "C", color: "#a78bfa" },
  { letra: "D", color: "#34d399" },
  { letra: "E", color: "#fb923c" },
  { letra: "H", color: "#facc15", dark: true },
];

const FEATURES = [
  { icon: "📍", titulo: "Paradas cercanas", desc: "Colectivos y subtes a tu alrededor" },
  { icon: "🗺️", titulo: "Mapa en tiempo real", desc: "Líneas, estaciones y recorridos del AMBA" },
  { icon: "⚡", titulo: "Próximas llegadas", desc: "Cuándo llega tu próximo subte" },
];

export function PantallaPermisos({ gps, onSkip }: PantallaPermisosProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-app)] overflow-y-auto">

      {/* Barra de colores de líneas */}
      <div className="flex h-1.5 w-full shrink-0">
        {LINEAS.map((l) => (
          <div key={l.letra} className="flex-1" style={{ background: l.color }} />
        ))}
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-6 py-10 text-center">

        {/* Ícono + nombre */}
        <div className="relative mb-5">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg"
            style={{ background: "rgba(29,158,117,0.15)", border: "1.5px solid rgba(29,158,117,0.3)" }}
          >
            🚇
          </div>
          {/* Indicador verde pulsante */}
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--primary)] ring-2 ring-[var(--bg-app)] animate-pulse" />
        </div>

        <h1 className="text-4xl font-extrabold text-[var(--primary)] tracking-tight mb-1">
          Suba
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-2">
          Transporte del AMBA · Buenos Aires
        </p>

        {/* Pills de líneas */}
        <div className="flex gap-2 mb-8">
          {LINEAS.map((l) => (
            <span
              key={l.letra}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md"
              style={{
                background: l.color,
                color: l.dark ? "#000" : "#fff",
              }}
            >
              {l.letra}
            </span>
          ))}
        </div>

        {/* Features */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          {FEATURES.map(({ icon, titulo, desc }) => (
            <div
              key={titulo}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-2xl shrink-0">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{titulo}</p>
                <p className="text-xs text-[var(--text-muted)]">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <button
          onClick={() => { gps.requestPermission(); onSkip(); }}
          disabled={gps.status === "requesting"}
          className="w-full max-w-sm bg-[var(--primary)] text-white font-semibold py-4 rounded-2xl text-base shadow-lg active:scale-95 transition-transform disabled:opacity-60 mb-3"
        >
          {gps.status === "requesting" ? "Obteniendo ubicación…" : "Acceder"}
        </button>

        <button
          onClick={onSkip}
          className="text-[var(--text-muted)] text-sm py-2 underline underline-offset-4"
        >
          Buscar sin GPS
        </button>

        {/* Tagline bottom */}
        <p className="mt-8 text-xs text-[var(--text-dim)]">
          Gratis · Sin registro · Funciona offline
        </p>
      </div>
    </div>
  );
}
