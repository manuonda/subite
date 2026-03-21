import rawStops from "@/data/subtes/processed/stops.json";

export interface SubteStopRecord {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  parent?: string;
}

const STOPS = rawStops as SubteStopRecord[];

/** Todas las plataformas GTFS (andenes) con coordenadas */
export function getSubteStops(): SubteStopRecord[] {
  return STOPS;
}

/** Datos listos para el mapa (tipo `subte`) */
export function subteStopsToMarkers() {
  return STOPS.map((s) => ({
    id: s.id,
    lat: s.lat,
    lng: s.lng,
    type: "subte" as const,
    nombre: s.nombre,
    parent: s.parent,
    label: s.nombre,
  }));
}
