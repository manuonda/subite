interface TarjetaParadaProps {
  nombre: string;
  lineas: string[];
  tiempo?: number;
  tipo: "colectivo" | "subte";
  onClick?: () => void;
}

export function TarjetaParada({ nombre, lineas, tiempo, tipo, onClick }: TarjetaParadaProps) {
  const icon = tipo === "subte" ? "🚇" : "🚏";
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 border-b border-[var(--border-light)] cursor-pointer transition-colors hover:bg-white/5 active:bg-white/5"
    >
      <div className="w-9 h-9 bg-[var(--primary-muted)] border border-[var(--primary-border)] rounded-xl flex items-center justify-center text-[15px] flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
          {nombre}
        </p>
        <div className="flex gap-1 mt-1 flex-wrap">
          {lineas.slice(0, 4).map((l) => (
            <span
              key={l}
              className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--primary-muted)] text-[var(--primary-hover)] border border-[var(--primary-border)]"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
      {tiempo !== undefined && (
        <div className="text-right flex-shrink-0">
          <div className="font-mono text-lg font-bold text-[var(--primary)] leading-none">
            {tiempo === 0 ? "Ahora" : tiempo}
          </div>
          <div className="text-[10px] text-[var(--text-dim)] mt-0.5">
            {tiempo === 0 ? "" : "min"}
          </div>
        </div>
      )}
    </button>
  );
}
