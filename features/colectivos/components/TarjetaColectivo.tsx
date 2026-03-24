interface TarjetaColectivoProps {
  routeId: string;
  nombre: string;
  distancia?: number;
  tiempoEstimado?: number;
}

export function TarjetaColectivo({ routeId, nombre, distancia, tiempoEstimado }: TarjetaColectivoProps) {
  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-[var(--border)] mb-3">
      <div className="flex items-center gap-3">
        <div className="bg-[var(--accent-orange)] text-white font-bold text-sm px-3 py-1.5 rounded-xl min-w-[48px] text-center font-mono">
          {routeId}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[var(--text-primary)] text-sm">{nombre}</p>
          {distancia !== undefined && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              📍 A {distancia < 1000 ? `${distancia}m` : `${(distancia/1000).toFixed(1)}km`}
            </p>
          )}
        </div>
        {tiempoEstimado !== undefined && (
          <span className="text-sm font-bold text-[var(--primary)] bg-[var(--primary-muted)] border border-[var(--primary-border)] px-3 py-1.5 rounded-xl">
            {tiempoEstimado === 0 ? "Ahora" : `${tiempoEstimado} min`}
          </span>
        )}
      </div>
    </div>
  );
}
