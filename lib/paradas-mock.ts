/**
 * Paradas mock con coordenadas para el mapa.
 * En producción se reemplazaría por GTFS stops.txt o API de paradas cercanas.
 */

export interface ParadaConCoords {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  lineas: string[];
  tipo: "colectivo" | "subte";
}

/** Genera paradas mock cerca de una posición (lat, lng) */
export function getParadasCercanas(lat: number, lng: number): ParadaConCoords[] {
  const offset = 0.003; // ~300m
  return [
    { id: "p1", nombre: "Av. Corrientes y Callao", lat: lat + offset * 0.5, lng: lng + offset * 0.3, lineas: ["60", "12", "39"], tipo: "colectivo" },
    { id: "p2", nombre: "Subte B - Uruguay", lat: lat - offset * 0.2, lng: lng + offset * 0.1, lineas: ["B"], tipo: "subte" },
    { id: "p3", nombre: "Av. Santa Fe y Callao", lat: lat + offset * 0.8, lng: lng - offset * 0.2, lineas: ["152", "60"], tipo: "colectivo" },
    { id: "p4", nombre: "Av. Corrientes y Riobamba", lat: lat - offset * 0.4, lng: lng + offset * 0.6, lineas: ["55", "140"], tipo: "colectivo" },
    { id: "p5", nombre: "Subte A - Lima", lat: lat + offset * 0.3, lng: lng - offset * 0.5, lineas: ["A"], tipo: "subte" },
  ];
}
