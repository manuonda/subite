"use client";

import { useLocale } from "@/app/context/LocaleContext";

/**
 * Barra lateral desktop (marca Suba). La navegación principal es el mapa + filtros
 * (Subtes / Bus / Paradas / Config) en FiltroMapaBar — sin tabs inferiores en móvil (PWA).
 */
export function BottomNav() {
  const { t } = useLocale();

  return (
    <nav
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[220px] z-50 pt-5"
      style={{
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
      }}
      aria-label="Suba"
    >
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white"
            style={{ background: "var(--primary)", boxShadow: "0 0 16px var(--primary-glow)" }}
          >
            S
          </div>
          <div>
            <p
              className="font-extrabold text-base leading-none tracking-tight"
              style={{ color: "var(--primary)" }}
            >
              Suba
            </p>
            <p className="text-[10px] text-[var(--text-dim)] mt-0.5 leading-snug">{t("brandTagline")}</p>
          </div>
        </div>
      </div>

      <p className="px-5 text-[11px] text-[var(--text-dim)] leading-relaxed">
        {t("sidebarMapHint")}
      </p>
    </nav>
  );
}
