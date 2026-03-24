interface TarjetaArriboProps {
  routeId: string;
  nombre: string;
  tiempoMinutos: number;
  color?: string;
}

export function TarjetaArribo({ routeId, nombre, tiempoMinutos, color = "var(--primary)" }: TarjetaArriboProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[var(--border-light)] last:border-0">
      <div
        className="text-white font-bold text-xs px-2.5 py-1.5 rounded-xl min-w-[44px] text-center"
        style={{ backgroundColor: color }}
      >
        {routeId}
      </div>
      <p className="flex-1 text-sm text-[var(--text-primary)]">{nombre}</p>
      <span className="text-sm font-bold text-[var(--primary)]">
        {tiempoMinutos === 0 ? "Ahora" : `${tiempoMinutos} min`}
      </span>
    </div>
  );
}
