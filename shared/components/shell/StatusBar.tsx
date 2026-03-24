"use client";

import { GPSIcon } from "@/shared/components/ui/Icons";
import { ThemeToggleButton } from "@/shared/components/ui/ThemeToggleButton";
import { useLocale } from "@/app/context/LocaleContext";
import type { GPSStatus } from "@/shared/types/gps";

interface StatusBarProps {
  barrio?: string;
  gpsStatus: GPSStatus;
}

export function StatusBar({ barrio, gpsStatus }: StatusBarProps) {
  const { t } = useLocale();
  const gpsColor =
    gpsStatus === "granted"
      ? "text-[var(--primary)]"
      : gpsStatus === "denied"
        ? "text-[var(--accent-coral)]"
        : "text-[var(--icon-inactive)]";

  return (
    <header
      className="fixed top-0 left-0 right-0 lg:left-[220px] h-14 z-40
        flex items-center justify-between gap-3 px-4 min-w-0"
      style={{
        background: "var(--header-gradient)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Marca */}
      <div className="flex items-center gap-2.5 min-w-0 shrink-0">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center text-sm font-black text-white shadow-sm"
          style={{
            background: "var(--primary)",
            boxShadow: "0 2px 12px var(--primary-glow)",
          }}
        >
          S
        </div>
        <span
          className="font-extrabold text-[15px] tracking-tight truncate"
          style={{ color: "var(--primary)" }}
        >
          Suba
        </span>
      </div>

      {/* Ubicación contextual */}
      <span className="text-xs font-medium text-[var(--text-muted)] truncate text-center flex-1 max-w-[min(200px,40vw)]">
        {barrio || t("statusDefaultCity")}
      </span>

      {/* Acciones: tema + GPS */}
      <div className="flex items-center gap-1 shrink-0">
        <ThemeToggleButton />

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border border-transparent ${gpsColor} transition-colors`}
          title={`GPS: ${gpsStatus}`}
          aria-hidden
        >
          <GPSIcon size={18} />
        </div>
      </div>
    </header>
  );
}
