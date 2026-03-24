"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { MapFilter } from "@/shared/components/mapa/FiltroMapaBar";

const STORAGE_KEY = "bondiya-map-filter";

function getStoredFilter(): MapFilter {
  if (typeof window === "undefined") return "subtes";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "subtes" || stored === "bus" || stored === "paradas") return stored;
  return "subtes";
}

type MapViewContextType = {
  activeMapFilter: MapFilter;
  setActiveMapFilter: (f: MapFilter) => void;
};

const MapViewContext = createContext<MapViewContextType | null>(null);

export function MapViewProvider({ children }: { children: ReactNode }) {
  const [activeMapFilter, setState] = useState<MapFilter>("subtes");

  useEffect(() => {
    setState(getStoredFilter());
  }, []);

  const setActiveMapFilter = useCallback((f: MapFilter) => {
    setState(f);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, f);
    }
  }, []);

  return (
    <MapViewContext.Provider value={{ activeMapFilter, setActiveMapFilter }}>
      {children}
    </MapViewContext.Provider>
  );
}

export function useMapView() {
  const ctx = useContext(MapViewContext);
  if (!ctx) throw new Error("useMapView must be used within MapViewProvider");
  return ctx;
}
