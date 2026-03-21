#!/usr/bin/env npx tsx
/**
 * Pre-procesa los archivos GTFS CSV y genera JSON optimizados.
 * Ejecutar después de gtfs:update (descarga).
 *
 * Uso: npm run gtfs:build
 *
 * Archivos generados en data/subtes/processed/:
 *   stops.json          – Plataformas/andenes (location_type=0)
 *   estaciones.json     – Estaciones padre con sus plataformas y accesos
 *   accesos.json        – Entradas/salidas (location_type=2)
 *   routes.json         – Líneas de subte (route_type=1, excluye premetro)
 *   shapes.json         – Trazados geográficos por línea
 *   trips.json          – Viajes por línea, servicio y sentido
 *   stop_times.json     – Horarios por viaje agrupados por trip_id
 *   frequencies.json    – Frecuencias por franja horaria agrupadas por trip_id
 *   calendar.json       – Días de servicio por service_id
 *   calendar_dates.json – Excepciones al calendario
 *   pathways.json       – Conexiones dentro/entre estaciones
 *   transfers.json      – Tiempos de trasbordo entre líneas
 *   fare_attributes.json – Tarifas base
 */

import * as fs from "fs";
import * as path from "path";
import Papa from "papaparse";

const DATA_DIR = path.resolve(process.cwd(), "data");
const SUBTES_RAW = path.join(DATA_DIR, "subtes");
const SUBTES_PROCESSED = path.join(DATA_DIR, "subtes", "processed");

// ─── Tipos raw GTFS ───────────────────────────────────────────────────────────

interface GtfsStop {
  stop_id: string;
  stop_name: string;
  stop_desc?: string;
  stop_lat: string;
  stop_lon: string;
  location_type: string;
  parent_station?: string;
  wheelchair_boarding?: string;
}

interface GtfsRoute {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_color?: string;
  route_text_color?: string;
  route_type: string;
}

interface GtfsTrip {
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign?: string;
  direction_id?: string;
  shape_id?: string;
}

interface GtfsShapeRow {
  shape_id: string;
  shape_pt_lat: string;
  shape_pt_lon: string;
  shape_pt_sequence: string;
}

interface GtfsStopTime {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: string;
}

interface GtfsFrequency {
  trip_id: string;
  start_time: string;
  end_time: string;
  headway_secs: string;
  exact_times?: string;
}

interface GtfsCalendar {
  service_id: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  start_date: string;
  end_date: string;
}

interface GtfsCalendarDate {
  service_id: string;
  date: string;
  exception_type: string;
}

interface GtfsPathway {
  pathway_id: string;
  from_stop_id: string;
  to_stop_id: string;
  pathway_mode: string;
  signposted_as?: string;
  reversed_signposted_as?: string;
  is_bidirectional?: string;
  traversal_time?: string;
}

interface GtfsTransfer {
  from_stop_id: string;
  to_stop_id: string;
  transfer_type: string;
  min_transfer_time?: string;
}

interface GtfsFareAttribute {
  fare_id: string;
  price: string;
  currency_type: string;
  payment_method: string;
  transfers: string;
}

// ─── Tipos procesados ─────────────────────────────────────────────────────────

/** Plataforma/andén donde el pasajero aborda (location_type=0) */
interface ProcessedStop {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  parent?: string;         // ID de estación padre
  accesible?: boolean;     // wheelchair_boarding = 1
}

/**
 * Estación padre (location_type=1 implícita).
 * Agrupa las plataformas y accesos bajo un mismo nodo.
 */
interface ProcessedEstacion {
  id: string;
  nombre: string;
  lat: number;             // promedio de plataformas
  lng: number;
  plataformas: string[];   // stop_ids de andenes (ej: ["1164N","1164S"])
  accesos: string[];       // stop_ids de entradas/salidas
}

