"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiltroMapaBar, type MapFilter } from "@/app/components/FiltroMapaBar";
import { ListaSubtes } from "@/app/components/dashboard/ListaSubtes";
import { ListaAlertas } from "@/app/components/dashboard/ListaAlertas";
import { ListaParadas, type Parada } from "@/app/components/ListaParadas";
import { UbicacionParadasBanner } from "@/app/components/UbicacionParadasBanner";
import type { MapLayers, MarkerData } from "@/app/components/Mapa";
import type { GPSState } from "@/hooks/useGPS";

const FILTER_TO_LAYERS: Record<MapFilter, MapLayers> = {
  todo:    { paradasColectivo: true, paradasSubte: true, lineasSubte: true },
  subtes:  { paradasColectivo: false, paradasSubte: true, lineasSubte: true },
  bus:     { paradasColectivo: true, paradasSubte: false, lineasSubte: false },
  paradas: { paradasColectivo: true, paradasSubte: true, lineasSubte: false },
  alertas: { paradasColectivo: true, paradasSubte: true, lineasSubte: true },
};

interface MapaUnificadoLayoutProps {
  gps: GPSState;
  paradas: Parada[];
  map: React.ReactNode;
  fueraDelArea?: boolean;
  selectedMarker: MarkerData | null;
  onCloseMarker: () => void;
  onLayersChange: (layers: MapLayers) => void;
  /** Al seleccionar parada desde la lista: muestra modal primero (si se pasa). Sino redirige directo. */
  onParadaSelectFromList?: (parada: Parada) => void;
}

export function MapaUnificadoLayout({
  gps,
  paradas,
  map,
  fueraDelArea,
  selectedMarker,
  onCloseMarker,
  onLayersChange,
  onParadaSelectFromList,
}: MapaUnificadoLayoutProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<MapFilter>("todo");

  function handleFilterChange(f: MapFilter) {
    setActiveFilter(f);
    onLayersChange(FILTER_TO_LAYERS[f]);
  }

  function handleParadaSelect(parada: Parada) {
    if (onParadaSelectFromList) {
      onParadaSelectFromList(parada);
    } else {
      router.push(`/parada/${parada.id}`);
    }
  }

  const paradasBus = paradas.filter((p) => p.tipo === "colectivo");
  const paradasSubte = paradas.filter((p) => p.tipo === "subte");
  const ubicacionReal = gps.status === "granted" && !fueraDelArea;

  const listContent = () => {
    switch (activeFilter) {
      case "subtes":
        return <ListaSubtes />;
      case "bus":
        return <ListaParadas paradas={paradasBus} onParadaSelect={handleParadaSelect} />;
      case "paradas":
        return <ListaParadas paradas={paradasSubte} onParadaSelect={handleParadaSelect} />;
      case "alertas":
        return <ListaAlertas />;
      default:
        return (
          <>
            {!ubicacionReal && (
              <UbicacionParadasBanner
                status={gps.status}
                onActivar={gps.requestPermission}
              />
            )}
            <ListaParadas paradas={paradas} onParadaSelect={handleParadaSelect} />
          </>
        );
    }
  };

  return (
    <div
      className="flex flex-col lg:flex-row"
      style={{
        height: "calc(100dvh - 7.5rem - env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Mapa — 55% en mobile, flex-1 en desktop */}
      <div className="relative flex-[0_0_55%] lg:flex-1 min-h-0 bg-[var(--bg-elevated)]">
        {map}
      </div>

      {/* Mobile: filtros + lista */}
      <div className="lg:hidden flex flex-col flex-1 min-h-0 overflow-hidden bg-[var(--bg-surface)]">
        <FiltroMapaBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3" style={{ scrollbarWidth: "none" }}>
          {listContent()}
        </div>
      </div>

      {/* Desktop: panel lateral */}
      <aside className="hidden lg:flex flex-col w-[min(420px,38vw)] shrink-0 border-l border-[var(--border)] bg-[var(--bg-surface)] min-h-0">
        <FiltroMapaBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
        <div className="overflow-y-auto flex-1 min-h-0 px-4 pb-4 pt-3">
          {listContent()}
        </div>
      </aside>

    </div>
  );
}
