import { NextResponse } from "next/server";
import { GCBA_SUBTES_BASE, GCBA_CLIENT_ID, GCBA_CLIENT_SECRET } from "@/constants/gcba";

const CLIENT_ID = GCBA_CLIENT_ID || "";
const CLIENT_SECRET = GCBA_CLIENT_SECRET || "";

export async function GET() {
  try {
    const url = new URL(`${GCBA_SUBTES_BASE}/forecastGTFS`);
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("client_secret", CLIENT_SECRET);

    const res = await fetch(url.toString(), { next: { revalidate: 15 } });
    if (!res.ok) return NextResponse.json(getMockForecast());

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(getMockForecast());
  }
}

function getMockForecast() {
  const now = Math.floor(Date.now() / 1000);
  return [
    { route_id: "SubteA", trip_id: "trip_a1", stop_id: "lima", arrival_time: now + 240, departure_time: now + 250 },
    { route_id: "SubteB", trip_id: "trip_b1", stop_id: "uruguay", arrival_time: now + 420, departure_time: now + 430 },
    { route_id: "SubteC", trip_id: "trip_c1", stop_id: "diagonal_norte", arrival_time: now + 180, departure_time: now + 190 },
    { route_id: "SubteD", trip_id: "trip_d1", stop_id: "catedral", arrival_time: now + 600, departure_time: now + 610 },
    { route_id: "SubteE", trip_id: "trip_e1", stop_id: "belgrano", arrival_time: now + 360, departure_time: now + 370 },
    { route_id: "SubteH", trip_id: "trip_h1", stop_id: "once", arrival_time: now + 300, departure_time: now + 310 },
  ];
}
