"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { Mapa } from "@/shared/components/mapa/Mapa";
import { BackIcon } from "@/shared/components/ui/Icons";
import { BA_CENTER } from "@/shared/constants/geo";
import {
  getSubteRoute,
  getHorariosPorLinea,
  getEstacionesDeLinea,
  subteLinesForRoute,
} from "@/lib/subte";
import { HorariosLineaTable } from "@/features/subtes/components/HorariosLineaTable";
import { AlertaServicio } from "@/features/subtes/components/AlertaServicio";
import { useAlertasSubtes } from "@/features/subtes/hooks/useSubtes";

interface LineaPageClientProps {
  params: Promise<{ id: string }>;
}

export function LineaPageClient({ params }: LineaPageClientProps) {
  const { id } = use(params);
  const routeId = id.startsWith("Linea") ? id : `Linea${id.toUpperCase()}`;
  const route = useMemo(() => getSubteRoute(routeId), [routeId]);
  const horarios = useMemo(() => getHorariosPorLinea(routeId), [routeId]);
  const estaciones = useMemo(() => {
    const list = getEstacionesDeLinea(routeId);
    return [...list].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }, [routeId]);
  const subteLines = useMemo(() => subteLinesForRoute(routeId), [routeId]);
  const { data: alertasRaw } = useAlertasSubtes();
  const alertas = Array.isArray(alertasRaw) ? alertasRaw : [];
  const alertasLinea = useMemo(
    () => alertas.filter((a) => a.route_ids?.some((r) => r.toLowerCase().includes(id.toLowerCase()))),
    [alertas, id]
  );

  if (!route) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-[var(--text-muted)]">Línea no encontrada</p>
        <Link href="/" className="text-[var(--primary)] underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const colorLinea = route.color ?? "#9ca3af";
  const markers = useMemo(
    () =>
      estaciones.map((e) => ({
        id: e.id,
        lat: e.lat,
        lng: e.lng,
        type: "subte" as const,
        nombre: e.nombre,
        label: e.nombre,
      })),
    [estaciones]
  );

  const centerLat =
    estaciones.length > 0
      ? estaciones.reduce((s, e) => s + e.lat, 0) / estaciones.length
      : BA_CENTER.lat;
  const centerLng =
    estaciones.length > 0
      ? estaciones.reduce((s, e) => s + e.lng, 0) / estaciones.length
      : BA_CENTER.lng;

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      <header className="fixed top-0 left-0 right-0 h-14 bg-[var(--bg-app)] border-b border-[var(--border)] flex items-center px-4 z-40 gap-3">
        <Link href="/" className="text-[var(--text-muted)] active:text-[var(--primary)] transition-colors">
          <BackIcon size={20} />
        </Link>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
          style={{ backgroundColor: colorLinea }}
        >
          {route.nombre}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-[var(--text-primary)] text-sm truncate">
            Línea {route.nombre}
          </h1>
          <p className="text-xs text-[var(--text-muted)] truncate" title={route.nombreLargo}>
            {route.nombreLargo}
          </p>
        </div>
      </header>

      <div className="pt-14">
        {/* Mapa de la línea */}
        <div style={{ height: "220px" }}>
          <Mapa
            lat={centerLat}
            lng={centerLng}
            height="220px"
            zoom={14}
            markers={markers}
            subteLines={subteLines}
            showLayerControls={false}
          />
        </div>

        <div className="px-4 pb-8 space-y-6 mt-4">
          {/* Alertas */}
          {alertasLinea.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wide">
                Alertas
              </h2>
              {alertasLinea.map((a, i) => (
                <AlertaServicio key={a.id ?? i} mensaje={a.header_text} lineas={a.route_ids} />
              ))}
            </div>
          )}

          {/* Horarios */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wide">
              Horarios de servicio
            </h2>
            <HorariosLineaTable horarios={horarios} color={colorLinea} />
          </div>

          {/* Estaciones */}
          <div className="space-y-2">
            <h2
              className="text-xs font-semibold uppercase tracking-wide pl-2.5 py-1.5 rounded-r"
              style={{
                color: "var(--text-dim)",
                borderLeft: `3px solid ${colorLinea}`,
                background: `${colorLinea}15`,
              }}
            >
              Estaciones ({estaciones.length})
            </h2>
            <div
              className="rounded-2xl overflow-hidden border border-[var(--border)]"
              style={{ background: "var(--bg-elevated)" }}
            >
              {estaciones.map((est) => (
                <Link
                  key={est.id}
                  href={`/parada/${est.plataformas[0] ?? est.id}?from=linea&linea=${route.nombre}`}
                  className="flex items-center gap-3 px-4 py-3.5 active:bg-white/5 transition-colors border-b border-[var(--border-light)] last:border-b-0"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                    style={{
                      backgroundColor: colorLinea,
                      boxShadow: `0 2px 8px ${colorLinea}40`,
                    }}
                  >
                    {route.nombre}
                  </div>
                  <span className="flex-1 text-sm font-semibold text-[var(--text-primary)]">
                    {est.nombre}
                  </span>
                  <span className="text-[var(--text-muted)] text-lg">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
