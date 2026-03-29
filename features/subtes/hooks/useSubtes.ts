"use client";
import { useQuery } from "@tanstack/react-query";
import type { ForecastSubte } from "@/lib/subte";
import type { SubteServiceAlertGTFS } from "@/types/subtes/subteServiceAlert";

async function fetchForecast(): Promise<ForecastSubte[]> {
  const res = await fetch("/api/subtes/forecast");
  if (!res.ok) throw new Error("Error al obtener forecast de subtes");
  return res.json();
}

async function fetchAlertas(): Promise<SubteServiceAlertGTFS> {
  const res = await fetch("/api/subtes/alertas");
  if (!res.ok) throw new Error("Error al obtener alertas de subtes");
  const data: unknown = await res.json();
  if (Array.isArray(data)) return { entity: [] };
  return data as SubteServiceAlertGTFS;
}

export function useForecastSubtes() {
  return useQuery({
    queryKey: ["subtes", "forecast"],
    queryFn: fetchForecast,
    refetchInterval: 15000,
    staleTime: 10000,
  });
}

export function useAlertasSubtes() {
  return useQuery({
    queryKey: ["subtes", "alertas"],
    queryFn: fetchAlertas,
    refetchInterval: 60000,
    staleTime: 30000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}
