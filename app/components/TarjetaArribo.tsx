interface TarjetaArriboProps {
  routeId: string;
  nombre: string;
  tiempoMinutos: number;
  color?: string;
}

export function TarjetaArribo({ routeId, nombre, tiempoMinutos, color = "#1a56db" }: TarjetaArriboProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div
        className="text-white font-bold text-xs px-2.5 py-1.5 rounded-xl min-w-[44px] text-center"
        style={{ backgroundColor: color }}
      >
        {routeId}
      </div>
      <p className="flex-1 text-sm text-gray-700">{nombre}</p>
      <span className="text-sm font-bold text-gray-800">
        {tiempoMinutos === 0 ? "Ahora" : `${tiempoMinutos} min`}
      </span>
    </div>
  );
}
