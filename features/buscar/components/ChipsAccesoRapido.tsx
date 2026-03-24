interface ChipsAccesoRapidoProps {
  onSelect: (query: string) => void;
}

const SUBTES = ["A", "B", "C", "D", "E", "H"];
const COLECTIVOS = ["60", "12", "152", "39", "130", "29"];

export function ChipsAccesoRapido({ onSelect }: ChipsAccesoRapidoProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wide mb-3">Acceso rápido</h3>

      <div className="mb-4">
        <p className="text-xs text-[var(--text-muted)] mb-2">Subtes</p>
        <div className="flex flex-wrap gap-2">
          {SUBTES.map((s) => (
            <button
              key={s}
              onClick={() => onSelect(`Subte ${s}`)}
              className="px-4 py-2 bg-[var(--primary-muted)] text-[var(--primary)] font-bold text-sm rounded-full border border-[var(--primary-border)] active:bg-[var(--primary-muted)]/80 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2">Colectivos frecuentes</p>
        <div className="flex flex-wrap gap-2">
          {COLECTIVOS.map((c) => (
            <button
              key={c}
              onClick={() => onSelect(`Línea ${c}`)}
              className="px-4 py-2 bg-[var(--accent-orange)]/15 text-[var(--accent-orange)] font-bold text-sm rounded-full border border-[var(--accent-orange)]/30 active:opacity-80 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
