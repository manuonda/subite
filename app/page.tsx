"use client";
import { useState, useMemo } from "react";
import { useGPS } from "@/hooks/useGPS";
import { getParadasCercanas } from "@/lib/paradas-mock";
import { subteLinesForMap } from "@/lib/subte-lines";
import { subteStopsToMarkers } from "@/lib/subte-stops";
import type { MapLayers, MarkerData } from "@/app/components/Mapa";
import { InfoParadaMapa } from "@/app/components/InfoParadaMapa";
import { PantallaPermisos } from "@/app/components/PantallaPermisos";
import { StatusBar } from "@/app/components/StatusBar";
import { BottomNav, type TabId } from "@/app/components/BottomNav";
import { Mapa } from "@/app/components/Mapa";
import { ParadasMapaLayout } from "@/app/components/ParadasMapaLayout";
import { ListaSubtes } from "@/app/components/ListaSubtes";
import { BuscadorFallback } from "@/app/components/BuscadorFallback";

export default function Home() {
  const gps = useGPS();
  const [activeTab, setActiveTab] = useState<TabId>("mapa");
  const [showPermisos, setShowPermisos] = useState(true);
  const [mapLayers, setMapLayers] = useState<MapLayers>({
    paradasColectivo: true,
    paradasSubte: true,
    lineasSubte: true,
  });

  const coords = gps.coords || { lat: -34.6037, lng: -58.3816 };
  const [selectedMapMarker, setSelectedMapMarker] = useState<MarkerData | null>(null);

  const paradasConCoords = useMemo(() => getParadasCercanas(coords.lat, coords.lng), [coords.lat, coords.lng]);

  const subteMarkers = useMemo(() => subteStopsToMarkers(), []);
  const subteLines = useMemo(() => subteLinesForMap(), []);

  const mapMarkers = useMemo((): MarkerData[] => {
    const colectivo: MarkerData[] = paradasConCoords
      .filter((p) => p.tipo === "colectivo")
      .map((p) => ({
        id: p.id,
        lat: p.lat,
        lng: p.lng,
        type: "parada" as const,
        nombre: p.nombre,
        label: p.nombre,
      }));
    return [...colectivo, ...subteMarkers];
  }, [paradasConCoords, subteMarkers]);

  const paradasParaLista = useMemo(
    () =>
      paradasConCoords.map((p, i) => ({
        id: p.id,
        nombre: p.nombre,
        lineas: p.lineas,
        tiempo: (i % 3) + 2,
        tipo: p.tipo,
      })),
    [paradasConCoords]
  );

  // Hide permisos screen once GPS status is known (granted or denied/skipped)
  const shouldShowPermisos =
    showPermisos && gps.status === "idle";

  if (shouldShowPermisos) {
    return (
      <PantallaPermisos
        gps={gps}
        onSkip={() => setShowPermisos(false)}
      />
    );
  }

  // After permission is handled, hide permisos
  if (showPermisos && gps.status !== "idle" && gps.status !== "requesting") {
    setShowPermisos(false);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      <StatusBar barrio="Buenos Aires" gpsStatus={gps.status} />

      {/* Desktop layout offset */}
      <div className="lg:ml-[220px] pt-14">
        {/* Tab: Mapa */}
        {activeTab === "mapa" && (
          <ParadasMapaLayout
            gps={gps}
            paradas={paradasParaLista}
            onOpenSubtes={() => setActiveTab("subtes")}
            map={
              <>
                <Mapa
                  lat={coords.lat}
                  lng={coords.lng}
                  markers={mapMarkers}
                  subteLines={subteLines}
                  layers={mapLayers}
                  onLayersChange={setMapLayers}
                  onMarkerSelect={setSelectedMapMarker}
                  onMapBackgroundClick={() => setSelectedMapMarker(null)}
                  height="100%"
                />
                <InfoParadaMapa
                  marker={selectedMapMarker}
                  onClose={() => setSelectedMapMarker(null)}
                />
                <button
                  type="button"
                  onClick={gps.requestPermission}
                  className="absolute bottom-[6.5rem] right-4 lg:bottom-4 w-11 h-11 bg-[var(--primary)] rounded-full shadow-lg flex items-center justify-center text-white border-2 border-white/20 active:scale-95 transition-transform z-[1200]"
                  aria-label="Activar o actualizar ubicación"
                >
                  📍
                </button>
              </>
            }
          />
        )}

        {/* Tab: Subtes */}
        {activeTab === "subtes" && (
          <div className="pb-20">
            <ListaSubtes />
          </div>
        )}

        {/* Tab: Buscar */}
        {activeTab === "buscar" && (
          <div className="pb-20">
            <BuscadorFallback />
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
