# BondiYa — Contexto del proyecto para IA

## ¿Qué es BondiYa?

BondiYa es una PWA (Progressive Web App) de transporte público para el AMBA (Área Metropolitana de Buenos Aires), desarrollada bajo la empresa **Randis**. Permite a los usuarios consultar en tiempo real el estado de colectivos, subtes y trenes usando la API oficial del GCBA (Gobierno de la Ciudad de Buenos Aires).

El nombre "BondiYa" combina el término porteño "bondi" (colectivo) con "ya" (inmediatez). Es un MVP diseñado para validar el mercado antes de publicar en Play Store.

---

## Empresa

**Randis** — estudio de producto que crea MVPs para validar ideas. BondiYa es el primer producto bajo esta marca.

---

## Stack tecnológico

| Capa | Tecnología | Motivo |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR + backend + SEO en un solo proyecto |
| Lenguaje | TypeScript | Type safety en todo el proyecto |
| Estilos | Tailwind CSS | Mobile-first rápido |
| Mapa | Leaflet + react-leaflet | Open source, gratuito |
| Datos tiempo real | TanStack Query | Polling inteligente con refetchInterval |
| Datos GCBA | gtfs-realtime-bindings | Decodifica protobuf de la API oficial |
| GTFS estático | papaparse | Parsea stops.txt y routes.txt |
| Deploy | Vercel | HTTPS gratis — requerido para GPS en mobile |

---

## Fuente de datos

### API del GCBA — Transporte Buenos Aires
- **Base URL**: `https://apitransporte.buenosaires.gob.ar`
- **Auth**: query params `client_id` y `client_secret`
- **Credenciales**: en `.env.local` (nunca en el código)
- **Formato real-time**: Protocol Buffers (protobuf) — decodificar con `gtfs-realtime-bindings`
- **Formato estático**: ZIP con archivos CSV (GTFS estático)

### Endpoints principales (Etapa 1 — MVP)

```
GET /colectivos/vehiclePositionsSimple
    ?client_id=X&client_secret=Y
    → posición GPS de todos los colectivos en tiempo real

GET /colectivos/arrivalAndDeparture
    ?client_id=X&client_secret=Y&stop_id=Z
    → próximos arribos para una parada específica
```

### GTFS Estático
- Descargado desde: `https://data.buenosaires.gob.ar/dataset/colectivos-gtfs`
- Archivos usados: `stops.txt` (paradas con lat/lon) y `routes.txt` (nombre y color de líneas)
- Ubicación en el proyecto: `/public/gtfs/`
- Se carga una vez al iniciar — no cambia en tiempo real

---

## Estructura del proyecto

```
bondiya/
├── app/
│   ├── page.tsx                    ← Home — pantalla principal
│   ├── layout.tsx                  ← Layout global + metadata SEO
│   ├── globals.css
│   ├── api/
│   │   ├── colectivos/
│   │   │   └── route.ts            ← Proxy → API GCBA vehiclePositions
│   │   └── parada/
│   │       └── [id]/
│   │           └── route.ts        ← Proxy → arrivalAndDeparture por stop_id
│   └── parada/
│       └── [id]/
│           └── page.tsx            ← Detalle de parada (SSR para SEO)
├── components/
│   ├── Mapa.tsx                    ← Leaflet map (dynamic import, no SSR)
│   ├── ListaParadas.tsx            ← Paradas cercanas al GPS del usuario
│   ├── ProximosArribos.tsx         ← Cuánto falta cada línea en una parada
│   └── BuscadorFallback.tsx        ← Búsqueda por texto cuando no hay GPS
├── lib/
│   ├── gcba.ts                     ← Funciones para llamar la API del GCBA
│   ├── gtfs.ts                     ← Parsear stops.txt y routes.txt
│   └── geo.ts                      ← Haversine distance, filtrar por radio
├── hooks/
│   ├── useGPS.ts                   ← navigator.geolocation con fallback
│   └── useColectivos.ts            ← TanStack Query polling cada 15 seg
├── public/
│   └── gtfs/
│       ├── stops.txt               ← GTFS estático — paradas
│       └── routes.txt              ← GTFS estático — líneas
├── .env.local                      ← Credenciales GCBA (NO commitear)
├── CLAUDE.md                       ← Este archivo
└── README.md                       ← Documentación del proyecto
```

---

## Variables de entorno