/** Entrada o salida física de la estación (location_type=2) */
interface ProcessedAcceso {
  id: string;
  descripcion: string;
  lat: number;
  lng: number;
  parent: string;          // estación padre
  accesible?: boolean;
}

interface ProcessedRoute {
  id: string;
  nombre: string;
  nombreLargo: string;
  color: string;
  tipo: number;
}

/** Polilínea por rama GTFS (trips.shape_id → shapes.txt) */
interface ProcessedShapeLine {
  routeId: string;
  shapeId: string;
  color: string;
  points: [number, number][];
}

interface ProcessedTrip {
  id: string;
  routeId: string;
  serviceId: string;
  headsign: string;
  direction: number;       // 0=ida, 1=vuelta
  shapeId: string;
}

/** Horarios de un viaje completo, ordenados por stop_sequence */
interface ProcessedStopTimes {
  tripId: string;
  paradas: {
    stopId: string;
    llegada: string;
    salida: string;
    seq: number;
  }[];
}

/** Frecuencias agrupadas por trip_id */
interface ProcessedFrequency {
  tripId: string;
  franjas: {
    inicio: string;
    fin: string;
    cada: number;          // headway_secs
  }[];
}

interface ProcessedCalendar {
  serviceId: string;
  lunes: boolean;
  martes: boolean;
  miercoles: boolean;
  jueves: boolean;
  viernes: boolean;
  sabado: boolean;
  domingo: boolean;
  inicio: string;
  fin: string;
}

interface ProcessedCalendarDate {
  serviceId: string;
  fecha: string;
  tipo: number;            // 1=agrega servicio, 2=quita servicio
}

/** Conexión interna dentro o entre estaciones (pathways) */
interface ProcessedPathway {
  id: string;
  desde: string;           // from_stop_id
  hasta: string;           // to_stop_id
  modo: number;            // 1=corredor, 2=escalera, 3=ascensor, 4=puerta, 5=salida, 6=elevador
  cartel?: string;         // signposted_as
  bidireccional: boolean;
  tiempo: number;          // traversal_time en segundos
}

/** Trasbordo mínimo entre paradas de distintas líneas */
interface ProcessedTransfer {
  desde: string;
  hasta: string;
  tipo: number;
  tiempoMin: number;       // min_transfer_time en segundos
}

interface ProcessedFareAttribute {
  id: string;
  precio: number;
  moneda: string;
  metodoPago: number;      // 0=prepago, 1=abordo
  trasbordos: number;
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

function parseCsv<T>(filePath: string): T[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const result = Papa.parse<T>(content, { header: true, skipEmptyLines: true });
  return result.data;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filename: string, data: unknown) {
  const outPath = path.join(SUBTES_PROCESSED, filename);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 0));
  const count = Array.isArray(data) ? data.length : Object.keys(data as object).length;
  console.log(`  ✓ ${filename.padEnd(24)} ${count} registros`);
}

