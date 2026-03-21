# GTFS Subtes — Relaciones de datos

Documentación de cómo se relacionan los archivos procesados en `data/subtes/processed/` y sus wrappers TypeScript en `lib/subte/`.

---

## Jerarquía de entidades

```
routes.json  (LineaC)
    └── trips.json  (C01, C11, ...)          ← routeId
            ├── stop_times.json  (horarios)   ← tripId
            ├── frequencies.json (frecuencia) ← tripId
            └── calendar.json   (servicios)   ← serviceId

stops.json  (1164N)
    └── estaciones.json  (1164)              ← parent field
            ├── accesos.json    (11641...)    ← parent
            ├── transfers.json  (trasbordos)  ← desde/hasta stopId
            └── pathways.json  (conexiones)   ← desde/hasta stopId
```

---

## Stop vs Estación

| | Stop (`1164N`) | Estación (`1164`) |
|---|---|---|
| Qué es | Plataforma/andén físico donde para el tren | Agrupador lógico de plataformas |
| IDs | Sufijo N/S/E/O = sentido de circulación | Solo número |
| Coordenadas | Del andén exacto | Promedio de sus plataformas |
| Relación | `parent: "1164"` | `plataformas: ["1164N","1164S"]` |

---

## Entidades y campos clave

| Entidad | JSON | Wrapper | ID ejemplo | Campo de join | Descripción |
|---------|------|---------|-----------|---------------|-------------|
| Stop | `stops.json` | `lib/subte/stops.ts` | `"1164N"` | `parent="1164"` | Plataforma física (N/S=sentido) |
| Estación | `estaciones.json` | `lib/subte/estaciones.ts` | `"1164"` | `plataformas: ["1164N","1164S"]` | Agrupador de plataformas |
| Acceso | `accesos.json` | `lib/subte/accesos.ts` | `"11641"` | `parent="1164"` | Entrada física a la estación |
| Línea | `routes.json` | `lib/subte/routes.ts` | `"LineaC"` | — | Línea (A–H), color oficial |
| Viaje | `trips.json` | `lib/subte/trips.ts` | `"C01"` | `routeId`, `serviceId`, `shapeId` | Viaje: línea + dirección + servicio |
| Horario | `stop_times.json` | `lib/subte/stop-times.ts` | — | `tripId` + `stopId` | Llegada/salida por parada |
| Frecuencia | `frequencies.json` | `lib/subte/frequencies.ts` | — | `tripId` | Segundos entre trenes por franja horaria |
| Calendario | `calendar.json` | `lib/subte/calendar.ts` | `"5"` | `serviceId` | Lun-Vie=5, Sáb=6, Dom=7 |
| Trasbordo | `transfers.json` | `lib/subte/transfers.ts` | — | `desde` + `hasta` stopId | Tiempo mínimo entre líneas |
| Conexión | `pathways.json` | `lib/subte/pathways.ts` | — | `desde` + `hasta` stopId | Conexión física interna |

---

## Cadena de joins para el detalle de una parada

Ejemplo con `"1164N"` (plataforma Norte de la estación Retiro — Línea C):

```typescript
// 1. Datos físicos
const stop     = getSubteStop("1164N")            // lib/subte/stops.ts
const estacion = getEstacionDeParada("1164N")     // lib/subte/estaciones.ts
const accesos  = getAccesosDeEstacion("1164")     // lib/subte/accesos.ts

// 2. Servicio activo hoy (lun-vie / sáb / dom)
const serviceId = getServiceIdHoy()               // lib/subte/calendar.ts

// 3. Viajes de la línea activos hoy que pasan por esta parada
const trips = getTrips()
  .filter(t => t.serviceId === serviceId)
  .filter(t => getHorarioEnParada(t.id, "1164N") !== undefined)

// 4. Horario y frecuencia por viaje
trips.forEach(trip => {
  const horario = getHorarioEnParada(trip.id, "1164N")  // lib/subte/stop-times.ts
  const franja  = getFrecuenciaActual(trip.id, "08:30") // lib/subte/frequencies.ts
  const texto   = franja ? formatFrecuencia(franja.cada) : undefined // → "Cada 4 min"
})

// 5. Trasbordos disponibles desde aquí
const trasbordos = getTransfersDesde("1164N")  // lib/subte/transfers.ts

// 6. Conexiones físicas internas
const conexiones = getPathwaysDesde("1164N")   // lib/subte/pathways.ts
```

---

## Hook de alto nivel

`hooks/useParadaDetalle.ts` encapsula toda la cadena anterior y devuelve:

```typescript
interface ParadaDetalle {
  stop: SubteStop | undefined           // plataforma física
  estacion: SubteEstacion | undefined   // estación padre
  accesos: SubteAcceso[]               // entradas físicas
  sentido: string | undefined          // "Norte" | "Sur" | "Este" | "Oeste"
  viajes: ViajeEnParada[]              // trips activos hoy con horario y frecuencia
  primerServicio: string | undefined   // "05:30"
  ultimoServicio: string | undefined   // "23:00"
  trasbordos: TrasbordomDetalle[]      // otras líneas + tiempo caminando
  serviceIdHoy: string | undefined     // "5" | "6" | "7"
}
```

Uso:
```typescript
const detalle = useParadaDetalle("1164N")
```

---

## Pantalla de detalle (`app/parada/[id]/`)

La pantalla `ParadaPageClient.tsx` consume `useParadaDetalle` y muestra:

| Sección | Fuente de datos |
|---------|----------------|
| Header (nombre + línea + color) | `stops`, `estaciones`, `routes` |
| Mapa centrado en coords reales | `stops.lat/lng` |
| Badge accesible ♿ + sentido | `stops.accesible`, sufijo del ID |
| Nombre del recorrido completo | `routes.nombreLargo` |
| Frecuencia ahora / primer y último servicio | `frequencies`, `stop_times` |
| Próximas llegadas (tiempo real) | API GCBA — `ProximosArribos` |
| Trasbordos con minutos de caminata | `transfers`, `routes` |
| Accesos físicos ♿/🚶 | `accesos` |

---

## Archivos relevantes

```
data/subtes/processed/     ← JSONs procesados (build-gtfs.ts)
lib/subte/                 ← Wrappers TypeScript (uno por entidad)
  index.ts                 ← Barrel re-export
hooks/useParadaDetalle.ts  ← Hook de alto nivel con todos los joins
app/parada/[id]/
  ParadaPageClient.tsx     ← Pantalla de detalle de parada
  page.tsx
```
