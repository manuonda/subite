import { NextRequest, NextResponse } from "next/server";

const GCBA_BASE = "https://apitransporte.buenosaires.gob.ar";
const CLIENT_ID = process.env.GCBA_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GCBA_CLIENT_SECRET || "";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = searchParams.get("lat") || "-34.6037";
  const lng = searchParams.get("lng") || "-58.3816";

  try {
    const url = new URL(`${GCBA_BASE}/colectivos/vehiclePositionsSimple`);
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("client_secret", CLIENT_SECRET);

    const res = await fetch(url.toString(), {
      next: { revalidate: 10 },
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) {
      // Return mock data for development
      return NextResponse.json(getMockColectivos(parseFloat(lat), parseFloat(lng)));
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(getMockColectivos(parseFloat(lat), parseFloat(lng)));
  }
}

function getMockColectivos(lat: number, lng: number) {
  return [
    { id: "v1", route_id: "60", nombre: "Línea 60", lat: lat + 0.002, lng: lng + 0.001, distancia: 250, tiempoEstimado: 3 },
    { id: "v2", route_id: "12", nombre: "Línea 12", lat: lat - 0.001, lng: lng + 0.002, distancia: 180, tiempoEstimado: 2 },
    { id: "v3", route_id: "152", nombre: "Línea 152", lat: lat + 0.003, lng: lng - 0.001, distancia: 420, tiempoEstimado: 5 },
    { id: "v4", route_id: "39", nombre: "Línea 39", lat: lat - 0.002, lng: lng - 0.002, distancia: 650, tiempoEstimado: 8 },
  ];
}
