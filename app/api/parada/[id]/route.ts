import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Mock data for development
  const now = Math.floor(Date.now() / 1000);
  return NextResponse.json({
    id,
    nombre: `Parada ${id}`,
    lat: -34.6037,
    lng: -58.3816,
    arribos: [
      { route_id: "60", nombre: "Línea 60", arrival_time: now + 180, color: "#f59e0b" },
      { route_id: "12", nombre: "Línea 12", arrival_time: now + 480, color: "#1a56db" },
      { route_id: "152", nombre: "Línea 152", arrival_time: now + 720, color: "#22c55e" },
    ],
  });
}
