import { GCBA_BASE, GCBA_CLIENT_ID, GCBA_CLIENT_SECRET } from "@/constants/gcba";
import { buildGcbaVehiclePositionsUrl, parseVehiclePositionsFeed } from "@/lib/colectivos-gcba";

const CLIENT_ID = GCBA_CLIENT_ID || "";
const CLIENT_SECRET = GCBA_CLIENT_SECRET || "";

/** Servidor: posiciones GCBA normalizadas (misma fuente que `GET /api/colectivos`) */
export async function fetchColectivosCercanos(lat: number, lng: number) {
  const url = buildGcbaVehiclePositionsUrl({});
  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`GCBA API error: ${res.status}`);
  const raw: unknown = await res.json();
  return parseVehiclePositionsFeed(raw, lat, lng);
}

export async function fetchParada(id: string) {
  const url = new URL(`${GCBA_BASE}/colectivos/tripUpdates`);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("client_secret", CLIENT_SECRET);

  const res = await fetch(url.toString(), { next: { revalidate: 15 } });
  if (!res.ok) throw new Error(`GCBA API error: ${res.status}`);
  return res.json();
}
