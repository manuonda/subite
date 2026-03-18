"use client";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

export interface MarkerData {
  lat: number;
  lng: number;
  label?: string;
  id?: string;
  type?: "colectivo" | "subte" | "parada" | "user";
}

export interface MapLayers {
  paradasColectivo: boolean;
  paradasSubte: boolean;
  colectivos: boolean;
}

interface MapaProps {
  lat: number;
  lng: number;
  markers?: MarkerData[];
  layers?: MapLayers;
  onLayersChange?: (layers: MapLayers) => void;
  zoom?: number;
  height?: string;
}

const DEFAULT_LAYERS: MapLayers = {
  paradasColectivo: true,
  paradasSubte: true,
  colectivos: true,
};

export function Mapa({
  lat,
  lng,
  markers = [],
  layers = DEFAULT_LAYERS,
  onLayersChange,
  zoom = 15,
  height = "100%",
}: MapaProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markersLayerRef = useRef<unknown>(null);
  const [localLayers, setLocalLayers] = useState(layers);

  const activeLayers = onLayersChange ? layers : localLayers;

  function toggleLayer(key: keyof MapLayers) {
    const next = { ...activeLayers, [key]: !activeLayers[key] };
    if (onLayersChange) onLayersChange(next);
    else setLocalLayers(next);
  }

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || mapInstanceRef.current) return;

    const container = mapRef.current;

    import("leaflet").then((L) => {
      if (!container) return;
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

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      const userIcon = L.divIcon({
        html: '<div style="width:14px;height:14px;background:#1D9E75;border:3px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>',
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      L.marker([lat, lng], { icon: userIcon }).addTo(map);

      return () => {
        if (mapInstanceRef.current) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (mapInstanceRef.current as any).remove();
          mapInstanceRef.current = null;
          markersLayerRef.current = null;
        }
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mapInstanceRef.current as any).setView([lat, lng]);
    }
  }, [lat, lng]);

  // Actualizar markers cuando cambian markers o layers
  useEffect(() => {
    const layer = markersLayerRef.current;
    if (!layer) return;

    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (layer as any).clearLayers();

      const filtered = markers.filter((m) => {
        if (m.type === "user") return false;
        if (m.type === "colectivo") return activeLayers.colectivos; // vehículos
        if (m.type === "subte") return activeLayers.paradasSubte; // estaciones subte
        if (m.type === "parada") return activeLayers.paradasColectivo; // paradas colectivo
        return activeLayers.paradasColectivo || activeLayers.paradasSubte;
      });

      filtered.forEach((m) => {
        const color = m.type === "subte" ? "#a78bfa" : m.type === "colectivo" ? "#D85A30" : "#1D9E75";
        const icon = L.divIcon({
          html: `<div style="width:10px;height:10px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
          className: "",
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });
        L.marker([m.lat, m.lng], { icon }).addTo(layer as L.LayerGroup);
      });
    });
  }, [markers, activeLayers]);

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
          onClick={() => toggleLayer("colectivos")}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeLayers.colectivos
              ? "bg-[var(--accent-orange)] text-white"
              : "bg-black/50 text-white/70"
          }`}
        >
          🚌 Colectivos
        </button>
      </div>
    </div>
  );
}
