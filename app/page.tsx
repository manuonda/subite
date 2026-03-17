"use client";
import { useState } from "react";
import { useGPS } from "@/hooks/useGPS";
import { PantallaPermisos } from "@/app/components/PantallaPermisos";
import { StatusBar } from "@/app/components/StatusBar";
import { BottomNav, type TabId } from "@/app/components/BottomNav";
import { Mapa } from "@/app/components/Mapa";
import { BottomSheet } from "@/app/components/BottomSheet";
import { ListaParadas } from "@/app/components/ListaParadas";
import { ListaColectivos } from "@/app/components/ListaColectivos";
import { ListaSubtes } from "@/app/components/ListaSubtes";
import { BuscadorFallback } from "@/app/components/BuscadorFallback";

export default function Home() {
  const gps = useGPS();
  const [activeTab, setActiveTab] = useState<TabId>("mapa");
  const [showPermisos, setShowPermisos] = useState(true);

  const coords = gps.coords || { lat: -34.6037, lng: -58.3816 };

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
    <div className="min-h-screen bg-[#f8fafc]">
      <StatusBar barrio="Buenos Aires" gpsStatus={gps.status} />

      {/* Desktop layout offset */}
      <div className="lg:ml-[220px] pt-14">
        {/* Tab: Mapa */}
        {activeTab === "mapa" && (
          <>
            {/* Map area */}
            <div className="relative" style={{ height: "55vh" }}>
              <Mapa lat={coords.lat} lng={coords.lng} height="100%" />
              {/* FAB GPS */}
              <button
                onClick={gps.requestPermission}
                className="absolute bottom-4 right-4 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1a56db] border border-gray-100 active:scale-95 transition-transform z-10"
              >
                📍
              </button>
            </div>

            {/* Bottom sheet with nearby stops */}
            <BottomSheet title="Paradas cerca tuyo">
              <ListaParadas paradas={[]} />
            </BottomSheet>
          </>
        )}

        {/* Tab: Colectivos */}
        {activeTab === "colectivos" && (
          <div className="pb-20">
            <ListaColectivos lat={coords.lat} lng={coords.lng} />
          </div>
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
