"use client";

import { useState, useMemo, useEffect } from "react";
import { useGPS } from "@/shared/hooks/useGPS";
import { BA_CENTER, USE_BA_COORDS_DEV } from "@/shared/constants/geo";
import { isWithinServiceArea } from "@/shared/utils/geo";
import { useUbicacion } from "@/app/context/UbicacionContext";
import { getParadasCercanas } from "@/lib/paradas-mock";
import { subteLinesForMap, estacionesToMarkers, getEstacionesParaLista } from "@/lib/subte";
import type { MapLayers, MarkerData } from "@/shared/types/mapa";
import { Mapa } from "@/shared/components/mapa/Mapa";
import { InfoParadaMapa } from "@/shared/components/mapa/InfoParadaMapa";
import { StatusBar } from "@/shared/components/shell/StatusBar";
import { BottomNav } from "@/shared/components/shell/BottomNav";
import { MapaUnificadoLayout } from "@/app/components/dashboard/MapaUnificadoLayout";
import { useLocale } from "@/app/context/LocaleContext";

export function AppDashboard() {
  const { t } = useLocale();
  const gps = useGPS();
  const { fueraDelArea, setFueraDelArea, alertFueraDelAreaMostrado, marcarAlertMostrado } = useUbicacion();
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
        alert(t("alertOutOfArea"));
        marcarAlertMostrado();
      }
    } else {
      setFueraDelArea(false);
    }
  }, [gps.status, gps.coords, setFueraDelArea, alertFueraDelAreaMostrado, marcarAlertMostrado, t]);

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

  const paradasBus = useMemo(
    () =>
      paradasConCoords
        .filter((p) => p.tipo === "colectivo")
        .map((p, i) => ({
          id: p.id,
          nombre: p.nombre,
          lineas: p.lineas,
          tiempo: (i % 3) + 2,
          tipo: "colectivo" as const,
        })),
    [paradasConCoords]
  );

  const paradasSubte = useMemo(() => getEstacionesParaLista(), []);

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      <StatusBar gpsStatus={gps.status} />

      {fueraDelArea && (
        <div
          className="fixed left-0 right-0 lg:left-[220px] top-14 z-30 px-4 py-2.5 text-sm text-center font-medium border-b transition-colors"
          style={{
            background: "var(--alert-warning-bg)",
            borderColor: "var(--alert-warning-border)",
            color: "var(--alert-warning-text)",
          }}
          role="alert"
        >
          {t("areaOutOfService")}
        </div>
      )}

      <div className={`lg:ml-[220px] ${fueraDelArea ? "pt-24" : "pt-14"}`}>
        <MapaUnificadoLayout
          gps={gps}
          paradasBus={paradasBus}
          paradasSubte={paradasSubte}
          fueraDelArea={fueraDelArea}
          selectedMarker={selectedMapMarker}
          onCloseMarker={() => setSelectedMapMarker(null)}
          onLayersChange={setMapLayers}
          onParadaSelectFromList={(parada) => {
            const p =
              parada.tipo === "colectivo"
                ? paradasConCoords.find((x) => x.id === parada.id)
                : null;
            const marker = p
              ? ({
                  id: p.id,
                  lat: p.lat,
                  lng: p.lng,
                  type: p.tipo === "subte" ? "subte" : "parada",
                  nombre: p.nombre,
                  label: p.nombre,
                } satisfies MarkerData)
              : mapMarkers.find((m) => m.id === parada.id);
            if (marker) setSelectedMapMarker(marker);
          }}
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
                className="absolute bottom-4 right-4 w-11 h-11 rounded-full flex items-center justify-center text-white border-2 border-white/20 active:scale-95 transition-transform z-[1100]"
                style={{ background: "var(--primary)", boxShadow: "0 0 20px var(--primary-glow)" }}
                aria-label="Activar o actualizar ubicación"
              >
                📍
              </button>
            </>
          }
        />
      </div>

      <BottomNav />
    </div>
  );
}
