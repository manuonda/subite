/**
 * GET /api/paradas/cercanas?lat=X&lng=Y
 * Paradas de subte cercanas a la posición (GPS o fallback).
 */

import { NextRequest, NextResponse } from "next/server";
import { BA_CENTER } from "@/shared/constants/geo";
import { getStopsByLocation } from "@/services/gtfs/subtes";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  const lat = latParam ? parseFloat(latParam) : BA_CENTER.lat;
  const lng = lngParam ? parseFloat(lngParam) : BA_CENTER.lng;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json(
      { error: "lat y lng deben ser números válidos" },
      { status: 400 }
    );
  }

  const paradas = getStopsByLocation(lat, lng).map((p) => ({
    id: p.id,
    nombre: p.nombre,
    lat: p.lat,
    lng: p.lng,
    distancia: Math.round(p.distancia),
  }));

  return NextResponse.json(paradas);
}
