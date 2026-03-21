"use client";
import type { GPSState } from "@/hooks/useGPS";

interface PantallaPermisosProps {
  gps: GPSState;
  onSkip: () => void;
}

export function PantallaPermisos({ gps, onSkip }: PantallaPermisosProps) {
  return (
    <div className="fixed inset-0 bg-[var(--bg-app)] z-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-6">🗺 🚇</div>
      <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">BondiYa</h1>
      <p className="text-[var(--text-muted)] mb-10 max-w-xs">
        Subtes, paradas y mapa del AMBA en tiempo real
      </p>

      <button
        onClick={gps.requestPermission}
        disabled={gps.status === "requesting"}
        className="w-full max-w-xs bg-[var(--primary)] text-white font-semibold py-4 rounded-2xl text-base shadow-lg active:scale-95 transition-transform disabled:opacity-60"
      >
        {gps.status === "requesting" ? "Obteniendo ubicación..." : "Usar mi ubicación"}
      </button>

      <button
        onClick={onSkip}
        className="mt-4 text-[var(--text-muted)] text-sm py-2 underline underline-offset-2"
      >
        Buscar sin GPS
      </button>
    </div>
  );
}
