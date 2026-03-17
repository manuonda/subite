export interface VehiclePosition {
  id: string;
  route_id: string;
  trip_id: string;
  lat: number;
  lng: number;
  bearing?: number;
  speed?: number;
  timestamp: number;
}

export interface TripUpdate {
  trip_id: string;
  route_id: string;
  stop_time_updates: StopTimeUpdate[];
}

export interface StopTimeUpdate {
  stop_id: string;
  stop_sequence: number;
  arrival?: { time: number; delay: number };
  departure?: { time: number; delay: number };
}

export function tiempoRestante(unixTimestamp: number): number {
  return Math.max(0, Math.round((unixTimestamp - Date.now() / 1000) / 60));
}

export function formatTiempo(minutos: number): string {
  if (minutos === 0) return "Ahora";
  if (minutos === 1) return "1 min";
  return `${minutos} min`;
}
