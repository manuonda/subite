"use client";
import { MapIcon, TrainIcon, BusIcon, AlertIcon } from "@/app/components/Icons";

export type MapFilter = "todo" | "subtes" | "bus" | "paradas" | "alertas";

const FILTERS: { id: MapFilter; label: string; icon: React.ReactNode }[] = [
  { id: "todo",    label: "Todo",    icon: <MapIcon size={13} /> },
  { id: "subtes",  label: "Subtes",  icon: <TrainIcon size={13} /> },
  { id: "bus",     label: "Bus",     icon: <BusIcon size={13} /> },
  { id: "paradas", label: "Paradas", icon: <span className="text-xs leading-none">🚏</span> },
  { id: "alertas", label: "Alertas", icon: <AlertIcon size={13} /> },
];

interface FiltroMapaBarProps {
  activeFilter: MapFilter;
  onFilterChange: (f: MapFilter) => void;
}

export function FiltroMapaBar({ activeFilter, onFilterChange }: FiltroMapaBarProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto px-3 py-2.5 shrink-0"
      style={{
        scrollbarWidth: "none",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-surface)",
      }}
    >
      {FILTERS.map(({ id, label, icon }) => {
        const isActive = activeFilter === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onFilterChange(id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0"
            style={isActive ? {
              background: "var(--primary-muted)",
              color: "var(--primary)",
              border: "1px solid var(--primary-border)",
              boxShadow: "0 0 10px var(--primary-glow)",
            } : {
              background: "rgba(255,255,255,0.04)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
          >
            {icon}
            {label}
          </button>
        );
      })}
    </div>
  );
}
