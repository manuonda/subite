# BondiYa 🚌

> Transporte público del AMBA en tiempo real — by Randis

PWA mobile-first para consultar colectivos, subtes y trenes en Buenos Aires usando la API oficial del GCBA.

---

## Características del MVP

- **GPS automático** — detecta tu ubicación y muestra colectivos cercanos
- **Tiempo real** — posiciones actualizadas cada 15 segundos
- **Paradas cercanas** — listado con próximos arribos por línea
- **Sin GPS** — buscador por dirección, barrio o número de línea
- **PWA instalable** — funciona como app en el celular sin Play Store

---

## Stack

- **Next.js 15** — App Router + SSR + API Routes
- **TypeScript** — tipado estricto
- **Tailwind CSS** — estilos mobile-first
- **Leaflet** — mapas open source
- **TanStack Query** — polling inteligente
- **API GCBA** — datos oficiales de transporte de Buenos Aires

---

## Requisitos

- Node.js 18+
- Credenciales de la API de Transporte GCBA
- GTFS estático descargado desde BA Data

---

## Instalación

```bash
git clone https://github.com/randis/bondiya.git
cd bondiya
npm install
cp .env.example .env.local
# Editar .env.local con tus credenciales
npm run dev
```

Abrir http://localhost:3000

---

## Variables de entorno

```env
GCBA_CLIENT_ID=tu_client_id_aqui
GCBA_CLIENT_SECRET=tu_client_secret_aqui
```

---

## Estructura del proyecto

```
bondiya/
├── app/
│   ├── page.tsx              ← Home
│   ├── layout.tsx            ← Layout global
│   ├── api/
│   │   ├── colectivos/       ← Proxy API GCBA
│   │   └── parada/[id]/      ← Proxy arrivalAndDeparture
│   └── parada/[id]/          ← Detalle parada (SSR + SEO)
├── components/
│   ├── Mapa.tsx
│   ├── ListaParadas.tsx
│   ├── ProximosArribos.tsx
│   └── BuscadorFallback.tsx
├── hooks/
│   ├── useGPS.ts
│   └── useColectivos.ts
├── lib/
│   ├── gcba.ts
│   ├── gtfs.ts
│   └── geo.ts
└── public/
    └── gtfs/
        ├── stops.txt
        └── routes.txt
```

---

## Plan de desarrollo

| Sprint | Descripción | Estado |
|---|---|---|
| Sprint 0 | Setup del proyecto | ✅ Completo |
| Sprint 1 | GPS + ubicación del usuario | 🔄 En progreso |
| Sprint 2 | Colectivos en tiempo real | ⏳ Pendiente |
| Sprint 3 | Paradas y próximos arribos | ⏳ Pendiente |
| Sprint 4 | Buscador + fallback sin GPS | ⏳ Pendiente |
| Sprint 5 | PWA + deploy en Vercel | ⏳ Pendiente |

---

## Licencia

MIT © Randis