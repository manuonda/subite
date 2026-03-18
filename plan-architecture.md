# BondiYa — Plan de Arquitectura del Proyecto

## Contexto

BondiYa es una PWA mobile-first para transporte público de Buenos Aires (colectivos, subtes, trenes). La estructura actual mezcla concerns: tipos viven en hooks, servicios se mezclan con utilidades, datos mock están inline en las routes, y constantes están duplicadas hasta 5 veces. Este plan establece capas claras sin reescribir lógica existente.

**Stack:** Next.js 16 / React 19 / TanStack Query v5 / Leaflet / Tailwind CSS v4 / TypeScript

---

## Estructura Objetivo

```
/bondiya/
├── app/                            ← Next.js App Router (sin cambios estructurales)
│   ├── page.tsx                    ← Solo actualizar imports
│   ├── layout.tsx
│   ├── globals.css
│   ├── provider.tsx
│   ├── parada/[id]/page.tsx        ← Solo actualizar imports
│   └── api/                        ← Route Handlers (sin cambios de lógica)
│       ├── colectivos/route.ts
│       ├── parada/[id]/route.ts
│       └── subtes/
│           ├── forecast/route.ts
│           └── alertas/route.ts
│
├── components/                     ← MOVER desde app/components/ + organizar por dominio
│   ├── colectivos/
│   │   ├── ListaColectivos.tsx
│   │   └── TarjetaColectivo.tsx
│   ├── subtes/
│   │   ├── ListaSubtes.tsx
│   │   ├── TarjetaSubte.tsx
│   │   └── AlertaServicio.tsx
│   ├── paradas/
│   │   ├── ListaParadas.tsx
│   │   ├── TarjetaParada.tsx
│   │   ├── ProximosArribos.tsx
│   │   └── TarjetaArribo.tsx
│   ├── mapa/
│   │   └── Mapa.tsx
│   ├── buscar/
│   │   ├── BuscadorFallback.tsx
│   │   └── ChipsAccesoRapido.tsx
│   ├── shell/                      ← Chrome visible en todas las rutas
│   │   ├── BottomNav.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── StatusBar.tsx
│   │   └── PantallaPermisos.tsx
│   └── ui/                         ← Primitivos genéricos sin lógica de dominio
│       └── Icons.tsx
│
├── hooks/                          ← Igual + nuevo useParada.ts
│   ├── useGPS.ts
│   ├── useColectivos.ts
│   ├── useSubtes.ts
│   └── useParada.ts                ← NUEVO: extraído de ProximosArribos
│
├── services/                       ← NUEVO: HTTP clients server-only
│   ├── gcba.ts                     ← Funciones fetch desde lib/gcba.ts
│   └── subtes.ts                   ← Funciones fetch desde lib/subtes.ts
│
├── types/                          ← NUEVO: todas las interfaces TypeScript compartidas
│   ├── colectivos.ts               ← ColectivoInfo
│   ├── subtes.ts                   ← ForecastSubte, AlertaSubte
│   ├── paradas.ts                  ← ParadaConCoords, Arribo, ParadaData
│   ├── geo.ts                      ← Coords, GPSStatus, GPSState
│   └── index.ts                    ← Re-export barrel: import type { X } from "@/types"
│
├── constants/                      ← NUEVO: valores sin lógica
│   ├── gcba.ts                     ← GCBA_BASE (hoy: 5 copias duplicadas → 1)
│   ├── geo.ts                      ← BA_CENTER (hoy: 3 copias duplicadas → 1)
│   └── subtes.ts                   ← COLORES_SUBTE, getColorSubte, ESTACIONES
│
├── utils/                          ← RENOMBRAR desde lib/ (solo funciones puras)
│   ├── geo.ts                      ← desde lib/geo.ts
│   └── gtfs.ts                     ← desde lib/gtfs.ts
│
├── mocks/                          ← NUEVO: datos mock para desarrollo
│   ├── colectivos.ts               ← getMockColectivos() extraído de API route
│   ├── subtes.ts                   ← getMockForecast() extraído de API route
│   └── paradas.ts                  ← getParadasCercanas() desde lib/paradas-mock.ts
│
├── data/                           ← NUEVO: archivos GTFS estáticos descargados
│   ├── gtfs/
│   │   ├── subtes/                 ← ZIP extraído de /subtes/feed-gtfs
│   │   │   ├── agency.txt
│   │   │   ├── calendar.txt
│   │   │   ├── calendar_dates.txt
│   │   │   ├── fare_attributes.txt
│   │   │   ├── fare_rules.txt
│   │   │   ├── feed_info.txt
│   │   │   ├── frequencies.txt
│   │   │   ├── pathways.txt
│   │   │   ├── routes.txt
│   │   │   ├── shapes.txt
│   │   │   ├── stops.txt
│   │   │   ├── stop_times.txt
│   │   │   ├── transfers.txt
│   │   │   └── trips.txt
│   │   └── colectivos/             ← ZIP extraído de /colectivos/feed-gtfs
│   │       ├── agency.txt
│   │       ├── calendar.txt
│   │       ├── routes.txt
│   │       ├── shapes.txt
│   │       ├── stops.txt
│   │       ├── stop_times.txt
│   │       ├── trips.txt
│   │       └── frequencies.txt     ← alternativo: /colectivos/feed-gtfs-frequency
│   └── .gitignore                  ← excluir shapes.txt y stop_times.txt (muy pesados)
│
└── scripts/                        ← NUEVO: scripts de mantenimiento (no son parte del app)
    └── download-gtfs.ts            ← Descarga y extrae los ZIP de feed-gtfs de GCBA
```

