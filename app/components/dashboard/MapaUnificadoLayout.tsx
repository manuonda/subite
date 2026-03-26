"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiltroMapaBar, type MapFilter } from "@/shared/components/mapa/FiltroMapaBar";
import { MobileMapBottomSheet } from "@/shared/components/mapa/MobileMapBottomSheet";
import { useMapView } from "@/app/context/MapViewContext";
import { ListaSubtes } from "@/features/subtes/components/ListaSubtes";
import { ListaParadas, type Parada } from "@/features/paradas/components/ListaParadas";
import { ListaParadasAgrupadas } from "@/features/paradas/components/ListaParadasAgrupadas";
import { Configuracion } from "@/app/components/dashboard/Configuracion";
import type { MapLayers } from "@/shared/types/mapa";

/** Capas del mapa al elegir lista; en "config" no se tocan (se mantiene la vista previa). */
const FILTER_TO_LAYERS: Record<Exclude<MapFilter, "config">, MapLayers> = {
  subtes:  { paradasColectivo: false, paradasSubte: true, lineasSubte: true },
  bus:     { paradasColectivo: true, paradasSubte: false, lineasSubte: true },
  paradas: { paradasColectivo: false, paradasSubte: true, lineasSubte: true },
};

interface MapaUnificadoLayoutProps {
  /** Paradas de colectivo (para filtro Bus) */
  paradasBus: Parada[];
  /** Estaciones de subte (para filtro Paradas). Fuente: GTFS estaciones. */
  paradasSubte: Parada[];
  map: React.ReactNode;
  onLayersChange: (layers: MapLayers) => void;
  /** Al seleccionar parada desde la lista: muestra modal primero (si se pasa). Sino redirige directo. */
  onParadaSelectFromList?: (parada: Parada) => void;
}

export function MapaUnificadoLayout({
  paradasBus,
  paradasSubte,
  map,
  onLayersChange,
  onParadaSelectFromList,
}: MapaUnificadoLayoutProps) {
  const router = useRouter();
  const { activeMapFilter: activeFilter, setActiveMapFilter } = useMapView();

  function handleFilterChange(f: MapFilter) {
    setActiveMapFilter(f);
    if (f !== "config") {
      onLayersChange(FILTER_TO_LAYERS[f]);
    }
  }

  useEffect(() => {
    if (activeFilter === "config") return;
    onLayersChange(FILTER_TO_LAYERS[activeFilter]);
  }, [activeFilter, onLayersChange]);

  function handleParadaSelect(parada: Parada) {
    if (onParadaSelectFromList) {
      onParadaSelectFromList(parada);
    } else {
      router.push(`/parada/${parada.id}?from=mapa`);
    }
  }

  const filtros = (
    <FiltroMapaBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
  );

  const listContent = () => {
    switch (activeFilter) {
      case "subtes":
        return <ListaSubtes />;
      case "bus":
        return <ListaParadas paradas={paradasBus} onParadaSelect={handleParadaSelect} />;
      case "paradas":
        return <ListaParadasAgrupadas paradas={paradasSubte} onParadaSelect={handleParadaSelect} />;
      case "config":
        return (
          <div className="pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Configuracion embedded />
          </div>
        );
      default:
        return <ListaSubtes />;
    }
  };

  return (
    <div
      className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden overscroll-none"
      style={{
        height: "calc(100dvh - 3.5rem - env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Columna mapa + bottom sheet (móvil) / mapa (desktop) */}
      <div className="flex flex-col flex-1 min-h-0 lg:flex-row lg:flex-1">
        <div className="flex flex-col flex-1 min-h-0 lg:flex-1 lg:min-h-[280px]">
          <div className="relative flex-1 min-h-0 bg-[var(--bg-elevated)] z-0">{map}</div>

          {/*
            Bottom sheet: handle → FiltroMapaBar (Subtes / Bus / Paradas / Config) → lista con scroll
          */}
          <MobileMapBottomSheet header={filtros}>{listContent()}</MobileMapBottomSheet>
        </div>

        {/* Desktop: panel lateral (sin sheet) */}
        <aside className="hidden lg:flex flex-col w-[min(420px,38vw)] shrink-0 border-l border-[var(--border)] bg-[var(--bg-surface)] min-h-0">
          {filtros}
          <div className="overflow-y-auto flex-1 min-h-0 px-4 pb-4 pt-3">
            {listContent()}
          </div>
        </aside>
      </div>
    </div>
  );
}
