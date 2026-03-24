"use client";

import { useGPS } from "@/shared/hooks/useGPS";
import { useAccedido } from "@/app/context/AccedidoContext";
import { PantallaPermisos } from "@/shared/components/shell/PantallaPermisos";
import { AppDashboard } from "@/app/AppDashboard";

export default function Home() {
  const gps = useGPS();
  const { hasAccedido, acceder } = useAccedido();

  // Pantalla 1: Inicio (Suba, líneas, features, CTAs)
  if (!hasAccedido) {
    return (
      <PantallaPermisos
        gps={gps}
        onSkip={acceder}
      />
    );
  }

  // Pantalla 2: Dashboard (mapa, tabs, layers)
  return <AppDashboard />;
}
