interface AlertaServicioProps {
  mensaje: string;
  lineas?: string[];
}

export function AlertaServicio({ mensaje, lineas }: AlertaServicioProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3 mb-4 flex gap-2">
      <span className="text-red-400 text-base flex-shrink-0">⚠</span>
      <div>
        {lineas && lineas.length > 0 && (
          <p className="text-xs font-bold text-red-400 mb-0.5">
            {lineas.join(", ")}
          </p>
        )}
        <p className="text-xs text-red-300/90">{mensaje}</p>
      </div>
    </div>
  );
}
