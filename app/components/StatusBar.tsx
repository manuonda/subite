"use client";
import { GPSIcon } from "./Icons";
import type { GPSStatus } from "@/hooks/useGPS";

interface StatusBarProps {
  barrio?: string;
  gpsStatus: GPSStatus;
}

export function StatusBar({ barrio, gpsStatus }: StatusBarProps) {
  const gpsColor =
    gpsStatus === "granted" ? "text-green-500" :
    gpsStatus === "denied" ? "text-red-400" :
    "text-gray-400";

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-[220px] h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-40">
      <span className="text-[#1a56db] font-bold text-lg">BondiYa</span>
      <span className="text-sm text-gray-500 truncate max-w-[140px]">
        {barrio || "Buenos Aires"}
      </span>
      <div className={`${gpsColor} transition-colors`}>
        <GPSIcon size={18} />
      </div>
    </header>
  );
}
