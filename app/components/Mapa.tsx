"use client";
import { useEffect, useRef } from "react";

interface MarkerData {
  lat: number;
  lng: number;
  label?: string;
  type?: "colectivo" | "subte" | "parada" | "user";
}

interface MapaProps {
  lat: number;
  lng: number;
  markers?: MarkerData[];
  zoom?: number;
  height?: string;
}

export function Mapa({ lat, lng, markers = [], zoom = 15, height = "100%" }: MapaProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || mapInstanceRef.current) return;

    const container = mapRef.current;

    import("leaflet").then((L) => {
      if (!container) return;
      // Clean up any existing Leaflet instance on this container (React Strict Mode)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((container as any)._leaflet_id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (L as any).map(container).remove();
      }
      // Fix leaflet default icons
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

      // User location marker
      const userIcon = L.divIcon({
        html: '<div style="width:14px;height:14px;background:#1a56db;border:3px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>',
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      L.marker([lat, lng], { icon: userIcon }).addTo(map);

      // Other markers
      markers.forEach((m) => {
        const color = m.type === "subte" ? "#a78bfa" : m.type === "colectivo" ? "#f59e0b" : "#22c55e";
        const icon = L.divIcon({
          html: `<div style="width:10px;height:10px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
          className: "",
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });
        L.marker([m.lat, m.lng], { icon }).addTo(map);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center when coords change
  useEffect(() => {
    if (mapInstanceRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mapInstanceRef.current as any).setView([lat, lng]);
    }
  }, [lat, lng]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: "100%" }}
      className="bg-gray-200"
    />
  );
}
