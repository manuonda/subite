import { COLORES_SUBTE } from "@/lib/subtes";

interface TarjetaSubteProps {
  lineaId: string;
  estacion?: string;
  tiempoEstimado?: number;
}

function getLetra(routeId: string): string {
  return routeId.toUpperCase().replace("SUBTE", "").replace("LINEA_", "").replace("_", "").trim().charAt(0) || routeId;
}

export function TarjetaSubte({ lineaId, estacion, tiempoEstimado }: TarjetaSubteProps) {
  const letra = getLetra(lineaId);
  const color = COLORES_SUBTE[letra] || "#9ca3af";

  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-[var(--border)] mb-3">
      <div className="flex items-center gap-3">
        <div
          className="text-white font-bold text-sm w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          {letra}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[var(--text-primary)] text-sm">Subte {letra}</p>
          {estacion && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Est. {estacion}</p>
          )}
        </div>
        {tiempoEstimado !== undefined && (
          <span className="text-sm font-bold text-white px-3 py-1.5 rounded-xl"
                style={{ backgroundColor: color }}>
            {tiempoEstimado === 0 ? "Ahora" : `${tiempoEstimado} min`}
          </span>
        )}
      </div>
    </div>
  );
}