function requireFile(filePath: string, name: string): boolean {
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠  Falta ${name} — se omite`);
    return false;
  }
  return true;
}

// ─── Builders ─────────────────────────────────────────────────────────────────

function buildStopsAndEstaciones(stopsPath: string): {
  stops: ProcessedStop[];
  estaciones: ProcessedEstacion[];
  accesos: ProcessedAcceso[];
} {
  const raw = parseCsv<GtfsStop>(stopsPath);

  const platforms = raw.filter((s) => s.location_type === "0" && s.stop_lat && s.stop_lon);
  const entries   = raw.filter((s) => s.location_type === "2" && s.stop_lat && s.stop_lon);

  const stops: ProcessedStop[] = platforms.map((s) => ({
    id: s.stop_id,
    nombre: s.stop_name?.trim() || "",
    lat: parseFloat(s.stop_lat),
    lng: parseFloat(s.stop_lon),
    parent: s.parent_station || undefined,
    ...(s.wheelchair_boarding === "1" ? { accesible: true } : {}),
  }));

  const accesos: ProcessedAcceso[] = entries.map((s) => ({
    id: s.stop_id,
    descripcion: (s.stop_name?.trim() || s.stop_desc?.trim() || ""),
    lat: parseFloat(s.stop_lat),
    lng: parseFloat(s.stop_lon),
    parent: s.parent_station || "",
    ...(s.wheelchair_boarding === "1" ? { accesible: true } : {}),
  }));

  // Agrupar plataformas y accesos por parent_station → estaciones
  const platsByParent = new Map<string, ProcessedStop[]>();
  for (const s of stops) {
    if (!s.parent) continue;
    if (!platsByParent.has(s.parent)) platsByParent.set(s.parent, []);
    platsByParent.get(s.parent)!.push(s);
  }

  const accesosByParent = new Map<string, ProcessedAcceso[]>();
  for (const a of accesos) {
    if (!a.parent) continue;
    if (!accesosByParent.has(a.parent)) accesosByParent.set(a.parent, []);
    accesosByParent.get(a.parent)!.push(a);
  }

  const estaciones: ProcessedEstacion[] = [];
  for (const [parentId, plats] of platsByParent) {
    const lat = plats.reduce((acc, p) => acc + p.lat, 0) / plats.length;
    const lng = plats.reduce((acc, p) => acc + p.lng, 0) / plats.length;
    const nombre = plats[0].nombre;
    const accs = accesosByParent.get(parentId) ?? [];

    estaciones.push({
      id: parentId,
      nombre,
      lat: parseFloat(lat.toFixed(8)),
      lng: parseFloat(lng.toFixed(8)),
      plataformas: plats.map((p) => p.id),
      accesos: accs.map((a) => a.id),
    });
  }

  return { stops, estaciones, accesos };
}

function buildRoutes(routesPath: string): ProcessedRoute[] {
  const raw = parseCsv<GtfsRoute>(routesPath);
  return raw
    .filter((r) => r.route_type === "1")
    .map((r) => ({
      id: r.route_id,
      nombre: r.route_short_name || r.route_id.replace("Linea", ""),
      nombreLargo: r.route_long_name || "",
      color: r.route_color ? `#${r.route_color}` : "#9ca3af",
      tipo: parseInt(r.route_type, 10),
    }));
}

function buildShapeLines(
  routes: ProcessedRoute[],
  tripsPath: string,
  shapesPath: string
): ProcessedShapeLine[] {
  const routeColor = new Map(routes.map((r) => [r.id, r.color]));
  const routeIds = new Set(routes.map((r) => r.id));

  const tripsRaw = parseCsv<GtfsTrip>(tripsPath);
  const shapeIdsNeeded = new Set<string>();
  for (const t of tripsRaw) {
    if (t.shape_id && routeIds.has(t.route_id)) shapeIdsNeeded.add(t.shape_id);
  }

  const shapesRaw = parseCsv<GtfsShapeRow>(shapesPath);
  const byShape = new Map<string, GtfsShapeRow[]>();
  for (const row of shapesRaw) {
    if (!shapeIdsNeeded.has(row.shape_id)) continue;
    if (!byShape.has(row.shape_id)) byShape.set(row.shape_id, []);
    byShape.get(row.shape_id)!.push(row);
  }
  for (const rows of byShape.values()) {
    rows.sort((a, b) => parseInt(a.shape_pt_sequence) - parseInt(b.shape_pt_sequence));
  }

  const pointsByShape = new Map<string, [number, number][]>();
  for (const [shapeId, rows] of byShape) {
    pointsByShape.set(shapeId, rows.map((r) => [parseFloat(r.shape_pt_lat), parseFloat(r.shape_pt_lon)]));
  }

  const seenPair = new Set<string>();
  const out: ProcessedShapeLine[] = [];
  for (const t of tripsRaw) {
    if (!t.shape_id || !routeIds.has(t.route_id)) continue;
    const key = `${t.route_id}\t${t.shape_id}`;
    if (seenPair.has(key)) continue;
    seenPair.add(key);
    const pts = pointsByShape.get(t.shape_id);
    if (!pts || pts.length < 2) continue;
    out.push({ routeId: t.route_id, shapeId: t.shape_id, color: routeColor.get(t.route_id) ?? "#9ca3af", points: pts });
  }
  return out;
}

