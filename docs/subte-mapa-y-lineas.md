# Subte en el mapa — qué archivo sirve para qué

Objetivo: solo **subte** (sin colectivos). Flujo: **paradas en mapa** → **detalle al tocar** → **elegir línea y ver el trazado**.

---

## 1. Resumen por archivo GTFS

| Archivo | Qué contiene | Uso en la app |
|---------|----------------|---------------|
| **`routes.txt`** | Líneas (A, B, C…), colores, nombres | Selector “¿Qué línea?”; estilos de UI; **no** tiene coordenadas |
| **`stops.txt`** | Paradas/andenes con **lat/lon** | Marcadores en el mapa; ficha al hacer click |
| **`stop_times.txt`** | Por cada **viaje**, orden de paradas y horas | Saber **qué paradas** tiene una línea y en **qué orden** (y horarios estáticos) |
| **`shapes.txt`** | Puntos **lat/lon** en secuencia por `shape_id` | **Dibujar la línea** del subte en el mapa (polilínea) |
| **`trips.txt`** | Une **`route_id`** con **`shape_id`** y sentido | Saber qué `shape_id` usar para la línea A ida/vuelta, etc. |

Relación mínima:

```
routes (línea) ←── trips (viaje) ──→ shape_id ──→ shapes (puntos del dibujo)
                      │
                      └── stop_times ──→ stops (paradas en orden)
```

---

## 2. Fases recomendadas (solo subte)

### Fase A — Ya la tenés en gran parte
- Cargar **`processed/stops.json`** → marcadores violeta/subte en el mapa (`lib/subte-stops.ts`, bundle estático).
- **`processed/shapes.json`** → polilíneas del trazado (`lib/subte-lines.ts`), generado por `npm run gtfs:build` desde `trips.txt` + `shapes.txt` (colores por línea vienen de `routes.txt` en ese mismo script).
- **`processed/routes.json`** → se genera en el build; hoy no se importa en el mapa (los colores ya van en cada tramo de `shapes.json`); servís para chips/lista “Línea A, B…” sin tocar CSV.
- Centro del mapa: GPS o `BA_CENTER`; si el usuario mueve el mapa, no se vuelve a centrar solo (salvo que recargue).

### Fase B — Click en una parada (siguiente paso natural)
- Al hacer **click** en un marcador (o en el punto):
  - Mostrar **panel inferior / modal** con: nombre, `id` de parada, y si querés **agrupar por `parent`**: “Estación X” con los andenes.
  - Datos: **solo `stops.json`** (no hace falta `stop_times` todavía).
- Opcional: enlace “ver líneas que pasan” cuando tengamos Fase D.

### Fase C — Selector de línea en el mapa (solo visual)
- UI: chips o lista “Línea A, B, C…” (datos de **`processed/routes.json`** o `routes.txt`).
- Al elegir una línea:
  - **Opción 1 (rápida):** resaltar solo los **marcadores** que pertenecen a esa línea (necesitás mapeo `stop_id → route_id` vía `trips` + `stop_times`).
  - **Opción 2 (trazado):** dibujar **polilínea** del recorrido → necesitás **`shapes.txt`** + saber el **`shape_id`** de esa línea (**`trips.txt`**).

### Fase D — Datos para “línea → paradas” y “línea → dibujo”
- En el **build** (`gtfs:build`), además de `stops.json` / `routes.json`, generar por ejemplo:
  - `shapesByRoute.json`: para cada `route_id`, los puntos `[lat, lng][]` (leyendo `trips` + `shapes`), o
  - `routeStopIds.json`: lista de `stop_id` por línea (desde un `trip` representativo + `stop_times`).
- Así el cliente solo importa JSON liviano y no parsea CSV en runtime.

---

## 3. Cómo se “dibuja el subte por donde pasa”

1. Elegís una **`route_id`** (ej. `LineaA`).
2. En **`trips.txt`** tomás un viaje típico de esa ruta (ej. un `trip_id` con `direction_id` fijo) y leés **`shape_id`** (ej. `A0`).
3. En **`shapes.txt`** filtrás todas las filas con ese **`shape_id`**, ordenás por **`shape_pt_sequence`**.
4. Unís los puntos `(shape_pt_lat, shape_pt_lon)` → **polilínea** en Leaflet (`L.polyline`).

Sin **`trips` + `shapes`** no podés dibujar el trazado real; con solo **`stops`** podés poner puntos pero no la curva entre estaciones.

---

## 4. `stop_times.txt` — ¿cuándo?

- **Para dibujar la línea:** no es obligatorio; alcanza `trips` + `shapes`.
- **Para “paradas de la línea A en orden”** o próximos trenes **estáticos:** sí, junto con `trips`.

---

## 5. Checklist rápido

| Querés… | Archivos / artefacto |
|--------|------------------------|
| Marcadores en el mapa | `processed/stops.json` |
| Colores y nombre de línea | `processed/routes.json` |
| Click → info de parada | `stops.json` (+ UI) |
| Resaltar paradas de una línea | `trips` + `stop_times` → JSON derivado |
| Línea dibujada en el mapa | `trips` + `shapes` → JSON derivado o build |

---

*Última actualización: alineado con `data/subtes/ReadmeSubte.md` y `scripts/build-gtfs.ts`.*
