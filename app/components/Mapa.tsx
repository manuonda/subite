"use client";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

export interface MarkerData {
  lat: number;
  lng: number;
  label?: string;
  id?: string;
  type?: "subte" | "parada" | "user";
  /** Nombre para panel / popup (subte GTFS o parada colectivo) */
  nombre?: string;
  /** Estación padre GTFS (solo subte) */
  parent?: string;
}

export interface MapLayers {
  paradasColectivo: boolean;
  paradasSubte: boolean;
  /** Trazado GTFS (shapes) por línea */
  lineasSubte: boolean;
}

/** Polilínea preprocesada (build-gtfs → shapes.json) */
export interface SubteLineOverlay {
  shapeId: string;
  color: string;
  points: [number, number][];
}

interface MapaProps {
  lat: number;
  lng: number;
  markers?: MarkerData[];
  /** Trazados de líneas (subte); vacío si no hay shapes.json */
  subteLines?: SubteLineOverlay[];
  layers?: MapLayers;
  onLayersChange?: (layers: MapLayers) => void;
  /** Click en una parada/subte (no en el mapa vacío) */
  onMarkerSelect?: (marker: MarkerData) => void;
  /** Click en el mapa (fondo) — para cerrar panel */
  onMapBackgroundClick?: () => void;
  zoom?: number;
  height?: string;
}

const DEFAULT_LAYERS: MapLayers = {
  paradasColectivo: true,
  paradasSubte: true,
  lineasSubte: true,
};

function subteStationIconHtml(): string {
  return `<div style="width:30px;height:30px;border-radius:10px;background:linear-gradient(160deg,#c4b5fd 0%,#7c3aed 100%);border:2px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:15px;line-height:1;" aria-hidden="true">🚇</div>`;
}

function paradaColectivoIconHtml(): string {
  return `<div style="width:26px;height:26px;border-radius:50%;background:#1D9E75;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:12px;line-height:1;" aria-hidden="true">🚏</div>`;
}

export function Mapa({
  lat,
  lng,
  markers = [],
  subteLines = [],
  layers = DEFAULT_LAYERS,
  onLayersChange,
  onMarkerSelect,
  onMapBackgroundClick,
  zoom = 15,
  height = "100%",
}: MapaProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markersLayerRef = useRef<unknown>(null);
  const linesLayerRef = useRef<unknown>(null);
  const userMarkerRef = useRef<unknown>(null);
  const userAdjustedMapRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [localLayers, setLocalLayers] = useState(layers);
  const onMarkerSelectRef = useRef(onMarkerSelect);
  const onMapBackgroundClickRef = useRef(onMapBackgroundClick);

  onMarkerSelectRef.current = onMarkerSelect;
  onMapBackgroundClickRef.current = onMapBackgroundClick;

  const activeLayers = onLayersChange ? layers : localLayers;

  function toggleLayer(key: keyof MapLayers) {
    const next = { ...activeLayers, [key]: !activeLayers[key] };
    if (onLayersChange) onLayersChange(next);
    else setLocalLayers(next);
  }

  useEffect(() => {
    const container = mapRef.current;
    if (typeof window === "undefined" || !container) return;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !container) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (container as any)._leaflet_id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(container, { zoomControl: false }).setView([lat, lng], zoom);
      mapInstanceRef.current = map;
      map.dragging.enable();

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      const linesLayer = L.layerGroup().addTo(map);
      linesLayerRef.current = linesLayer;

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      map.on("click", () => {
        onMapBackgroundClickRef.current?.();
      });

      function markUserAdjusted(e: import("leaflet").LeafletEvent) {
        if ("originalEvent" in e && e.originalEvent) userAdjustedMapRef.current = true;
      }
      map.on("moveend", markUserAdjusted);
      map.on("zoomend", markUserAdjusted);

      const userIcon = L.divIcon({
        html: '<div style="width:14px;height:14px;background:#1D9E75;border:3px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>',
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      const userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
      userMarkerRef.current = userMarker;

      setMapReady(true);
    });

    return () => {
      cancelled = true;
      setMapReady(false);
      userMarkerRef.current = null;
      userAdjustedMapRef.current = false;
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        linesLayerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Ubicación del usuario + centrar solo si el usuario aún no movió el mapa */
  useEffect(() => {
    if (!mapReady) return;
    const map = mapInstanceRef.current as { setView: (c: [number, number], z: number) => void } | null;
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (userMarkerRef.current as any)?.setLatLng?.([lat, lng]);
    if (!userAdjustedMapRef.current) {
      map.setView([lat, lng], zoom);
    }
  }, [mapReady, lat, lng, zoom]);

  useEffect(() => {
    const container = mapRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      const map = mapInstanceRef.current as { invalidateSize?: () => void } | null;
      map?.invalidateSize?.();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Actualizar markers cuando cambian markers o layers
  useEffect(() => {
    const layer = markersLayerRef.current;
    if (!layer) return;

    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (layer as any).clearLayers();

      const filtered = markers.filter((m) => {
        if (m.type === "user") return false;
        if (m.type === "subte") return activeLayers.paradasSubte;
        if (m.type === "parada") return activeLayers.paradasColectivo;
        return activeLayers.paradasColectivo || activeLayers.paradasSubte;
      });

      filtered.forEach((m) => {
        const isSubte = m.type === "subte";
        const icon = L.divIcon({
          html: isSubte ? subteStationIconHtml() : paradaColectivoIconHtml(),
          className: "leaflet-subte-marker",
          iconSize: isSubte ? [30, 30] : [26, 26],
          iconAnchor: isSubte ? [15, 30] : [13, 26],
        });
        const marker = L.marker([m.lat, m.lng], { icon });
        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          onMarkerSelectRef.current?.(m);
        });
        marker.addTo(layer as L.LayerGroup);
      });
    });
  }, [mapReady, markers, activeLayers]);

  useEffect(() => {
    const layer = linesLayerRef.current;
    if (!layer) return;

    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (layer as any).clearLayers();
      if (!activeLayers.lineasSubte) return;
      subteLines.forEach((line) => {
        if (line.points.length < 2) return;
        L.polyline(line.points, {
          color: line.color,
          weight: 5,
          opacity: 0.88,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(layer as L.LayerGroup);
      });
    });
  }, [mapReady, subteLines, activeLayers.lineasSubte]);

  return (
    <div className="relative" style={{ height, width: "100%" }}>
      <div
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
        className="bg-[var(--bg-elevated)]"
      />
      {/* Controles de capas */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1">
        <button
          type="button"
          onClick={() => toggleLayer("paradasColectivo")}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeLayers.paradasColectivo
              ? "bg-[var(--primary)] text-white"
              : "bg-black/50 text-white/70"
          }`}
        >
          🚏 Paradas
        </button>
        <button
          type="button"
          onClick={() => toggleLayer("paradasSubte")}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeLayers.paradasSubte
              ? "bg-[#a78bfa] text-white"
              : "bg-black/50 text-white/70"
          }`}
        >
          🚇 Subtes
        </button>
        <button
          type="button"
          onClick={() => toggleLayer("lineasSubte")}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeLayers.lineasSubte
              ? "bg-[#3b82f6] text-white"
              : "bg-black/50 text-white/70"
          }`}
        >
          📐 Líneas
        </button>
      </div>
    </div>
  );
}
