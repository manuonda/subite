"use client";
import { TarjetaColectivo } from "./TarjetaColectivo";
import { RefreshIcon } from "./Icons";
import { useColectivos } from "@/hooks/useColectivos";

interface ListaColectivosProps {
  lat: number | null;
  lng: number | null;
}

export function ListaColectivos({ lat, lng }: ListaColectivosProps) {
  const { data, isLoading, dataUpdatedAt, refetch } = useColectivos(lat, lng);

  const segundos = dataUpdatedAt
    ? Math.round((Date.now() - dataUpdatedAt) / 1000)
    : null;

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800">Colectivos cerca tuyo</h2>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1 text-xs text-gray-400 active:text-[#1a56db] transition-colors"
        >
          {segundos !== null && <span>Hace {segundos}s</span>}
          <RefreshIcon size={14} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        data?.map((c) => (
          <TarjetaColectivo
            key={c.id}
            routeId={c.route_id}
            nombre={c.nombre}
            distancia={c.distancia}
            tiempoEstimado={c.tiempoEstimado}
          />
        ))
      )}
    </div>
  );
}
