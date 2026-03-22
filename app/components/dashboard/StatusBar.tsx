"use client";
import { GPSIcon } from "@/app/components/Icons";
import type { GPSStatus } from "@/hooks/useGPS";

interface StatusBarProps {
  barrio?: string;
  gpsStatus: GPSStatus;
}

export function StatusBar({ barrio, gpsStatus }: StatusBarProps) {
  const gpsColor =
    gpsStatus === "granted" ? "text-[var(--primary)]" :
    gpsStatus === "denied" ? "text-red-400" :
    "text-white/40";

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-[220px] h-14 bg-(--bg-app) border-b border-(--border) flex items-center justify-between px-4 z-40">
      <span className="text-(--primary) font-bold text-lg">Subite</span>
      <span className="text-sm text-(--text-muted) truncate max-w-[140px]">
        {barrio || "Buenos Aires"}
      </span>
      <div className={`${gpsColor} transition-colors`}>
        <GPSIcon size={18} />
      </div>
    </header>
  );
}
