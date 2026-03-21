/**
 * Fuente: data/subtes/shapes.txt + trips.txt → processed/shapes.json
 * Contiene: polilíneas geográficas de cada línea para dibujar en el mapa.
 * Cada entrada representa un trazado único (route + shape_id).
 */

import raw from "@/data/subtes/processed/shapes.json";
import type { SubteLineOverlay } from "@/app/components/Mapa";

interface RawShapeLine {
  routeId: string;
  shapeId: string;
  color: string;
  points: [number, number][];
}

/** Polilíneas GTFS listas para el componente Mapa */
export function subteLinesForMap(): SubteLineOverlay[] {
  const data = raw as RawShapeLine[];
  return data.map((r) => ({
    shapeId: r.shapeId,
    color: r.color,
    points: r.points,
  }));
}

/** Polilíneas filtradas por línea (ej: "LineaA") */
export function subteLinesForRoute(routeId: string): SubteLineOverlay[] {
  const data = raw as RawShapeLine[];
  return data
    .filter((r) => r.routeId === routeId)
    .map((r) => ({ shapeId: r.shapeId, color: r.color, points: r.points }));
}