---

## GTFS: Estático vs Tiempo Real

### Dos tipos de datos GTFS completamente distintos

| Tipo | Endpoint | Formato | Frecuencia | Dónde vive |
|---|---|---|---|---|
| **GTFS Estático** | `/feed-gtfs` | ZIP con CSV | Mensual/esporádico | `data/gtfs/` |
| **Forecast RT** | `/forecastGTFS` | Protobuf binario | Cada 15s | `services/` → API route |
| **Vehicle Positions** | `/vehiclePositions` | Protobuf binario | Cada 30s | `services/` → API route |
| **Service Alerts** | `/serviceAlerts` | Protobuf binario | Cada 30-60s | `services/` → API route |

### GTFS Estático — `data/gtfs/`

Los archivos CSV se descargan **una vez** (o cuando cambian las rutas/paradas) y se guardan en `data/gtfs/`. No van en `public/` porque son datos internos del servidor, no assets del navegador.

**Contenido de `data/gtfs/subtes/`:**
- `stops.txt` → todas las estaciones con lat/lng (el más usado: búsqueda de paradas cercanas)
- `routes.txt` → líneas A, B, C, D, E, H con colores y nombres
- `trips.txt` → viajes y sentidos (dirección 0/1)
- `stop_times.txt` → horarios estáticos por parada (complementa `forecastGTFS`)
- `transfers.txt` → tiempos de trasbordo entre paradas
- `transfers.txt` → caminos/accesos en estaciones (escaleras, ascensores)
- `shapes.txt` → trazado geográfico para dibujar líneas en el mapa

**Contenido de `data/gtfs/colectivos/`:**
- `stops.txt` → paradas con lat/lng (para búsqueda de paradas cercanas sin GPS)
- `routes.txt` → líneas de colectivo con nombres
- `trips.txt` → viajes
- `/colectivos/feed-gtfs-frequency` → versión simplificada por frecuencias

### Cómo se consumen los archivos estáticos

Los archivos se parsean **server-side** con PapaParse (ya en el proyecto) desde Route Handlers o servicios:

```
services/gtfs/
├── loader.ts         ← parseCsv<T>(domain, filename) usando PapaParse
├── subtes.ts         ← getStopsSubtes(), getRoutesSubtes(), getStopsByLocation()
└── colectivos.ts     ← getStopsColectivos(), getRoutesByStop()
```

**Flujo para búsqueda de paradas cercanas (reemplaza paradas-mock.ts):**
```
app/page.tsx (coords GPS)
  → useParadasCercanas(lat, lng)          [hooks/useParadasCercanas.ts]
  → GET /api/paradas/cercanas?lat=X&lng=Y  [app/api/paradas/cercanas/route.ts]
  → services/gtfs/subtes.ts + colectivos.ts
  → lee data/gtfs/subtes/stops.txt + data/gtfs/colectivos/stops.txt
  → filtra por distancia haversine (utils/geo.ts)
  → devuelve paradas reales (no mock)
```

