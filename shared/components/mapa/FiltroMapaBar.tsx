"use client";

import type { ComponentType } from "react";
import { TrainIcon, BusIcon, MapIcon, AlertIcon, SettingsConfigIcon } from "@/shared/components/ui/Icons";
import { useLocale } from "@/app/context/LocaleContext";
import type { MessageKey } from "@/lib/i18n/messages";

export type MapFilter = "subtes" | "bus" | "paradas" | "alertas" | "config";

type IconComp = ComponentType<{ size?: number; className?: string }>;

const FILTERS: {
  id: MapFilter;
  labelKey: MessageKey;
  Icon: IconComp;
  colorVar: string;
}[] = [
  { id: "subtes", labelKey: "filterSubtes", Icon: TrainIcon, colorVar: "var(--filter-icon-subte)" },
  { id: "bus", labelKey: "filterBus", Icon: BusIcon, colorVar: "var(--filter-icon-bus)" },
  { id: "paradas", labelKey: "filterStops", Icon: MapIcon, colorVar: "var(--filter-icon-paradas)" },
  { id: "alertas", labelKey: "filterAlerts", Icon: AlertIcon, colorVar: "var(--filter-icon-alert)" },
  { id: "config", labelKey: "tabConfig", Icon: SettingsConfigIcon, colorVar: "var(--filter-icon-config)" },
];

interface FiltroMapaBarProps {
  activeFilter: MapFilter;
  onFilterChange: (f: MapFilter) => void;
}

export function FiltroMapaBar({ activeFilter, onFilterChange }: FiltroMapaBarProps) {
  const { t } = useLocale();

  return (
    <div
      className="flex gap-2.5 overflow-x-auto lg:overflow-x-visible px-3 py-3 shrink-0 justify-start touch-pan-x overscroll-x-contain lg:gap-2 lg:px-2"
      style={{
        scrollbarWidth: "none",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-surface)",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {FILTERS.map(({ id, labelKey, Icon, colorVar }) => {
        const isActive = activeFilter === id;
        const label = t(labelKey);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onFilterChange(id)}
            className="flex flex-col items-center justify-center gap-1.5
              min-h-[52px] min-w-[76px] sm:min-w-[88px] lg:min-w-0 lg:flex-1 lg:max-w-none lg:px-1.5
              px-2.5 py-2.5 rounded-2xl
              text-[11px] sm:text-xs font-bold tracking-tight
              transition-all duration-200 shrink-0
              touch-manipulation select-none
              active:scale-[0.97]"
            style={
              isActive
                ? {
                    WebkitTapHighlightColor: "transparent",
                    background: "var(--primary-muted)",
                    color: "var(--primary)",
                    border: "1.5px solid var(--primary-border)",
                    boxShadow: "0 0 16px var(--primary-glow), inset 0 1px 0 rgba(255,255,255,0.06)",
                  }
                : {
                    WebkitTapHighlightColor: "transparent",
                    background: "var(--bg-panel-subtle)",
                    color: "var(--text-muted)",
                    border: "1.5px solid var(--border)",
                    boxShadow: "none",
                  }
            }
          >
            <span
              className="flex items-center justify-center rounded-xl p-1 transition-opacity"
              style={{
                color: colorVar,
                opacity: isActive ? 1 : 0.88,
              }}
              aria-hidden
            >
              <Icon size={22} className="block" />
            </span>
            <span className="leading-none max-w-[5.5rem] lg:max-w-none text-center line-clamp-2">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
