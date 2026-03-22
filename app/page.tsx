"use client";

import { useState } from "react";
import { useGPS } from "@/hooks/useGPS";
import { PantallaPermisos } from "@/app/components/PantallaPermisos";
import { AppDashboard } from "@/app/AppDashboard";

export default function Home() {
  const gps = useGPS();
  const [hasAccedido, setHasAccedido] = useState(false);

  // Pantalla 1: Inicio (Subite, líneas, features, CTAs)
  if (!hasAccedido) {
    return (
      <PantallaPermisos
        gps={gps}
        onSkip={() => setHasAccedido(true)}
      />
    );
  }

  // Pantalla 2: Dashboard (mapa, tabs, layers)
  return <AppDashboard />;
}
