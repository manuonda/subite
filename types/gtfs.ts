/**
 * Tipos para datos GTFS pre-procesados (stops.json, routes.json).
 * Usados por services/gtfs/ para paradas cercanas y líneas.
 */

export interface GtfsStop {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  parent?: string;
}

export interface GtfsRoute {
  id: string;
  nombre: string;
  nombreLargo: string;
  color: string;
  tipo: number;
}