### Script de descarga — `scripts/download-gtfs.ts`

```typescript
// Uso: npx ts-node scripts/download-gtfs.ts
// Descarga los feed-gtfs de subtes y colectivos y los extrae en data/gtfs/
```

Se ejecuta manualmente o como paso de build. Agrega a `package.json`:
```json
"scripts": {
  "gtfs:update": "ts-node scripts/download-gtfs.ts"
}
```

### `.gitignore` para `data/gtfs/`

Los archivos pesados no deben ir al repo. Crear `data/.gitignore`:
```
# Archivos grandes — descargar con npm run gtfs:update
gtfs/subtes/shapes.txt
gtfs/subtes/stop_times.txt
gtfs/colectivos/shapes.txt
gtfs/colectivos/stop_times.txt

# Sí deben estar en el repo (pequeños y críticos):
# stops.txt, routes.txt, trips.txt, transfers.txt, frequencies.txt
```

---

## Reglas de Capas (Dependency Rules)

| Capa | Carpeta | Puede importar de | NO puede importar de |
|---|---|---|---|
| Types | `types/` | — (nada) | todo lo demás |
| Constants | `constants/` | `types/` | services, hooks, components |
| Utils | `utils/` | `types/`, `constants/` | services, hooks, components |
| Services | `services/` | `types/`, `constants/`, `data/gtfs/` | hooks, components — **solo server** |
| Mocks | `mocks/` | `types/`, `constants/` | services, hooks, components |
| Hooks | `hooks/` | `types/`, `constants/`, `utils/` | services, components |
| Components | `components/` | `hooks/`, `types/`, `constants/`, `utils/`, otros `components/` | `services/`, `mocks/` |
| Pages | `app/` | todo | — |
| Route Handlers | `app/api/` | `services/`, `mocks/`, `types/`, `constants/` | hooks, components |

**Regla crítica:** Los componentes nunca importan de `services/`. Los Route Handlers son los únicos que llaman a services.

---

## Problemas Actuales Identificados

### 1. Tipos dispersos
| Tipo | Ubicación actual | Ubicación correcta |
|---|---|---|
| `GPSStatus`, `GPSState` | `hooks/useGPS.ts` | `types/geo.ts` |
| `ColectivoInfo` | `hooks/useColectivos.ts` | `types/colectivos.ts` |
| `ForecastSubte`, `AlertaSubte` | `lib/subtes.ts` | `types/subtes.ts` |
| `VehiclePosition`, `TripUpdate` | `lib/gtfs.ts` | `types/gtfs.ts` (o queda en `utils/gtfs.ts`) |
| `ParadaConCoords` | `lib/paradas-mock.ts` | `types/paradas.ts` |
| `Arribo`, `ParadaData` | inline en `ProximosArribos.tsx` | `types/paradas.ts` |
| `Parada` | inline en `ListaParadas.tsx` | `types/paradas.ts` |

### 2. Constantes duplicadas
| Constante | Duplicaciones actuales |
|---|---|
| `GCBA_BASE` | 5 archivos: `lib/gcba.ts`, `lib/subtes.ts`, `app/api/colectivos/route.ts`, `app/api/subtes/forecast/route.ts`, `app/api/subtes/alertas/route.ts` |
| `BA_CENTER` | 3 archivos: `hooks/useGPS.ts`, `app/api/colectivos/route.ts`, `app/parada/[id]/page.tsx` |
| `COLORES_SUBTE` | `lib/subtes.ts` + inline en `globals.css` + inline en `Mapa.tsx` |

### 3. lib/ mezcla concerns
- `lib/gcba.ts` → tiene HTTP calls (service) + URL base (constant)
- `lib/subtes.ts` → tiene HTTP calls (service) + tipos (types) + colores (constants)
- `lib/geo.ts` → pura util (bien, solo cambiar a `utils/`)
- `lib/paradas-mock.ts` → tipo + mock data mezclados

### 4. useQuery inline en componente
- `ProximosArribos.tsx` tiene `useQuery` con fetch inline → extraer a `hooks/useParada.ts`

---

## Fases de Implementación

