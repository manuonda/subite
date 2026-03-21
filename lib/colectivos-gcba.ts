import { GCBA_BASE, GCBA_CLIENT_ID, GCBA_CLIENT_SECRET } from "@/constants/gcba";

const CLIENT_ID = GCBA_CLIENT_ID || "";
const CLIENT_SECRET = GCBA_CLIENT_SECRET || "";

/** Formato normalizado que consume el mapa y la lista de la app */
export interface ColectivoInfo {
  id: string;
  route_id: string;
  nombre: string;
  lat: number;
  lng: number;
  distancia?: number;
  tiempoEstimado?: number;
}

/** Construye la URL oficial `GET .../colectivos/vehiclePositions` con credenciales y filtros */
export function buildGcbaVehiclePositionsUrl(params: {
  agency_id?: string | null;
  route_id?: string | null;
  trip?: string | null;
}): URL {
  const url = new URL(`${GCBA_BASE}/colectivos/vehiclePositions`);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("client_secret", CLIENT_SECRET);
  url.searchParams.set("json", "1");
  if (params.agency_id) url.searchParams.set("agency_id", params.agency_id);
  if (params.route_id) url.searchParams.set("route_id", params.route_id);
  if (params.trip) url.searchParams.set("Trip", params.trip);
  return url;
}

/** Distancia en metros entre dos puntos WGS84 (misma fórmula que para `distancia` en el feed real). */
export function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/**
 * Convierte la respuesta JSON de GCBA (`json=1`) al modelo de la app.
 *
 * Soporta:
 * - GTFS-Realtime estándar (`entity[].vehicle.position.latitude`, …)
 * - Formato extendido de la API BA con prefijos `_` (`_vehicle._position._latitude`, `_vehicle._vehicle._id`, …)
 * - Arreglos “simples” o filas sueltas con `lat`/`lng`
 *
 * Nota: la API **no** acepta `lat`/`lng` como filtros; las posiciones vienen en cada vehículo.
 */
export function parseVehiclePositionsFeed(
  data: unknown,
  userLat: number,
  userLng: number
): ColectivoInfo[] {
  if (data == null) return [];

  if (Array.isArray(data)) {
    const fromArray = data
      .map((row, i) => parseOneVehicleRow(row, i, userLat, userLng))
      .filter(Boolean) as ColectivoInfo[];
    if (fromArray.length > 0) return fromArray;
    return data.map((row, i) => normalizeSimpleRow(row, i, userLat, userLng)).filter(Boolean) as ColectivoInfo[];
  }

  if (typeof data !== "object") return [];
  const root = data as Record<string, unknown>;
  const entities = (root.entity ?? root.result ?? root.entities) as unknown;
  if (!Array.isArray(entities)) return [];

  const out: ColectivoInfo[] = [];
  for (let i = 0; i < entities.length; i++) {
    const parsed = parseOneVehicleRow(entities[i], i, userLat, userLng);
    if (parsed) out.push(parsed);
  }
  return out;
}

/** Una fila/entidad: GTFS estándar o formato `_` de GCBA */
function parseOneVehicleRow(
  row: unknown,
  index: number,
  userLat: number,
  userLng: number
): ColectivoInfo | null {
  if (!row || typeof row !== "object") return null;
  const ent = row as Record<string, unknown>;

  const vp = (ent.vehicle ?? ent._vehicle) as Record<string, unknown> | undefined;
  if (!vp) return normalizeSimpleRow(row, index, userLat, userLng);

  const pos = (vp.position ?? vp._position) as Record<string, unknown> | undefined;
  if (!pos) return null;

  const lat = Number(
    pos.latitude ?? pos._latitude ?? pos.lat ?? pos._lat
  );
  const lng = Number(
    pos.longitude ?? pos._longitude ?? pos.lng ?? pos._lng
  );
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const trip = (vp.trip ?? vp._trip) as Record<string, unknown> | null | undefined;
  const tripRoute =
    trip && typeof trip === "object"
      ? (trip.route_id ?? trip.routeId ?? trip._route_id)
      : undefined;

  const vehDesc = (vp.vehicle ?? vp._vehicle) as Record<string, unknown> | undefined;
  const vehicleId = String(
    vehDesc?.id ?? vehDesc?._id ?? vp.vehicle_id ?? ent.id ?? ent._id ?? `veh-${index}`
  );
  const label = vehDesc != null ? String(vehDesc.label ?? vehDesc._label ?? "") : "";

  let routeId = tripRoute != null ? String(tripRoute) : "";
  if (!routeId && label) {
    const head = label.split(/[-\s]/)[0]?.trim();
    if (head) routeId = head;
  }
  if (!routeId) routeId = "—";

  const nombre = label ? `Línea ${label}` : `Línea ${routeId}`;

  const user = { lat: userLat, lng: userLng };
  const distancia = Math.round(haversineMeters(user, { lat, lng }));

  return {
    id: vehicleId,
    route_id: routeId,
    nombre,
    lat,
    lng,
    distancia,
    tiempoEstimado: Math.max(1, Math.round(distancia / 400)),
  };
}

function normalizeSimpleRow(row: unknown, index: number, userLat: number, userLng: number): ColectivoInfo | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const lat = Number(r.lat ?? r.latitude);
  const lng = Number(r.lng ?? r.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const route_id = String(r.route_id ?? r.routeId ?? "—");
  const id = String(r.id ?? `v-${index}`);
  const user = { lat: userLat, lng: userLng };
  const distancia =
    r.distancia != null && Number.isFinite(Number(r.distancia))
      ? Number(r.distancia)
      : Math.round(haversineMeters(user, { lat, lng }));
  return {
    id,
    route_id,
    nombre: String(r.nombre ?? `Línea ${route_id}`),
    lat,
    lng,
    distancia,
    tiempoEstimado:
      r.tiempoEstimado != null && Number.isFinite(Number(r.tiempoEstimado))
        ? Number(r.tiempoEstimado)
        : Math.max(1, Math.round(distancia / 400)),
  };
}
