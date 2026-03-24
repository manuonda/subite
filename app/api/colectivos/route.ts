import { NextRequest, NextResponse } from "next/server";
import { BA_CENTER } from "@/shared/constants/geo";
import {
  buildGcbaVehiclePositionsUrl,
  haversineMeters,
  parseVehiclePositionsFeed,
  type ColectivoInfo,
} from "@/lib/colectivos-gcba";

/**
 * API interna: proxy hacia GCBA `GET /colectivos/vehiclePositions`.
 *
 * Devuelve la posición de los vehículos monitoreados actualizada cada 30 segundos.
 * Si no se pasan parámetros de entrada, retorna la posición actual de todos los
 * vehículos monitoreados.
 *
 * Query hacia GCBA (los reenviamos con `buildGcbaVehiclePositionsUrl`):
 * - `json=1` — obligatorio para JSON (si no, protobuf)
 * - `client_id`, `client_secret` — credenciales
 * - `agency_id`, `route_id` (enteros en la doc), `Trip` (string) — filtros opcionales
 *
 * Query solo BondiYa: `lat`, `lng` — referencia para distancia, no se envían a GCBA.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = parseFloat(searchParams.get("lat") || String(BA_CENTER.lat));
  const lng = parseFloat(searchParams.get("lng") || String(BA_CENTER.lng));
  const agency_id = searchParams.get("agency_id");
  const route_id = searchParams.get("route_id");
  const trip = searchParams.get("trip") ?? searchParams.get("Trip");

  try {
    const url = buildGcbaVehiclePositionsUrl({ agency_id, route_id, trip });

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(sortByDistance(getMockColectivos(lat, lng)));
    }

    const raw: unknown = await res.json();
    const normalized = parseVehiclePositionsFeed(raw, lat, lng);
    if (normalized.length === 0) {
      return NextResponse.json(sortByDistance(getMockColectivos(lat, lng)));
    }
    return NextResponse.json(sortByDistance(normalized));
  } catch {
    return NextResponse.json(sortByDistance(getMockColectivos(lat, lng)));
  }
}

function sortByDistance(list: ColectivoInfo[]): ColectivoInfo[] {
  return [...list].sort((a, b) => (a.distancia ?? 0) - (b.distancia ?? 0));
}

/** Vehículos de ejemplo alrededor del punto de referencia; distancias coherentes con lat/lng */
function getMockColectivos(lat: number, lng: number): ColectivoInfo[] {
  const user = { lat, lng };
  const seeds = [
    { id: "v1", route_id: "60", nombre: "Línea 60", dLat: 0.002, dLng: 0.001 },
    { id: "v2", route_id: "12", nombre: "Línea 12", dLat: -0.001, dLng: 0.002 },
    {
      id: "v3",
      route_id: "152",
      nombre: "Línea 152",
      dLat: 0.003,
      dLng: -0.001,
    },
    {
      id: "v4",
      route_id: "39",
      nombre: "Línea 39",
      dLat: -0.002,
      dLng: -0.002,
    },
  ] as const;

  return seeds.map((s) => {
    const vLat = lat + s.dLat;
    const vLng = lng + s.dLng;
    const distancia = Math.round(
      haversineMeters(user, { lat: vLat, lng: vLng }),
    );
    return {
      id: s.id,
      route_id: s.route_id,
      nombre: s.nombre,
      lat: vLat,
      lng: vLng,
      distancia,
      tiempoEstimado: Math.max(1, Math.round(distancia / 400)),
    };
  });
}
