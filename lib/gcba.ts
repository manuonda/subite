import { GCBA_BASE, GCBA_CLIENT_ID, GCBA_CLIENT_SECRET } from "@/constants/gcba";

const CLIENT_ID = GCBA_CLIENT_ID || "";
const CLIENT_SECRET = GCBA_CLIENT_SECRET || "";

export async function fetchColectivosCercanos(lat: number, lng: number, radio = 500) {
  const url = new URL(`${GCBA_BASE}/colectivos/vehiclePositionsSimple`);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("client_secret", CLIENT_SECRET);

  const res = await fetch(url.toString(), { next: { revalidate: 10 } });
  if (!res.ok) throw new Error(`GCBA API error: ${res.status}`);
  return res.json();
}

export async function fetchParada(id: string) {
  const url = new URL(`${GCBA_BASE}/colectivos/tripUpdates`);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("client_secret", CLIENT_SECRET);

  const res = await fetch(url.toString(), { next: { revalidate: 15 } });
  if (!res.ok) throw new Error(`GCBA API error: ${res.status}`);
  return res.json();
}
