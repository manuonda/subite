"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TarjetaSubte } from "./TarjetaSubte";
import { useForecastSubtes, useAlertasSubtes } from "@/features/subtes/hooks/useSubtes";
import { getSubteRoutes } from "@/lib/subte";
import {
  routeIdsFromAlert,
  pickTranslatedText,
  canonicalLineaRouteId,
} from "@/lib/subte/service-alert-helpers";
import { useLocale } from "@/app/context/LocaleContext";
import type { SubteServiceAlertEntity } from "@/types/subtes/subteServiceAlert";

export function ListaSubtes() {
  const { t } = useLocale();
  const router = useRouter();
  const routes = useMemo(() => getSubteRoutes(), []);
  const { data: forecastRaw, isLoading } = useForecastSubtes();
  const forecast = Array.isArray(forecastRaw) ? forecastRaw : [];
  const { data: alertasGtfs } = useAlertasSubtes();
  const alertEntities =
    alertasGtfs && !Array.isArray(alertasGtfs) && Array.isArray(alertasGtfs.entity)
      ? alertasGtfs.entity.filter((e) => !e.is_deleted && e.alert)
      : [];

  /** Alertas agrupadas por id de línea (LineaA, …) alineado con TarjetaSubte. */
  const alertsByLineaId = useMemo(() => {
    const m = new Map<string, SubteServiceAlertEntity[]>();
    for (const ent of alertEntities) {
      for (const rid of routeIdsFromAlert(ent.alert)) {
        const lineKey = routes.find(
          (r) => r.id.toLowerCase() === canonicalLineaRouteId(rid).toLowerCase()
        )?.id;
        if (!lineKey) continue;
        const list = m.get(lineKey) ?? [];
        if (!list.some((x) => x.id === ent.id)) list.push(ent);
        m.set(lineKey, list);
      }
    }
    return m;
  }, [alertEntities, routes]);

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
      <h3 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wide">
        {t("linesAll")}
      </h3>

      {isLoading && routes.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-16 rounded-2xl animate-pulse"
              style={{ background: "var(--bg-panel-subtle)" }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {routes.map((r) => {
            const lineAlerts = alertsByLineaId.get(r.id) ?? [];
            const serviceAlertMessages = lineAlerts
              .map((ent) => pickTranslatedText(ent.alert?.header_text))
              .filter((msg): msg is string => Boolean(msg));
            return (
              <TarjetaSubte
                key={r.id}
                lineaId={r.id}
                nombreLargo={r.nombreLargo}
                color={r.color}
                tiempoEstimado={proximoPorLinea[r.id]}
                serviceAlertMessages={
                  serviceAlertMessages.length > 0 ? serviceAlertMessages : undefined
                }
                onClick={() => {
                  const q = lineAlerts.length > 0 ? "?alerta=1" : "";
                  router.push(`/linea/${r.nombre}${q}`);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
