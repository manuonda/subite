"use client";
import { TarjetaParada } from "./TarjetaParada";
import { useRouter } from "next/navigation";

interface Parada {
  id: string;
  nombre: string;
  lineas: string[];
  tiempo?: number;
  tipo: "colectivo" | "subte";
}

interface ListaParadasProps {
  paradas: Parada[];
  loading?: boolean;
}

const MOCK_PARADAS: Parada[] = [
  { id: "p1", nombre: "Parada Corrientes 1234", lineas: ["60", "12", "39"], tiempo: 2, tipo: "colectivo" },
  { id: "p2", nombre: "Subte B - Uruguay", lineas: ["Línea B"], tiempo: 5, tipo: "subte" },
  { id: "p3", nombre: "Parada Santa Fe 800", lineas: ["152", "60"], tiempo: 7, tipo: "colectivo" },
];

export function ListaParadas({ paradas = MOCK_PARADAS, loading }: ListaParadasProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
        Paradas cerca tuyo
      </h2>
      {paradas.map((p) => (
        <TarjetaParada
          key={p.id}
          nombre={p.nombre}
          lineas={p.lineas}
          tiempo={p.tiempo}
          tipo={p.tipo}
          onClick={() => router.push(`/parada/${p.id}`)}
        />
      ))}
    </div>
  );
}
