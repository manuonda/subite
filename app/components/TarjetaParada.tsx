interface TarjetaParadaProps {
  nombre: string;
  lineas: string[];
  tiempo?: number;
  tipo: "colectivo" | "subte";
  onClick?: () => void;
}

export function TarjetaParada({ nombre, lineas, tiempo, tipo, onClick }: TarjetaParadaProps) {
  const icon = tipo === "subte" ? "🚇" : "🚏";
  const accentColor = tipo === "subte" ? "var(--subte-c)" : "var(--primary)";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 transition-all"
      style={{ borderBottom: "1px solid var(--border-light)" }}
    >
      {/* Icono */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-[15px] shrink-0"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid var(--border)",
        }}
      >
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate leading-tight">
          {nombre}
        </p>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {lineas.slice(0, 5).map((l) => (
            <span
              key={l}
              className="text-[9px] font-black px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
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