function buildTrips(tripsPath: string, routes: ProcessedRoute[]): ProcessedTrip[] {
  const routeIds = new Set(routes.map((r) => r.id));
  const raw = parseCsv<GtfsTrip>(tripsPath);
  return raw
    .filter((t) => routeIds.has(t.route_id))
    .map((t) => ({
      id: t.trip_id,
      routeId: t.route_id,
      serviceId: t.service_id,
      headsign: t.trip_headsign?.trim() || "",
      direction: parseInt(t.direction_id || "0", 10),
      shapeId: t.shape_id || "",
    }));
}

function buildStopTimes(stopTimesPath: string): ProcessedStopTimes[] {
  const raw = parseCsv<GtfsStopTime>(stopTimesPath);

  const byTrip = new Map<string, GtfsStopTime[]>();
  for (const r of raw) {
    if (!byTrip.has(r.trip_id)) byTrip.set(r.trip_id, []);
    byTrip.get(r.trip_id)!.push(r);
  }

  const out: ProcessedStopTimes[] = [];
  for (const [tripId, rows] of byTrip) {
    rows.sort((a, b) => parseInt(a.stop_sequence) - parseInt(b.stop_sequence));
    out.push({
      tripId,
      paradas: rows.map((r) => ({
        stopId: r.stop_id,
        llegada: r.arrival_time,
        salida: r.departure_time,
        seq: parseInt(r.stop_sequence, 10),
      })),
    });
  }
  return out;
}

function buildFrequencies(freqPath: string): ProcessedFrequency[] {
  const raw = parseCsv<GtfsFrequency>(freqPath);

  const byTrip = new Map<string, GtfsFrequency[]>();
  for (const r of raw) {
    if (!byTrip.has(r.trip_id)) byTrip.set(r.trip_id, []);
    byTrip.get(r.trip_id)!.push(r);
  }

  return Array.from(byTrip.entries()).map(([tripId, rows]) => ({
    tripId,
    franjas: rows.map((r) => ({
      inicio: r.start_time,
      fin: r.end_time,
      cada: parseInt(r.headway_secs, 10),
    })),
  }));
}

function buildCalendar(calPath: string): ProcessedCalendar[] {
  const raw = parseCsv<GtfsCalendar>(calPath);
  return raw.map((r) => ({
    serviceId: r.service_id,
    lunes:     r.monday    === "1",
    martes:    r.tuesday   === "1",
    miercoles: r.wednesday === "1",
    jueves:    r.thursday  === "1",
    viernes:   r.friday    === "1",
    sabado:    r.saturday  === "1",
    domingo:   r.sunday    === "1",
    inicio:    r.start_date,
    fin:       r.end_date,
  }));
}

function buildCalendarDates(datesPath: string): ProcessedCalendarDate[] {
  const raw = parseCsv<GtfsCalendarDate>(datesPath);
  return raw.map((r) => ({
    serviceId: r.service_id,
    fecha:     r.date,
    tipo:      parseInt(r.exception_type, 10),
  }));
}

function buildPathways(pathwaysPath: string): ProcessedPathway[] {
  const raw = parseCsv<GtfsPathway>(pathwaysPath);
  return raw.map((r) => ({
    id:            r.pathway_id,
    desde:         r.from_stop_id,
    hasta:         r.to_stop_id,
    modo:          parseInt(r.pathway_mode, 10),
    ...(r.signposted_as ? { cartel: r.signposted_as } : {}),
    bidireccional: r.is_bidirectional === "1",
    tiempo:        parseInt(r.traversal_time || "0", 10),
  }));
}

