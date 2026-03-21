# GTFS Subtes — Documentación de archivos

Feed GTFS estático del Subte de Buenos Aires. Descargado desde la API del GCBA (`/subtes/feed-gtfs`).

**Estándar:** [GTFS (General Transit Feed Specification)](https://gtfs.org/)

---

## Resumen de archivos

| Archivo | Filas | Descripción |
|---------|-------|-------------|
| agency.txt | 2 | Operador del servicio |
| feed_info.txt | 2 | Metadata del feed |
| calendar.txt | 4 | Días regulares de servicio |
| calendar_dates.txt | 152 | Excepciones (feriados) |
| routes.txt | 9 | Líneas y colores |
| trips.txt | 50 | Viajes por línea y día |
| stops.txt | ~708 | Paradas y estaciones |
| stop_times.txt | 715 | Horarios por viaje y parada |
| frequencies.txt | 113 | Frecuencia de paso |
| shapes.txt | 1193 | Trazado geográfico de líneas |
| pathways.txt | 947 | Caminos dentro de estaciones |
| transfers.txt | 113 | Tiempos de trasbordo |
| fare_attributes.txt | 3 | Tarifas |
| fare_rules.txt | 5 | Reglas de tarifas |

---

## agency.txt

**Qué hace:** Define el operador del transporte.

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| agency_id | 3 | ID único |
| agency_name | Subte de Buenos Aires | Nombre del operador |
| agency_url | http://www.buenosaires.gob.ar/subte | Web oficial |
| agency_timezone | America/Argentina/Buenos_Aires | Zona horaria |
| agency_lang | es | Idioma |
| agency_phone | 0800-333-6682 | Teléfono de contacto |
| agency_fare_url | .../tarifas-pases-y-abonos | URL de tarifas |

**Uso en app:** Mostrar nombre del operador, enlace a web, teléfono.

---

## feed_info.txt

**Qué hace:** Metadata del feed GTFS (versión, vigencia).

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| feed_publisher_name | GP-SBASE | Publicador |
| feed_publisher_url | http://www.buenosaires.gob.ar/subte | URL |
| feed_lang | es | Idioma |
| feed_start_date | 20140501 | Inicio de vigencia |
| feed_end_date | 20261231 | Fin de vigencia |
| feed_version | 2.0 | Versión del feed |

**Uso en app:** Validar si el feed está actualizado; avisar si está vencido.

---

## calendar.txt

**Qué hace:** Define qué días de la semana opera cada tipo de servicio.

| Campo | Descripción |
|-------|-------------|
| service_id | 5 = lun-vie, 6 = sáb, 7 = dom |
| monday..sunday | 1 = opera, 0 = no opera |
| start_date, end_date | Vigencia (YYYYMMDD) |

**Ejemplo:**
```
service_id 5: Lun-Vie (1,1,1,1,1,0,0)
service_id 6: Sábados (0,0,0,0,0,1,0)
service_id 7: Domingos (0,0,0,0,0,0,1)
```

**Uso en app:** Saber si hay servicio según el día de la semana.

---

## calendar_dates.txt

**Qué hace:** Excepciones al calendario (feriados, días especiales).

| Campo | Descripción |
|-------|-------------|
| service_id | 5, 6 o 7 |
| date | Fecha YYYYMMDD |
| exception_type | 1 = agrega servicio, 2 = quita servicio |

**Ejemplos:**
- `5,20200501,2` → Lun-vie no opera el 1 de mayo (feriado)
- `7,20240525,1` → Domingo sí opera el 25 may 2024 (feriado cae sáb, se usa horario dom)

**Uso en app:** Excluir feriados al calcular si hay servicio hoy.

---

## routes.txt

**Qué hace:** Líneas de subte (y premetro) con nombres y colores.

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| route_id | LineaA | ID interno |
| route_short_name | A | Nombre corto |
| route_long_name | Plaza de Mayo - San Pedrito | Recorrido |
| route_type | 1 = subte, 0 = premetro | Tipo |
| route_color | A5C8FF | Color hex (sin #) |
| route_text_color | 000000 | Color del texto |

**Líneas:** A, B, C, D, E, H (subte) + PM-Civico, PM-Savio (premetro).

**Uso en app:** Listar líneas, colores en mapa, nombres de recorridos.

---

## trips.txt

**Qué hace:** Viajes (trips) por línea, día y sentido.

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| route_id | LineaA | Línea |
| service_id | 5, 6, 7 | Día (lun-vie, sáb, dom) |
| trip_id | A01, A11 | ID del viaje |
| trip_headsign | San Pedrito | Destino mostrado |
| direction_id | 0 o 1 | Sentido (ida/vuelta) |
| shape_id | A0, A1 | Trazado en mapa |

**Ejemplo:** A01 = Línea A, sentido San Pedrito; A11 = sentido Plaza de Mayo.

**Uso en app:** Relacionar forecast (trip_id) con líneas y estaciones.

---

## stops.txt

**Qué hace:** Todas las paradas/estaciones con coordenadas.

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| stop_id | 1073S, 1164N | ID (N/S = sentido) |
| stop_name | Lima, Retiro | Nombre |
| stop_lat, stop_lon | -34.609, -58.382 | Coordenadas |
| location_type | 0 = andén, 2 = acceso | Tipo |
| parent_station | 1073 | Estación padre |
| wheelchair_boarding | 0,1,2 | Accesibilidad |

**Uso en app:** Búsqueda de paradas cercanas (GPS), marcadores en mapa.

---

## stop_times.txt

**Qué hace:** Horarios de llegada y salida por viaje y parada.

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| trip_id | A01 | Viaje |
| arrival_time | 12:00:00 | Hora llegada |
| departure_time | 12:00:24 | Hora salida |
| stop_id | 1076S | Parada |
| stop_sequence | 1, 2, 3... | Orden en el recorrido |
| shape_dist_traveled | 0.06 | Distancia acumulada (km) |

**Ejemplo:** Trip A01 sale de Plaza de Mayo (1076S) a las 12:00 y llega a San Pedrito (1059S) a las 12:26.

**Uso en app:** Horarios estáticos (complementa forecast en tiempo real).

---

## frequencies.txt

**Qué hace:** Frecuencia de paso por franja horaria (cada X segundos).

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| trip_id | A01 | Viaje |
| start_time, end_time | 5:30:00, 06:24:00 | Franja |
| headway_secs | 405 | Segundos entre trenes |
| exact_times | 1 | Horarios exactos |

**Ejemplo:** A01 entre 5:30 y 6:24 pasa cada 405 seg (~7 min).

**Uso en app:** Mostrar "Cada 4 min" o "Cada 7 min" según la hora.

---

## shapes.txt

**Qué hace:** Puntos (lat, lon) que forman el trazado de cada línea en el mapa.

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| shape_id | A0, A1 | Trazado (por sentido) |
| shape_pt_lat, shape_pt_lon | -34.608, -58.370 | Coordenada |
| shape_pt_sequence | 1, 2, 3... | Orden |
| shape_dist_traveled | 0, 0.11... | Distancia (km) |

**Uso en app:** Dibujar polilíneas de las líneas en el mapa.

---

## pathways.txt

**Qué hace:** Caminos dentro de estaciones (escaleras, ascensores, pasillos).

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| pathway_id | A01C01 | ID del camino |
| from_stop_id, to_stop_id | 1073S, 1098E | Origen y destino |
| pathway_mode | 1 = pasillo, 2 = escaleras | Tipo |
| signposted_as | "A Constitucion" | Cartel indicador |
| traversal_time | 168 | Segundos para recorrer |

**Ejemplo:** De Lima (1073S) a Diagonal Norte (1098E): 168 seg caminando.

**Uso en app:** Guía de accesos y combinaciones dentro de estaciones.

---

## transfers.txt

**Qué hace:** Tiempos mínimos de trasbordo entre paradas.

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| from_stop_id, to_stop_id | 1073N, 1098O | Parada origen y destino |
| transfer_type | 2 | Tipo (2 = mínimo recomendado) |
| min_transfer_time | 132 | Segundos para trasbordar |

**Ejemplo:** De Lima Línea A (1073N) a Diagonal Norte Línea C (1098O): 132 seg.

**Uso en app:** Cálculo de rutas con combinaciones.

---

## fare_attributes.txt

**Qué hace:** Tarifas base.

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| fare_id | 4, 5 | ID de tarifa |
| price | 1363.00, 477.05 | Precio en ARS |
| currency_type | ARS | Moneda |
| payment_method | 1, 0 | 1 = abordo, 0 = prepago |
| transfers | 1, 0 | Cantidad de trasbordos incluidos |

**Uso en app:** Mostrar tarifa actual del subte.

---

## fare_rules.txt

**Qué hace:** Reglas que vinculan tarifas con rutas/orígenes/destinos.

| Campo | Descripción |
|-------|-------------|
| fare_id | Tarifa |
| route_id | Ruta (vacío = todas) |
| origin_id, destination_id | Zonas |
| contains_id | Zona intermedia |

**Uso en app:** Determinar qué tarifa aplica a un viaje.

---

## Flujo de datos (relaciones)

```
agency (3) ──┬── routes (LineaA, LineaB...)
             └── fare_attributes

routes ────── trips (A01, A11, B01...)
   │              │
   │              ├── stop_times (horarios por parada)
   │              └── frequencies (frecuencia por franja)
   │
   └── shapes (trazado en mapa)

stops ─────── stop_times
   │
   ├── pathways (caminos entre paradas)
   └── transfers (trasbordos)

calendar ──── trips (service_id)
   │
   └── calendar_dates (excepciones)
```

---

## Actualización del feed

Ejecutar periódicamente (ej. cada 1–3 meses):

```bash
npm run gtfs:update   # Descarga ZIP desde API GCBA
npm run gtfs:build    # Pre-procesa stops y routes a JSON
```

---

## Mapa en la app (fases: click en parada, línea, trazado)

Ver **[`docs/subte-mapa-y-lineas.md`](../../docs/subte-mapa-y-lineas.md)** — resume `routes` / `stops` / `stop_times` / `shapes` y el orden sugerido para implementar solo subte.
