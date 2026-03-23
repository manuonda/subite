"use client";

import { useState, useMemo, useEffect } from "react";
import { useGPS } from "@/hooks/useGPS";
import { BA_CENTER, USE_BA_COORDS_DEV } from "@/constants/geo";
import { isWithinServiceArea } from "@/lib/geo";
import { useUbicacion } from "@/app/context/UbicacionContext";
import { getParadasCercanas } from "@/lib/paradas-mock";
import { subteLinesForMap, estacionesToMarkers } from "@/lib/subte";
import type { MapLayers, MarkerData } from "@/app/components/Mapa";
import { Mapa } from "@/app/components/Mapa";
import { InfoParadaMapa } from "@/app/components/InfoParadaMapa";
import { StatusBar } from "@/app/components/dashboard/StatusBar";
import { BottomNav, type TabId } from "@/app/components/dashboard/BottomNav";
import { ParadasMapaLayout } from "@/app/components/dashboard/ParadasMapaLayout";
import { ListaSubtes } from "@/app/components/dashboard/ListaSubtes";
import { BuscadorFallback } from "@/app/components/dashboard/BuscadorFallback";

export function AppDashboard() {
  const gps = useGPS();
  const { fueraDelArea, setFueraDelArea, alertFueraDelAreaMostrado, marcarAlertMostrado } = useUbicacion();
  const [activeTab, setActiveTab] = useState<TabId>("mapa");
  const [mapLayers, setMapLayers] = useState<MapLayers>({
    paradasColectivo: true,
    paradasSubte: true,
    lineasSubte: true,
  });

  useEffect(() => {
    if (USE_BA_COORDS_DEV) return;
    if (gps.status !== "granted" || !gps.coords) return;

    const { lat, lng } = gps.coords;
    if (!isWithinServiceArea(lat, lng)) {
      setFueraDelArea(true);
      if (!alertFueraDelAreaMostrado) {
        alert(
          "Tu ubicación no está dentro del área de servicio (AMBA). " +
            "Se mostrará Buenos Aires como referencia para consultar paradas y subtes."
        );
        marcarAlertMostrado();
      }
    } else {
      setFueraDelArea(false);
    }
  }, [gps.status, gps.coords, setFueraDelArea, alertFueraDelAreaMostrado, marcarAlertMostrado]);

  const coords = USE_BA_COORDS_DEV
    ? BA_CENTER
    : (fueraDelArea ? BA_CENTER : gps.coords) ?? BA_CENTER;
  const [selectedMapMarker, setSelectedMapMarker] = useState<MarkerData | null>(null);

  const paradasConCoords = useMemo(() => getParadasCercanas(coords.lat, coords.lng), [coords.lat, coords.lng]);
  const subteMarkers = useMemo(() => estacionesToMarkers(), []);
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

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      <StatusBar barrio="Buenos Aires" gpsStatus={gps.status} />

      {fueraDelArea && (
        <div
          className="fixed left-0 right-0 lg:left-[220px] top-14 z-30 px-4 py-2 bg-amber-500/20 border-b border-amber-500/40 text-amber-200 text-sm text-center"
          role="alert"
        >
          Fuera del área de servicio (AMBA). Mostrando Buenos Aires como referencia.
        </div>
      )}

      <div className={`lg:ml-[220px] ${fueraDelArea ? "pt-24" : "pt-14"}`}>
        {activeTab === "mapa" && (
          <ParadasMapaLayout
            gps={gps}
            paradas={paradasParaLista}
            fueraDelArea={fueraDelArea}
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

        {activeTab === "subtes" && (
          <div className="pb-20">
            <ListaSubtes />
          </div>
        )}

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
