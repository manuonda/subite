"use client";

import type { GPSStatus } from "@/shared/types/gps";

interface UbicacionParadasBannerProps {
  status: GPSStatus;
  onActivar: () => void;
}

export function UbicacionParadasBanner({ status, onActivar }: UbicacionParadasBannerProps) {
  const isRequesting = status === "requesting";
  const isDenied = status === "denied";

  return (
    <div
      className="rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/25 px-3 py-2.5"
      role="region"
      aria-label="Ubicación"
    >
      {isDenied ? (
        <>
          <p className="text-[13px] leading-snug text-[var(--text)]">
            La ubicación fue denegada. Para activarla, andá a{" "}
            <span className="font-medium">Configuración del navegador</span> o de tu dispositivo y
            permití el acceso a ubicación para esta página.
          </p>
          <button
            type="button"
            onClick={onActivar}
            className="mt-2.5 w-full sm:w-auto rounded-lg bg-[var(--primary)] px-3 py-2 text-[13px] font-medium text-white active:scale-[0.98] transition-transform"
          >
            Reintentar
          </button>
        </>
      ) : (
        <>
          <p className="text-[13px] leading-snug text-[var(--text)]">
            Para ver paradas <span className="font-medium">cerca tuyo</span>, activá la ubicación del
            navegador.
          </p>
          <button
            type="button"
            onClick={onActivar}
            disabled={isRequesting}
            className="mt-2.5 w-full sm:w-auto rounded-lg bg-[var(--primary)] px-3 py-2 text-[13px] font-medium text-white active:scale-[0.98] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isRequesting ? "Obteniendo ubicación..." : "Activar ubicación"}
          </button>
        </>
      )}
    </div>
  );
}