function buildTransfers(transfersPath: string): ProcessedTransfer[] {
  const raw = parseCsv<GtfsTransfer>(transfersPath);
  return raw.map((r) => ({
    desde:     r.from_stop_id,
    hasta:     r.to_stop_id,
    tipo:      parseInt(r.transfer_type, 10),
    tiempoMin: parseInt(r.min_transfer_time || "0", 10),
  }));
}

function buildFareAttributes(farePath: string): ProcessedFareAttribute[] {
  const raw = parseCsv<GtfsFareAttribute>(farePath);
  return raw
    .filter((r) => r.fare_id && r.price)
    .map((r) => ({
      id:          r.fare_id,
      precio:      parseFloat(r.price),
      moneda:      r.currency_type,
      metodoPago:  parseInt(r.payment_method, 10),
      trasbordos:  parseInt(r.transfers || "0", 10),
    }));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log("BondiYa — Pre-procesando GTFS\n");

  const raw = (name: string) => path.join(SUBTES_RAW, name);

  if (!requireFile(raw("stops.txt"), "stops.txt") || !requireFile(raw("routes.txt"), "routes.txt")) {
    console.error("\n❌ Ejecutá primero: npm run gtfs:update");
    process.exit(1);
  }

  ensureDir(SUBTES_PROCESSED);

  // 1. Stops, estaciones y accesos
  const { stops, estaciones, accesos } = buildStopsAndEstaciones(raw("stops.txt"));
  writeJson("stops.json",     stops);
  writeJson("estaciones.json", estaciones);
  writeJson("accesos.json",   accesos);

  // 2. Rutas
  const routes = buildRoutes(raw("routes.txt"));
  writeJson("routes.json", routes);

  // 3. Trips
  if (requireFile(raw("trips.txt"), "trips.txt")) {
    const trips = buildTrips(raw("trips.txt"), routes);
    writeJson("trips.json", trips);

    // 4. Shapes (necesita trips)
    if (requireFile(raw("shapes.txt"), "shapes.txt")) {
      const shapes = buildShapeLines(routes, raw("trips.txt"), raw("shapes.txt"));
      writeJson("shapes.json", shapes);
    } else {
      writeJson("shapes.json", []);
    }
  }

  // 5. Stop times
  if (requireFile(raw("stop_times.txt"), "stop_times.txt")) {
    writeJson("stop_times.json", buildStopTimes(raw("stop_times.txt")));
  }

  // 6. Frecuencias
  if (requireFile(raw("frequencies.txt"), "frequencies.txt")) {
    writeJson("frequencies.json", buildFrequencies(raw("frequencies.txt")));
  }

  // 7. Calendario
  if (requireFile(raw("calendar.txt"), "calendar.txt")) {
    writeJson("calendar.json", buildCalendar(raw("calendar.txt")));
  }

  if (requireFile(raw("calendar_dates.txt"), "calendar_dates.txt")) {
    writeJson("calendar_dates.json", buildCalendarDates(raw("calendar_dates.txt")));
  }

  // 8. Pathways (conexiones dentro de estaciones)
  if (requireFile(raw("pathways.txt"), "pathways.txt")) {
    writeJson("pathways.json", buildPathways(raw("pathways.txt")));
  }

  // 9. Transfers (trasbordos entre líneas)
  if (requireFile(raw("transfers.txt"), "transfers.txt")) {
    writeJson("transfers.json", buildTransfers(raw("transfers.txt")));
  }

  // 10. Tarifas
  if (requireFile(raw("fare_attributes.txt"), "fare_attributes.txt")) {
    writeJson("fare_attributes.json", buildFareAttributes(raw("fare_attributes.txt")));
  }

  console.log(`\n✅ Listo → ${SUBTES_PROCESSED}/`);
}

main();