### Fase 1 — Constants ⚡ (30 min, riesgo mínimo)
1. Crear `constants/gcba.ts` → exportar `GCBA_BASE`, `GCBA_SUBTES_BASE`
2. Crear `constants/geo.ts` → exportar `BA_CENTER`
3. Crear `constants/subtes.ts` → exportar `COLORES_SUBTE`, `getColorSubte()`, `ESTACIONES`
4. Actualizar 5 API routes para importar `GCBA_BASE` desde `@/constants/gcba`
5. Actualizar `hooks/useGPS.ts` → importar `BA_CENTER` desde `@/constants/geo`
6. Actualizar `app/parada/[id]/page.tsx` → importar `BA_CENTER`
7. Actualizar `ListaSubtes.tsx` → importar `ESTACIONES`
8. Actualizar `TarjetaSubte.tsx` → importar `getColorSubte` desde `@/constants/subtes`
9. ✅ Verificar: `npx tsc --noEmit`

### Fase 2 — Types 🏷️ (45 min, riesgo muy bajo)
1. Crear `types/colectivos.ts` → mover `ColectivoInfo` desde `hooks/useColectivos.ts`
2. Crear `types/subtes.ts` → mover `ForecastSubte`, `AlertaSubte` desde `lib/subtes.ts`
3. Crear `types/geo.ts` → mover `Coords` desde `lib/geo.ts`; mover `GPSStatus`, `GPSState` desde `hooks/useGPS.ts`
4. Crear `types/paradas.ts` → mover `ParadaConCoords` desde `lib/paradas-mock.ts`; extraer `Arribo`, `ParadaData` desde `ProximosArribos.tsx`; extraer `Parada` desde `ListaParadas.tsx`
5. Crear `types/index.ts` → re-exportar todo
6. Actualizar todos los importadores a `import type { X } from "@/types"`
7. ✅ Verificar: `npx tsc --noEmit`

### Fase 3 — Mock Data 🎭 (20 min, riesgo bajo)
1. Crear `mocks/colectivos.ts` → extraer `getMockColectivos()` del Route Handler
2. Crear `mocks/subtes.ts` → extraer `getMockForecast()` del Route Handler
3. Crear `mocks/paradas.ts` → mover `getParadasCercanas()` desde `lib/paradas-mock.ts`
4. Actualizar Route Handlers para importar desde `@/mocks/*`
5. Actualizar `app/page.tsx` → importar `getParadasCercanas` desde `@/mocks/paradas`
6. ✅ Verificar: `npx tsc --noEmit`

### Fase 4 — Services 🔌 (30 min, riesgo bajo)
1. Crear `services/gcba.ts` → mover `fetchColectivosCercanos()`, `fetchParada()` desde `lib/gcba.ts`; importar `GCBA_BASE` desde `@/constants/gcba`
2. Crear `services/subtes.ts` → mover `fetchForecastSubtes()`, `fetchAlertasSubtes()` desde `lib/subtes.ts`
3. Actualizar Route Handlers que usen las funciones
4. Eliminar `lib/gcba.ts` y `lib/subtes.ts` (ya descompuestos)
5. ✅ Verificar: `npx tsc --noEmit`

### Fase 5 — Utils 🛠️ (10 min, riesgo muy bajo)
1. Mover `lib/geo.ts` → `utils/geo.ts` (remover `Coords`, ya en `types/geo.ts`)
2. Mover `lib/gtfs.ts` → `utils/gtfs.ts`
3. Actualizar imports en todos los archivos que usaban `@/lib/geo` o `@/lib/gtfs`
4. Eliminar `lib/` si queda vacío
5. ✅ Verificar: `npx tsc --noEmit`

### Fase 6 — Hook `useParada` 🪝 (20 min, riesgo bajo)
1. Crear `hooks/useParada.ts` → extraer el `useQuery` y la función fetch desde `ProximosArribos.tsx`
2. Actualizar `ProximosArribos.tsx` → usar `useParada(paradaId)`
3. ✅ Verificar: `npx tsc --noEmit`

### Fase 7 — Mover Componentes 📦 (45 min, riesgo medio → mitigado con TypeScript)
Orden: menor cantidad de cambios de imports primero.

