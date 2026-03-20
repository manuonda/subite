import { NextResponse } from "next/server";
import { GCBA_SUBTES_BASE, GCBA_CLIENT_ID, GCBA_CLIENT_SECRET } from "@/constants/gcba";

const CLIENT_ID = GCBA_CLIENT_ID || "";
const CLIENT_SECRET = GCBA_CLIENT_SECRET || "";

export async function GET() {
  try {
    const url = new URL(`${GCBA_SUBTES_BASE}/serviceAlerts`);
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
