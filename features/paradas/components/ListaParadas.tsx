"use client";
import { TarjetaParada } from "./TarjetaParada";
import { useRouter } from "next/navigation";

export interface Parada {
  id: string;
  nombre: string;
  lineas: string[];
  tiempo?: number;
  tipo: "colectivo" | "subte";
}

interface ListaParadasProps {
  paradas: Parada[];
  loading?: boolean;
  onParadaSelect?: (parada: Parada) => void;
}

const MOCK_PARADAS: Parada[] = [
  { id: "p1", nombre: "Parada Corrientes 1234", lineas: ["60", "12", "39"], tiempo: 2, tipo: "colectivo" },
  { id: "p2", nombre: "Subte B - Uruguay", lineas: ["Línea B"], tiempo: 5, tipo: "subte" },
  { id: "p3", nombre: "Parada Santa Fe 800", lineas: ["152", "60"], tiempo: 7, tipo: "colectivo" },
];

export function ListaParadas({ paradas = MOCK_PARADAS, loading, onParadaSelect }: ListaParadasProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[72px] bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {paradas.map((p) => (
        <TarjetaParada
          key={p.id}
          nombre={p.nombre}
          lineas={p.lineas}
          tiempo={p.tiempo}
          tipo={p.tipo}
          onClick={() => onParadaSelect ? onParadaSelect(p) : router.push(`/parada/${p.id}`)}
        />
      ))}
    </div>
  );
}