```env
# .env.local — nunca subir a Git
GCBA_CLIENT_ID=tu_client_id
GCBA_CLIENT_SECRET=tu_client_secret
```

Las credenciales SOLO se usan en las API Routes del servidor (`app/api/`).
El frontend nunca accede directamente a la API del GCBA.

---

## Plan de trabajo — Sprints del MVP

### Sprint 0 — Setup (1-2 días) ✅
- Crear proyecto Next.js con TypeScript + Tailwind
- Configurar `.env.local` con credenciales GCBA
- Instalar dependencias
- Crear estructura de carpetas base

### Sprint 1 — GPS + ubicación del usuario (2-3 días)
- Hook `useGPS` con `navigator.geolocation`
- Fallback si el usuario rechaza el permiso → buscador por texto
- Mapa Leaflet centrado en la posición del usuario
- Estados: cargando, sin permiso, con ubicación

### Sprint 2 — Colectivos en tiempo real (3-4 días)
- API Route `/api/colectivos` → consume GCBA, decodifica protobuf, devuelve JSON
- Hook `useColectivos` con TanStack Query — polling cada 15 segundos
- Filtrar colectivos dentro de 500m del usuario (fórmula Haversine)
- Markers en el mapa por línea con refresco automático

### Sprint 3 — Paradas y próximos arribos (3-4 días)
- Cargar `stops.txt` → filtrar paradas cercanas al GPS
- API Route `/api/parada/[id]` → consume `arrivalAndDeparture` del GCBA
- Componente `ProximosArribos` — cuánto falta cada línea
- Vista lista de paradas con nombre + líneas + tiempo estimado

### Sprint 4 — Buscador + fallback sin GPS (2-3 días)
- Buscador por nombre de calle, barrio o número de línea
- Geocodificación con Nominatim (OpenStreetMap) — gratuito
- Búsqueda directa de línea → recorrido y paradas
- Autocompletar con `routes.txt`

### Sprint 5 — PWA + deploy (1-2 días)
- Configurar `manifest.json`
- Deploy en Vercel con variables de entorno
- Test en celular real
- Verificar HTTPS — requerido para GPS en mobile

**Tiempo total**: 2 semanas full-time / 4-5 semanas part-time
**Costo de infraestructura**: $0

---

## Decisiones de arquitectura

### API Routes como proxy
Las credenciales del GCBA nunca se exponen al frontend.
El browser llama a `/api/colectivos` y recibe JSON limpio.

### Leaflet con dynamic import
```typescript
const Mapa = dynamic(() => import('@/components/Mapa'), { ssr: false })
```
Leaflet necesita `window` — no funciona con SSR directo.

### TanStack Query para polling
```typescript
useQuery({
  queryKey: ['colectivos'],
  queryFn: fetchColectivos,
  refetchInterval: 15000, // cada 15 segundos
  refetchIntervalInBackground: false // pausa si la pestaña está oculta
})
```

### Fallback sin GPS
1. Buscador por texto → calle, barrio o número de línea
2. Nominatim (OpenStreetMap) → convierte texto a coordenadas

---

## Contexto de negocio

### Problema
Los usuarios de AMBA usan múltiples apps con publicidad excesiva y UX desactualizada.
BondiYa unifica colectivo + subte + tren en una sola app liviana.

### Competidores y sus problemas
| App | Problema |
|---|---|
| Moovit | Publicidad excesiva, pesada |
| BA Subte oficial | Sin actualizar hace años |
| Cuando Subo | Solo colectivos, UX vieja |
| Transit | Extranjera, no adaptada a BA |

### Monetización (Etapa 3)
- Google AdSense — banners no intrusivos
- Suscripción premium — sin ads + notificaciones push
- Sponsors locales — comercios cerca de paradas

---

## Reglas para el LLM al escribir código

1. Siempre usar `@/` para imports — nunca rutas relativas
2. Nunca usar credenciales del GCBA en componentes cliente
3. Leaflet siempre con `dynamic(() => import(...), { ssr: false })`
4. TanStack Query para datos que se refrescan — no `useEffect` + `fetch` manual
5. Código, comentarios y UI en **español**
6. Mobile-first — diseñar para 390px primero (iPhone 14 / Android estándar)
7. TypeScript estricto — no usar `any`
8. Los archivos GTFS estáticos van en `/public/gtfs/` y se leen desde el servidor
9. Tailwind para estilos — no CSS modules ni styled-components