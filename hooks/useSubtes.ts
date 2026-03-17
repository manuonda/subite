"use client";
import { useQuery } from "@tanstack/react-query";
import type { ForecastSubte, AlertaSubte } from "@/lib/subtes";

async function fetchForecast(): Promise<ForecastSubte[]> {
  const res = await fetch("/api/subtes/forecast");
  if (!res.ok) throw new Error("Error al obtener forecast de subtes");
  return res.json();
}

async function fetchAlertas(): Promise<AlertaSubte[]> {
  const res = await fetch("/api/subtes/alertas");
  if (!res.ok) throw new Error("Error al obtener alertas de subtes");
  return res.json();
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
  });
}
