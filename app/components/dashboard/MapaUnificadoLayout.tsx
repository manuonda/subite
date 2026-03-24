"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiltroMapaBar, type MapFilter } from "@/shared/components/mapa/FiltroMapaBar";
import { useMapView } from "@/app/context/MapViewContext";
import { ListaSubtes } from "@/features/subtes/components/ListaSubtes";
import { ListaParadas, type Parada } from "@/features/paradas/components/ListaParadas";
import { ListaParadasAgrupadas } from "@/features/paradas/components/ListaParadasAgrupadas";
import { UbicacionParadasBanner } from "@/shared/components/mapa/UbicacionParadasBanner";
import type { MapLayers, MarkerData } from "@/shared/types/mapa";
import type { GPSState } from "@/shared/types/gps";

const FILTER_TO_LAYERS: Record<MapFilter, MapLayers> = {
  subtes:  { paradasColectivo: false, paradasSubte: true, lineasSubte: true },
  bus:     { paradasColectivo: true, paradasSubte: false, lineasSubte: true },
  paradas: { paradasColectivo: false, paradasSubte: true, lineasSubte: true },
};

interface MapaUnificadoLayoutProps {
  gps: GPSState;
  /** Paradas de colectivo (para filtro Bus) */
  paradasBus: Parada[];
  /** Estaciones de subte (para filtro Paradas). Fuente: GTFS estaciones. */
  paradasSubte: Parada[];
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
  paradasBus,
  paradasSubte,
  map,
  fueraDelArea,
  selectedMarker,
  onCloseMarker,
  onLayersChange,
  onParadaSelectFromList,
}: MapaUnificadoLayoutProps) {
  const router = useRouter();
  const { activeMapFilter: activeFilter, setActiveMapFilter } = useMapView();

  function handleFilterChange(f: MapFilter) {
    setActiveMapFilter(f);
    onLayersChange(FILTER_TO_LAYERS[f]);
  }

  useEffect(() => {
    onLayersChange(FILTER_TO_LAYERS[activeFilter]);
  }, [activeFilter, onLayersChange]);

  function handleParadaSelect(parada: Parada) {
    if (onParadaSelectFromList) {
      onParadaSelectFromList(parada);
    } else {
      router.push(`/parada/${parada.id}?from=mapa`);
    }
  }

  const ubicacionReal = gps.status === "granted" && !fueraDelArea;

  const listContent = () => {
    switch (activeFilter) {
      case "subtes":
        return <ListaSubtes />;
      case "bus":
        return <ListaParadas paradas={paradasBus} onParadaSelect={handleParadaSelect} />;
      case "paradas":
        return <ListaParadasAgrupadas paradas={paradasSubte} onParadaSelect={handleParadaSelect} />;
      default:
        return (
          <>
            {!ubicacionReal && (
              <UbicacionParadasBanner
                status={gps.status}
                onActivar={gps.requestPermission}
              />
            )}
            <ListaParadasAgrupadas paradas={paradasSubte} onParadaSelect={handleParadaSelect} />
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
