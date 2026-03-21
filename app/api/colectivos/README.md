# `/api/colectivos`

Proxy hacia la API pública de transporte de Buenos Aires (GCBA): posiciones de colectivos.

## Métodos HTTP

| Método   | Handler en `route.ts` | Uso |
|----------|------------------------|-----|
| `GET`    | `export async function GET` | Consulta posiciones (único implementado) |
| `POST`   | `export async function POST` | Podés agregarlo en el mismo archivo si más adelante necesitás enviar cuerpo JSON |
| `OPTIONS`| `export async function OPTIONS` | Típico para CORS si consumís la API desde otro origen |

Next.js asocia cada verbo al export con ese nombre en `route.ts`.

## `GET /api/colectivos`

### Importante: `lat` / `lng` **no** son parámetros de la API de Buenos Aires

La API GCBA **`vehiclePositions`** no acepta coordenadas para “buscar cerca”. Devuelve el **monitoreo** de vehículos (posiciones actualizadas ~cada 30 s). Cada vehículo trae su propia lat/lng en el cuerpo de la respuesta (p. ej. `_position._latitude`, `_position._longitude` en el JSON con prefijos `_`).

En **`/api/colectivos`**, `lat` y `lng` son **solo para BondiYa**: punto de referencia (p. ej. GPS del usuario) para calcular **distancia** y **ordenar** los resultados después de parsear el feed. **No se envían** en la query a `apitransporte.buenosaires.gob.ar`.

### Query parameters — BondiYa (app)

| Parámetro | Tipo   | Requerido | Descripción |
|-----------|--------|-----------|-------------|
| `lat`     | number | no        | Referencia para distancias (default: centro CABA). **No va a GCBA.** |
| `lng`     | number | no        | Igual que `lat`. **No va a GCBA.** |
| `agency_id` | string | no      | Se reenvía a GCBA (entero en la doc oficial) |
| `route_id`  | string | no      | Se reenvía a GCBA (entero en la doc oficial) |
| `trip`      | string | no      | Viaje; GCBA usa el query `Trip` |

### Upstream: GCBA `GET .../colectivos/vehiclePositions`

| Parámetro GCBA   | Tipo (doc) | Descripción |
|------------------|------------|-------------|
| `client_id`      | string, requerido | Credencial |
| `client_secret`  | string, requerido | Credencial |
| `json`           | integer `1` | Si es `1`, respuesta **JSON**; si no, suele ser **protobuf** |
| `agency_id`      | integer    | Filtrar por agencia |
| `route_id`       | integer    | Filtrar por ruta |
| `Trip`           | string     | Filtrar por viaje |

Sin filtros, la API devuelve **todos** los vehículos monitoreados (puede ser un JSON muy grande).

### Formato de respuesta (GCBA JSON)

Además del GTFS-Realtime “estándar”, el JSON puede traer campos con prefijo `_` (p. ej. `_vehicle`, `_position`, `_latitude`, `_longitude`, `_vehicle._id`, `_label`). El servidor los **normaliza** a `ColectivoInfo[]` (`id`, `route_id`, `nombre`, `lat`, `lng`, `distancia`, …).

### Notas

- **`vehiclePositions`** actualiza aproximadamente cada **30 s** (según documentación GCBA). Este route usa `cache: 'no-store'` en el `fetch` upstream para no guardar respuestas enormes en la caché de datos de Next (>2 MB).
- **`vehiclePositionsSimple`** dejó de usarse aquí para poder **filtrar** vía `agency_id` / `route_id` y alinear con la API documentada.
