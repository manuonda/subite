import { COLORES_SUBTE } from "@/constants/subtes";

interface TarjetaSubteProps {
  lineaId: string;
  estacion?: string;
  nombreLargo?: string;
  tiempoEstimado?: number;
  color?: string;
  onClick?: () => void;
}

function getLetra(routeId: string): string {
  const s = routeId.replace(/^(Linea|Subte)/i, "").trim();
  return s.charAt(0).toUpperCase() || routeId;
}

export function TarjetaSubte({
  lineaId,
  estacion,
  nombreLargo,
  tiempoEstimado,
  color: colorProp,
  onClick,
}: TarjetaSubteProps) {
  const letra = getLetra(lineaId);
  const color = colorProp ?? (COLORES_SUBTE[letra as keyof typeof COLORES_SUBTE] || "#9ca3af");

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className="mb-2 rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${color}`,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div className="flex items-center gap-3 p-3.5">
        {/* Badge línea */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0"
          style={{
            background: `${color}22`,
            border: `1.5px solid ${color}55`,
            color: color,
          }}
        >
          {letra}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[var(--text-primary)]">
            Línea {letra}
          </p>
          {(estacion || nombreLargo) && (
            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}
               title={nombreLargo ?? estacion}>
              {nombreLargo ?? (estacion ? `Est. ${estacion}` : "")}
            </p>
          )}
        </div>

        {/* Tiempo */}
        {tiempoEstimado !== undefined && (
          <div
            className={`text-xs font-black px-2.5 py-1.5 rounded-xl shrink-0 ${tiempoEstimado === 0 ? "pulse-glow" : ""}`}
            style={{
              background: tiempoEstimado === 0 ? color : `${color}20`,
              color: tiempoEstimado === 0 ? "#fff" : color,
              border: `1px solid ${color}40`,
              fontFamily: "var(--font-space-mono)",
            }}
          >
            {tiempoEstimado === 0 ? "Ahora" : `${tiempoEstimado}m`}
          </div>
        )}
      </div>
    </div>
  );
}
