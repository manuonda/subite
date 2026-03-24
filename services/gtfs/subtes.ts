/**
 * Servicio GTFS para Subtes.
 * Lee datos pre-procesados (stops.json, routes.json) generados por gtfs:build.
 * Solo server-side: usar desde Route Handlers o Server Components.
 */

import * as fs from "fs";
import * as path from "path";
import { calcularDistancia } from "@/shared/utils/geo";
import type { GtfsRoute, GtfsStop } from "@/types/gtfs";

const DATA_DIR = path.join(process.cwd(), "data", "subtes", "processed");

let stopsCache: GtfsStop[] = [];
let routesCache: GtfsRoute[] = [];

function loadStops(): GtfsStop[] {
  if (!stopsCache) {
    const file = path.join(DATA_DIR, "stops.json");
    if (!fs.existsSync(file)) return [];
    stopsCache = JSON.parse(fs.readFileSync(file, "utf-8"));
  }
  return stopsCache;
}

function loadRoutes(): GtfsRoute[] {
  if (!routesCache) {
    const file = path.join(DATA_DIR, "routes.json");
    if (!fs.existsSync(file)) return [];
    routesCache = JSON.parse(fs.readFileSync(file, "utf-8"));
  }
  return routesCache;
}

/** Paradas de subte ordenadas por distancia a (lat, lng). Máximo radio ~2km. */
export function getStopsByLocation(
  lat: number,
  lng: number,
  radioMetros = 1500,
  limite = 20
): (GtfsStop & { distancia: number })[] {
  const stops = loadStops();
  const user = { lat, lng };

  return stops
    .map((s) => ({
      ...s,
      distancia: calcularDistancia(user, { lat: s.lat, lng: s.lng }),
    }))
    .filter((s) => s.distancia <= radioMetros)
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, limite);
}

/** Todas las líneas de subte (A, B, C, D, E, H). */
export function getRoutesSubtes(): GtfsRoute[] {
  return loadRoutes();
}

export function getStopsSubtes(): GtfsStop[] {
  return loadStops();
}
