interface TarjetaParadaProps {
  nombre: string;
  lineas: string[];
  tiempo?: number;
  tipo: "colectivo" | "subte";
  /** Color de la línea (para subte: badges; para colectivo: acento tiempo) */
  colorLinea?: string;
  onClick?: () => void;
}

export function TarjetaParada({ nombre, lineas, tiempo, tipo, colorLinea, onClick }: TarjetaParadaProps) {
  const icon = tipo === "subte" ? "🚇" : "🚏";
  const accentColor = colorLinea ?? (tipo === "subte" ? "var(--subte-c)" : "var(--primary)");

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 transition-all active:bg-white/5 border-b border-[var(--border-light)] last:border-b-0"
    >
      {/* Icono */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
        style={{
          background: colorLinea ? `${colorLinea}22` : "rgba(255,255,255,0.05)",
          border: `1.5px solid ${colorLinea ? `${colorLinea}55` : "var(--border)"}`,
        }}
      >
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate leading-tight">
          {nombre}
        </p>
        <div className="flex gap-1.5 mt-1.5 flex-wrap">
          {lineas.slice(0, 5).map((l) => (
            <span
              key={l}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{
                background: colorLinea ? `${colorLinea}20` : "rgba(255,255,255,0.06)",
                color: colorLinea ?? "var(--text-muted)",
                border: `1px solid ${colorLinea ? `${colorLinea}40` : "var(--border)"}`,
                fontFamily: "var(--font-space-mono)",
              }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Tiempo */}
      {tiempo !== undefined && (
        <div className="text-right shrink-0">
          <div
            className={`font-black text-lg leading-none ${tiempo === 0 ? "pulse-glow" : ""}`}
            style={{
              color: accentColor,
              fontFamily: "var(--font-space-mono)",
            }}
          >
            {tiempo === 0 ? "Ya" : tiempo}
          </div>
          {tiempo > 0 && (
            <div className="text-[9px] mt-0.5" style={{ color: "var(--text-dim)" }}>
              min
            </div>
          )}
        </div>
      )}
    </button>
  );
}
