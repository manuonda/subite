"use client";
import { GPSIcon } from "@/shared/components/ui/Icons";
import type { GPSStatus } from "@/shared/types/gps";

interface StatusBarProps {
  barrio?: string;
  gpsStatus: GPSStatus;
}

export function StatusBar({ barrio, gpsStatus }: StatusBarProps) {
  const gpsColor =
    gpsStatus === "granted"  ? "text-[var(--primary)]" :
    gpsStatus === "denied"   ? "text-[var(--accent-coral)]" :
    "text-white/25";

  return (
    <header
      className="fixed top-0 left-0 right-0 lg:left-[220px] h-14 z-40
        flex items-center justify-between px-4"
      style={{
        background: "linear-gradient(to bottom, var(--bg-app) 60%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black text-white"
          style={{ background: "var(--primary)", boxShadow: "0 0 14px var(--primary-glow)" }}
        >
          S
        </div>
        <span
          className="font-extrabold text-base tracking-tight"
          style={{ color: "var(--primary)" }}
        >
          Suba
        </span>
      </div>

      {/* Ubicación */}
      <span className="text-xs text-[var(--text-muted)] font-medium truncate max-w-[150px]">
        {barrio || "Buenos Aires"}
      </span>

      {/* GPS status */}
      <div className={`${gpsColor} transition-colors`} title={`GPS: ${gpsStatus}`}>
        <GPSIcon size={17} />
      </div>
    </header>
  );
}
