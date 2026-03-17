import { NextResponse } from "next/server";

const GCBA_BASE = "https://apitransporte.buenosaires.gob.ar/subtes";
const CLIENT_ID = process.env.GCBA_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GCBA_CLIENT_SECRET || "";

export async function GET() {
  try {
    const url = new URL(`${GCBA_BASE}/serviceAlerts`);
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("client_secret", CLIENT_SECRET);

    const res = await fetch(url.toString(), { next: { revalidate: 30 } });
    if (!res.ok) return NextResponse.json([]);

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