**Sin cambios de imports internos (pure move):**
- `app/components/Icons.tsx` → `components/ui/Icons.tsx`
- `app/components/TarjetaColectivo.tsx` → `components/colectivos/TarjetaColectivo.tsx`
- `app/components/TarjetaParada.tsx` → `components/paradas/TarjetaParada.tsx`
- `app/components/TarjetaArribo.tsx` → `components/paradas/TarjetaArribo.tsx`
- `app/components/AlertaServicio.tsx` → `components/subtes/AlertaServicio.tsx`
- `app/components/ChipsAccesoRapido.tsx` → `components/buscar/ChipsAccesoRapido.tsx`
- `app/components/Mapa.tsx` → `components/mapa/Mapa.tsx`

**Con 1-3 cambios de import:**
- `app/components/StatusBar.tsx` → `components/shell/StatusBar.tsx`
  - `import type { GPSStatus } from "@/hooks/useGPS"` → `from "@/types"`
- `app/components/PantallaPermisos.tsx` → `components/shell/PantallaPermisos.tsx`
  - `import type { GPSState } from "@/hooks/useGPS"` → `from "@/types"`
- `app/components/BottomNav.tsx` → `components/shell/BottomNav.tsx`
  - `./Icons` → `@/components/ui/Icons`
- `app/components/BottomSheet.tsx` → `components/shell/BottomSheet.tsx`
- `app/components/ListaColectivos.tsx` → `components/colectivos/ListaColectivos.tsx`
  - `./Icons` → `@/components/ui/Icons`
- `app/components/TarjetaSubte.tsx` → `components/subtes/TarjetaSubte.tsx`
- `app/components/ListaSubtes.tsx` → `components/subtes/ListaSubtes.tsx`
- `app/components/ListaParadas.tsx` → `components/paradas/ListaParadas.tsx`
- `app/components/BuscadorFallback.tsx` → `components/buscar/BuscadorFallback.tsx`
  - `./Icons` → `@/components/ui/Icons`
- `app/components/ProximosArribos.tsx` → `components/paradas/ProximosArribos.tsx`

**Actualizar páginas:**
- `app/page.tsx` → actualizar todos los imports de `@/app/components/*` a `@/components/*`
- `app/parada/[id]/page.tsx` → ídem
- Eliminar `app/components/`

5. ✅ Verificar final: `npx tsc --noEmit` + `npm run dev`

---

## Mapa de Migración Resumido

| Archivo actual | Destino |
|---|---|
| `lib/gcba.ts` | `services/gcba.ts` (funciones) — eliminado |
| `lib/subtes.ts` | `services/subtes.ts` (fetch) + `types/subtes.ts` (tipos) + `constants/subtes.ts` (colores) — eliminado |
| `lib/geo.ts` | `utils/geo.ts` (funciones) + `types/geo.ts` (Coords) — eliminado |
| `lib/gtfs.ts` | `utils/gtfs.ts` — movido |
| `lib/paradas-mock.ts` | `mocks/paradas.ts` (función) + `types/paradas.ts` (tipo) — eliminado |
| `app/components/*.tsx` | `components/[dominio]/*.tsx` — movidos |

---

## Extensibilidad Futura

Con esta estructura, agregar **trenes** requiere crear archivos nuevos únicamente:
- `data/gtfs/trenes/` → stops.txt, routes.txt, trips.txt (desde SOFSE/TBA API)
- `types/trenes.ts`, `constants/trenes.ts`
- `services/gtfs/trenes.ts` + `services/trenes.ts` (realtime)
- `hooks/useTrenes.ts`, `mocks/trenes.ts`
- `components/trenes/ListaTrenes.tsx`, `components/trenes/TarjetaTren.tsx`
- `app/api/trenes/forecast/route.ts`
- Agregar tab en `BottomNav` → **un solo archivo existente cambia**

---

## Verificación End-to-End

Al finalizar cada fase:
1. `npx tsc --noEmit` — sin errores de TypeScript
2. Al finalizar Fase 7: `npm run dev` y verificar:
   - Pantalla de permisos GPS aparece en primer acceso
   - Tab Mapa → mapa Leaflet con markers
   - Tab Colectivos → lista con datos mock
   - Tab Subtes → lista con forecast y alertas
   - Tab Buscar → buscador con chips de acceso rápido
   - Navegar a `/parada/[id]` → mini mapa + próximos arribos
