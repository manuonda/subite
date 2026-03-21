import raw from "@/data/subtes/processed/shapes.json";
import type { SubteLineOverlay } from "@/app/components/Mapa";

interface RawShapeLine {
  routeId: string;
  shapeId: string;
  color: string;
  points: [number, number][];
}

/** Polilíneas GTFS generadas por `npm run gtfs:build` (trips + shapes). */
export function subteLinesForMap(): SubteLineOverlay[] {
  const data = raw as RawShapeLine[];
  return data.map((r) => ({
    shapeId: r.shapeId,
    color: r.color,
    points: r.points,
  }));
}
