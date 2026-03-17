const SUBTES_BASE = "https://apitransporte.buenosaires.gob.ar/subtes";
const CLIENT_ID = process.env.GCBA_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GCBA_CLIENT_SECRET || "";

export interface ForecastSubte {
  route_id: string;
  trip_id: string;
  stop_id: string;
  arrival_time: number;
  departure_time: number;
}

export interface AlertaSubte {
  id: string;
  header_text: string;
  description_text: string;
  route_ids: string[];
  effect: string;
}

export async function fetchForecastSubtes(): Promise<ForecastSubte[]> {
  const url = new URL(`${SUBTES_BASE}/forecastGTFS`);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("client_secret", CLIENT_SECRET);

  const res = await fetch(url.toString(), { next: { revalidate: 15 } });
  if (!res.ok) throw new Error(`Subtes API error: ${res.status}`);
  return res.json();
}

export async function fetchAlertasSubtes(): Promise<AlertaSubte[]> {
  const url = new URL(`${SUBTES_BASE}/serviceAlerts`);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("client_secret", CLIENT_SECRET);

  const res = await fetch(url.toString(), { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`Subtes API error: ${res.status}`);
  return res.json();
}

export const COLORES_SUBTE: Record<string, string> = {
  A: "#60a5fa",
  B: "#f87171",
  C: "#a78bfa",
  D: "#34d399",
  E: "#fb923c",
  H: "#facc15",
};

export function getColorSubte(lineaId: string): string {
  const letra = lineaId.toUpperCase().replace("LINEA_", "").replace("SUBTE", "").trim();
  return COLORES_SUBTE[letra] || "#9ca3af";
}
