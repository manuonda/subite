"use client";
import { TarjetaSubte } from "./TarjetaSubte";
import { AlertaServicio } from "./AlertaServicio";
import { useForecastSubtes, useAlertasSubtes } from "@/hooks/useSubtes";

const ESTACIONES: Record<string, string> = {
  SubteA: "Lima",
  SubteB: "Uruguay",
  SubteC: "Diagonal Norte",
  SubteD: "Catedral",
  SubteE: "Belgrano",
  SubteH: "Once",
};

export function ListaSubtes() {
  const { data: forecastRaw, isLoading } = useForecastSubtes();
  const forecast = Array.isArray(forecastRaw) ? forecastRaw : [];
  const { data: alertas } = useAlertasSubtes();
  const now = Math.floor(Date.now() / 1000);

  return (
    <div className="px-4 pt-4">
      <h2 className="text-base font-bold text-gray-800 mb-4">Subtes cerca tuyo</h2>

      {alertas && alertas.length > 0 && alertas.map((a, i) => (
        <AlertaServicio key={i} mensaje={a.header_text} lineas={a.route_ids} />
      ))}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        forecast.map((f, i) => (
          <TarjetaSubte
            key={i}
            lineaId={f.route_id}
            estacion={ESTACIONES[f.route_id]}
            tiempoEstimado={Math.max(0, Math.round((f.arrival_time - now) / 60))}
          />
        ))
      )}
    </div>
  );
}
