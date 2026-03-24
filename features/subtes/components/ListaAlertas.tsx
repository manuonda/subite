"use client";

import { AlertaServicio } from "./AlertaServicio";
import { useAlertasSubtes } from "@/features/subtes/hooks/useSubtes";
import { useLocale } from "@/app/context/LocaleContext";

export function ListaAlertas() {
  const { t } = useLocale();
  const { data: alertas, isLoading } = useAlertasSubtes();
  const items = Array.isArray(alertas) ? alertas : [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-16 rounded-2xl animate-pulse"
            style={{ background: "var(--bg-panel-subtle)" }}
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <span className="text-3xl mb-3 opacity-50">✓</span>
        <p className="text-sm font-medium text-[var(--text-primary)]">{t("alertsEmpty")}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">{t("alertsEmptySub")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wide">
        {t("alertsSectionTitle")}
      </h3>
      <div className="space-y-3">
        {items.map((a, i) => (
          <AlertaServicio key={a.id ?? i} mensaje={a.header_text} lineas={a.route_ids} />
        ))}
      </div>
    </div>
  );
}
