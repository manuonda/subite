"use client";

import { BottomSheet } from "@/app/components/BottomSheet";
import { ListaParadas, type Parada } from "@/app/components/ListaParadas";
import { UbicacionParadasBanner } from "@/app/components/UbicacionParadasBanner";
import type { GPSState } from "@/hooks/useGPS";

interface ParadasMapaLayoutProps {
  gps: GPSState;
  paradas: Parada[];
  map: React.ReactNode;
  onOpenSubtes?: () => void;
}

export function ParadasMapaLayout({ gps, paradas, map, onOpenSubtes }: ParadasMapaLayoutProps) {
  const ubicacionReal = gps.status === "granted";
  const title = ubicacionReal ? "Paradas cerca tuyo" : "Paradas en el área";
  const banner = !ubicacionReal ? (
    <UbicacionParadasBanner onActivar={gps.requestPermission} />
  ) : null;

  return (
    <div
      className="flex flex-col lg:flex-row lg:min-h-0
        h-[calc(100dvh-7.5rem-env(safe-area-inset-bottom,0px))]
        lg:h-[calc(100dvh-3.5rem)]"
    >
      {/* Mobile: mapa llena el alto útil (estado + nav inferior); el sheet va encima. Desktop: mapa + panel */}
      <div className="relative bg-[var(--bg-elevated)] w-full min-h-0 flex-1 lg:flex-1 lg:min-h-[280px]">
        {map}
      </div>

      <aside className="hidden lg:flex flex-col w-full max-w-[440px] lg:w-[min(420px,38vw)] shrink-0 border-t lg:border-t-0 lg:border-l border-[var(--border)] bg-[var(--bg-surface)] min-h-0 max-h-[calc(100dvh-3.5rem)]">
        <div className="px-4 pt-4 pb-2 border-b border-[var(--border)] shrink-0">
          <h2 className="text-[11px] font-medium text-[var(--text-dim)] uppercase tracking-[1.5px] font-mono">
            {title}
          </h2>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0 px-4 pb-4 pt-3 space-y-3">
          {banner}
          <ListaParadas paradas={paradas} />
        </div>
      </aside>

      <BottomSheet title={title} banner={banner ?? undefined} onOpenSubtes={onOpenSubtes}>
        <ListaParadas paradas={paradas} />
      </BottomSheet>
    </div>
  );
}
