interface TarjetaColectivoProps {
  routeId: string;
  nombre: string;
  distancia?: number;
  tiempoEstimado?: number;
}

export function TarjetaColectivo({ routeId, nombre, distancia, tiempoEstimado }: TarjetaColectivoProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
      <div className="flex items-center gap-3">
        <div className="bg-[#f59e0b] text-white font-bold text-sm px-3 py-1.5 rounded-xl min-w-[48px] text-center">
          {routeId}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800 text-sm">{nombre}</p>
          {distancia !== undefined && (
            <p className="text-xs text-gray-400 mt-0.5">
              📍 A {distancia < 1000 ? `${distancia}m` : `${(distancia/1000).toFixed(1)}km`}
            </p>
          )}
        </div>
        {tiempoEstimado !== undefined && (
          <span className="text-sm font-bold text-[#1a56db] bg-blue-50 px-3 py-1.5 rounded-xl">
            {tiempoEstimado === 0 ? "Ahora" : `${tiempoEstimado} min`}
          </span>
        )}
      </div>
    </div>
  );
}
