#!/usr/bin/env npx tsx
/**
 * Pre-procesa los archivos GTFS CSV y genera JSON optimizados.
 * Ejecutar después de gtfs:update (descarga).
 *
 * Uso: npm run gtfs:build
 */

import * as fs from "fs";
import * as path from "path";
import Papa from "papaparse";

const DATA_DIR = path.resolve(process.cwd(), "data");
const SUBTES_RAW = path.join(DATA_DIR, "subtes");
const SUBTES_PROCESSED = path.join(DATA_DIR, "subtes", "processed");

interface GtfsStop {
  stop_id: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
  location_type: string;
  parent_station?: string;
}

interface GtfsRoute {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_color?: string;
  route_text_color?: string;
  route_type: string;
}

interface ProcessedStop {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  parent?: string;
}

interface ProcessedRoute {
  id: string;
  nombre: string;
  nombreLargo: string;
  color: string;
  tipo: number;
}

function parseCsv<T>(filePath: string): T[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const result = Papa.parse<T>(content, { header: true, skipEmptyLines: true });
  return result.data;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function buildSubtes() {
  const stopsPath = path.join(SUBTES_RAW, "stops.txt");
  const routesPath = path.join(SUBTES_RAW, "routes.txt");

  if (!fs.existsSync(stopsPath) || !fs.existsSync(routesPath)) {
    console.error("❌ Ejecutá primero: npm run gtfs:update");
    process.exit(1);
  }

  ensureDir(SUBTES_PROCESSED);

  // Procesar stops: solo plataformas (location_type 0) con coordenadas
  const stopsRaw = parseCsv<GtfsStop>(stopsPath);
  const stops: ProcessedStop[] = stopsRaw
    .filter((s) => s.stop_lat && s.stop_lon && s.location_type === "0")
    .map((s) => ({
      id: s.stop_id,
      nombre: s.stop_name?.trim() || "",
      lat: parseFloat(s.stop_lat),
      lng: parseFloat(s.stop_lon),
      parent: s.parent_station || undefined,
    }));

  // Procesar routes: solo subte (route_type 1), excluir premetro (0)
  const routesRaw = parseCsv<GtfsRoute>(routesPath);
  const routes: ProcessedRoute[] = routesRaw
    .filter((r) => r.route_type === "1")
    .map((r) => ({
      id: r.route_id,
      nombre: r.route_short_name || r.route_id.replace("Linea", ""),
      nombreLargo: r.route_long_name || "",
      color: r.route_color ? `#${r.route_color}` : "#9ca3af",
      tipo: parseInt(r.route_type, 10),
    }));

  fs.writeFileSync(
    path.join(SUBTES_PROCESSED, "stops.json"),
    JSON.stringify(stops, null, 0)
  );
  fs.writeFileSync(
    path.join(SUBTES_PROCESSED, "routes.json"),
    JSON.stringify(routes, null, 0)
  );

  console.log(`✅ Subtes: ${stops.length} paradas, ${routes.length} líneas`);
  console.log(`   → ${SUBTES_PROCESSED}/`);
}

function main() {
  console.log("BondiYa — Pre-procesando GTFS\n");
  buildSubtes();
  console.log("\n✅ Listo. Ejecutá npm run dev para usar los datos.");
}

main();
