interface TarjetaParadaProps {
  nombre: string;
  lineas: string[];
  tiempo?: number;
  tipo: "colectivo" | "subte";
  onClick?: () => void;
}

export function TarjetaParada({ nombre, lineas, tiempo, tipo, onClick }: TarjetaParadaProps) {
  const icon = tipo === "subte" ? "🚇" : "🚌";
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3 active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3 items-start">
          <span className="text-xl mt-0.5">{icon}</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{nombre}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {lineas.slice(0, 4).join(" · ")}
            </p>
          </div>
        </div>
        {tiempo !== undefined && (
          <span className="text-xs font-bold text-[#1a56db] bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap">
            {tiempo === 0 ? "Ahora" : `${tiempo} min`}
          </span>
        )}
      </div>
    </button>
  );
}
