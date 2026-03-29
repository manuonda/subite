"use client";

import { AlertaServicio } from "./AlertaServicio";
import { useAlertasSubtes } from "@/features/subtes/hooks/useSubtes";
import { useLocale } from "@/app/context/LocaleContext";
import { RefreshIcon } from "@/shared/components/ui/Icons";

export function ListaAlertas() {
  const { t, locale } = useLocale();
  const { data: alertas, isLoading, isFetching, refetch } = useAlertasSubtes();
  const entityRaw = alertas && !Array.isArray(alertas) ? alertas.entity : undefined;
  const items = (Array.isArray(entityRaw) ? entityRaw : []).filter(
    (e) => !e.is_deleted && e.alert
  );

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
        {isFetching ? (
          <div
            className="mt-6 flex flex-col items-center justify-center gap-3 py-2 px-4"
            aria-live="polite"
            aria-busy="true"
          >
            <RefreshIcon
              size={22}
              className="shrink-0 animate-spin text-[var(--primary)]"
              aria-hidden
            />
            <p className="text-sm font-medium text-center text-[var(--primary)]">
              {t("alertsRefreshing")}
            </p>
          </div>
        ) : (
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity touch-manipulation select-none active:scale-[0.98]"
            style={{
              WebkitTapHighlightColor: "transparent",
              background: "var(--primary-muted)",
              color: "var(--primary)",
              border: "1.5px solid var(--primary-border)",
            }}
            onClick={() => {
              void refetch();
            }}
          >
            <RefreshIcon size={18} className="shrink-0" aria-hidden />
            {t("alertsRefresh")}
          </button>
        )}
      </div>
    );
  }

  const header = alertas && !Array.isArray(alertas) ? alertas.header : undefined;
  const updatedLabel =
    header?.timestamp != null
      ? new Date(header.timestamp * 1000).toLocaleString(
          locale === "en" || locale === "en-US" ? "en-GB" : "es-AR",
          { dateStyle: "short", timeStyle: "short" }
        )
      : null;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <h3 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wide">
            {t("alertsSectionTitle")}
          </h3>
          {updatedLabel ? (
            <p className="text-[10px] text-[var(--text-dim)]">{updatedLabel}</p>
          ) : null}
        </div>
        <button
          type="button"
          disabled={isFetching}
          onClick={() => {
            void refetch();
          }}
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-opacity touch-manipulation select-none active:scale-[0.97] disabled:opacity-50 border border-[var(--border)] bg-[var(--bg-elevated)]/90"
          style={{
            WebkitTapHighlightColor: "transparent",
            color: "var(--primary)",
          }}
          title={t("alertsRefresh")}
          aria-label={t("alertsRefresh")}
          aria-busy={isFetching}
        >
          <RefreshIcon size={18} className={isFetching ? "animate-spin" : ""} aria-hidden />
        </button>
      </div>
      <div
        className="relative min-h-[120px] rounded-2xl"
        aria-busy={isFetching}
      >
        <div
          className={`space-y-3 transition-opacity duration-150 ${isFetching ? "pointer-events-none select-none opacity-40" : ""}`}
        >
          {items.map((a, i) => (
            <AlertaServicio key={a.id ?? i} alert={a.alert} />
          ))}
        </div>
        {isFetching ? (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl px-4 py-6 bg-[var(--bg-surface)]/88 backdrop-blur-[3px] border border-[var(--border)]"
            aria-live="polite"
          >
            <RefreshIcon
              size={24}
              className="shrink-0 animate-spin text-[var(--primary)]"
              aria-hidden
            />
            <p className="text-sm font-medium text-center text-[var(--primary)] max-w-[240px]">
              {t("alertsRefreshing")}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
