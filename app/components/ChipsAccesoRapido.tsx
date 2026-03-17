interface ChipsAccesoRapidoProps {
  onSelect: (query: string) => void;
}

const SUBTES = ["A", "B", "C", "D", "E", "H"];
const COLECTIVOS = ["60", "12", "152", "39", "130", "29"];

export function ChipsAccesoRapido({ onSelect }: ChipsAccesoRapidoProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Acceso rápido</h3>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Subtes</p>
        <div className="flex flex-wrap gap-2">
          {SUBTES.map((s) => (
            <button
              key={s}
              onClick={() => onSelect(`Subte ${s}`)}
              className="px-4 py-2 bg-blue-50 text-[#1a56db] font-bold text-sm rounded-full active:bg-blue-100 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2">Colectivos frecuentes</p>
        <div className="flex flex-wrap gap-2">
          {COLECTIVOS.map((c) => (
            <button
              key={c}
              onClick={() => onSelect(`Línea ${c}`)}
              className="px-4 py-2 bg-amber-50 text-[#f59e0b] font-bold text-sm rounded-full active:bg-amber-100 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
