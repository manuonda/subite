interface AlertaServicioProps {
  mensaje: string;
  lineas?: string[];
}

export function AlertaServicio({ mensaje, lineas }: AlertaServicioProps) {
  return (
    <div
      className="rounded-2xl p-3 mb-4 flex gap-2 border transition-colors"
      style={{
        background: "var(--alert-danger-bg)",
        borderColor: "var(--alert-danger-border)",
      }}
    >
      <span
        className="text-base flex-shrink-0"
        style={{ color: "var(--alert-danger-heading)" }}
        aria-hidden
      >
        ⚠
      </span>
      <div>
        {lineas && lineas.length > 0 && (
          <p
            className="text-xs font-bold mb-0.5"
            style={{ color: "var(--alert-danger-heading)" }}
          >
            {lineas.join(", ")}
          </p>
        )}
        <p className="text-xs leading-snug" style={{ color: "var(--alert-danger-text)" }}>
          {mensaje}
        </p>
      </div>
    </div>
  );
}
