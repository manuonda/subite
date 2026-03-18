"use client";
import { TarjetaArribo } from "./TarjetaArribo";
import { useQuery } from "@tanstack/react-query";

interface Arribo {
  route_id: string;
  nombre: string;
  arrival_time: number;
  color?: string;
}

interface ParadaData {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  arribos: Arribo[];
}

interface ProximosArribosProps {
  paradaId: string;
}

export function ProximosArribos({ paradaId }: ProximosArribosProps) {
  const { data, isLoading } = useQuery<ParadaData>({
    queryKey: ["parada", paradaId],
    queryFn: async () => {
      const res = await fetch(`/api/parada/${paradaId}`);
      if (!res.ok) throw new Error("Error al cargar parada");
      return res.json();
    },
    refetchInterval: 15000,
  });

  const now = Math.floor(Date.now() / 1000);

  if (isLoading) {
    return (
      <div className="space-y-3 px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4">
      <h2 className="text-sm font-semibold text-[var(--text-dim)] uppercase tracking-wide mb-3">
        Próximas llegadas
      </h2>
      <div className="bg-white/5 rounded-2xl border border-[var(--border)] px-4">
        {data?.arribos.map((a, i) => (
          <TarjetaArribo
            key={i}
            routeId={a.route_id}
            nombre={a.nombre}
            tiempoMinutos={Math.max(0, Math.round((a.arrival_time - now) / 60))}
            color={a.color}
          />
        ))}
      </div>
      <p className="text-xs text-[var(--text-muted)] mt-3 text-center">⚠ Sin alertas activas</p>
    </div>
  );
}
