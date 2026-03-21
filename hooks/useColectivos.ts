"use client";
import { useQuery } from "@tanstack/react-query";
import type { ColectivoInfo } from "@/lib/colectivos-gcba";

export type { ColectivoInfo };

export interface UseColectivosFilters {
  agency_id?: string;
  route_id?: string;
  trip?: string;
}

async function fetchColectivos(
  lat: number,
  lng: number,
  filters?: UseColectivosFilters
): Promise<ColectivoInfo[]> {
  const params = new URLSearchParams();
  params.set("lat", String(lat));
  params.set("lng", String(lng));
  if (filters?.agency_id) params.set("agency_id", filters.agency_id);
  if (filters?.route_id) params.set("route_id", filters.route_id);
  if (filters?.trip) params.set("trip", filters.trip);

  const res = await fetch(`/api/colectivos?${params.toString()}`);
  if (!res.ok) throw new Error("Error al obtener colectivos");
  return res.json();
}

export function useColectivos(
  lat: number | null,
  lng: number | null,
  filters?: UseColectivosFilters
) {
  return useQuery({
    queryKey: ["colectivos", lat, lng, filters],
    queryFn: () => fetchColectivos(lat!, lng!, filters),
    enabled: lat !== null && lng !== null,
    refetchInterval: 15000,
    staleTime: 10000,
  });
}
