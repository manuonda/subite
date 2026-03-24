"use client";

import { useState, useEffect, useMemo } from "react";
import { TarjetaSubte } from "@/app/components/TarjetaSubte";
import { AlertaServicio } from "@/app/components/AlertaServicio";
import { useForecastSubtes, useAlertasSubtes } from "@/hooks/useSubtes";
import { getSubteRoutes } from "@/lib/subte";

export function ListaSubtes() {
  const routes = useMemo(() => getSubteRoutes(), []);
  const { data: forecastRaw, isLoading } = useForecastSubtes();
  const forecast = Array.isArray(forecastRaw) ? forecastRaw : [];
  const { data: alertas } = useAlertasSubtes();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Math.floor(Date.now() / 1000));
  }, []);

  /** Próximo arribo en minutos por route_id (el más cercano de ese forecast). Normaliza SubteA→LineaA. */
  const proximoPorLinea = useMemo(() => {
    if (now === null) return {};
    const map: Record<string, number> = {};
    for (const f of forecast) {
      const letra = f.route_id.replace(/^(Subte|Linea)_?/i, "").charAt(0)?.toUpperCase() || "";
      const lineaId = `Linea${letra}`;
      const mins = Math.max(0, Math.round((f.arrival_time - now) / 60));
      if (map[lineaId] === undefined || mins < map[lineaId]) {
        map[lineaId] = mins;
      }
    }
    return map;
  }, [forecast, now]);

  return (
    <div className="space-y-4">
      {alertas && alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((a, i) => (
            <AlertaServicio key={i} mensaje={a.header_text} lineas={a.route_ids} />
          ))}
        </div>
      )}

      <h3 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wide">
        Todas las líneas
      </h3>

      {isLoading && routes.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {routes.map((r) => (
            <TarjetaSubte
              key={r.id}
              lineaId={r.id}
              nombreLargo={r.nombreLargo}
              color={r.color}
              tiempoEstimado={proximoPorLinea[r.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
