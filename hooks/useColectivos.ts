"use client";
import { useQuery } from "@tanstack/react-query";

export interface ColectivoInfo {
  id: string;
  route_id: string;
  nombre: string;
  lat: number;
  lng: number;
  distancia?: number;
  tiempoEstimado?: number;
}

async function fetchColectivos(lat: number, lng: number): Promise<ColectivoInfo[]> {
  const res = await fetch(`/api/colectivos?lat=${lat}&lng=${lng}`);
  if (!res.ok) throw new Error("Error al obtener colectivos");
  return res.json();
}

export function useColectivos(lat: number | null, lng: number | null) {
  return useQuery({
    queryKey: ["colectivos", lat, lng],
    queryFn: () => fetchColectivos(lat!, lng!),
    enabled: lat !== null && lng !== null,
    refetchInterval: 15000,
    staleTime: 10000,
  });
}
