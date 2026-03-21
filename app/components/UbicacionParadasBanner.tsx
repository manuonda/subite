"use client";

interface UbicacionParadasBannerProps {
  onActivar: () => void;
}

export function UbicacionParadasBanner({ onActivar }: UbicacionParadasBannerProps) {
  return (
    <div
      className="rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/25 px-3 py-2.5"
      role="region"
      aria-label="Ubicación"
    >
      <p className="text-[13px] leading-snug text-[var(--text)]">
        Para ver paradas <span className="font-medium">cerca tuyo</span>, activá la ubicación del
        navegador.
      </p>
      <button
        type="button"
        onClick={onActivar}
        className="mt-2.5 w-full sm:w-auto rounded-lg bg-[var(--primary)] px-3 py-2 text-[13px] font-medium text-white active:scale-[0.98] transition-transform"
      >
        Activar ubicación
      </button>
    </div>
  );
}
