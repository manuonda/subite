"use client";

import { Fragment } from "react";
import { useLocale } from "@/app/context/LocaleContext";
import {
  EMOVA_CUADRO_TARIFARIO_URL,
  FILAS_CUADRO_TARIFAS,
  formatArs,
  TARIFAS_INTRO_ES,
  TRAMOS_VIAJES_ES,
} from "@/lib/subte-tarifas";

export function ConfigTarifasSubte() {
  const { t, locale } = useLocale();

  const showFullEs = locale === "es";

  return (
    <div className="space-y-5 pb-4">
      <p className="text-[11px] leading-relaxed text-[var(--text-dim)] border border-[var(--border)] rounded-xl px-3 py-2.5 bg-[var(--bg-panel-subtle)]">
        {t("configTarifasDisclaimer")}
      </p>

      <a
        href={EMOVA_CUADRO_TARIFARIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full rounded-xl py-3 px-4 text-sm font-semibold text-white transition-opacity active:opacity-90"
        style={{ background: "var(--primary)", boxShadow: "0 0 16px var(--primary-glow)" }}
      >
        {t("configTarifasOfficialLink")}
      </a>

      {showFullEs ? (
        <div className="space-y-3 text-sm text-[var(--text-muted)] leading-relaxed">
          {TARIFAS_INTRO_ES.map((line, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-base font-bold text-[var(--text-primary)]"
                  : undefined
              }
            >
              {line}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {t("configTarifasIntroShort")}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]">
        <table className="w-full min-w-[720px] text-left text-[10px] sm:text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
              <th
                scope="col"
                rowSpan={2}
                className="sticky left-0 z-[1] align-bottom px-2 py-2 font-semibold text-[var(--text-primary)] bg-[var(--bg-elevated)] border-r border-[var(--border)]"
              >
                {t("configTarifasColServicio")}
              </th>
              {TRAMOS_VIAJES_ES.map((tramo) => (
                <th
                  key={tramo}
                  scope="colgroup"
                  colSpan={2}
                  className="px-1 py-2 font-semibold text-[var(--text-primary)] text-center border-l border-[var(--border)]"
                >
                  {t("configTarifasTripsPerMonth")}: {tramo}
                </th>
              ))}
            </tr>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-panel-subtle)]">
              {TRAMOS_VIAJES_ES.map((tramo) => (
                <th
                  key={`h-${tramo}`}
                  colSpan={2}
                  className="p-0 border-l border-[var(--border)]"
                >
                  <div className="grid grid-cols-2 text-[9px] font-medium text-[var(--text-dim)]">
                    <span className="px-1 py-1 text-center border-r border-[var(--border)]">
                      {t("configTarifasColTarifa")}
                    </span>
                    <span className="px-1 py-1 text-center">
                      {t("configTarifasColSubeNoNom")}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FILAS_CUADRO_TARIFAS.map((fila) => (
              <tr key={fila.servicio} className="border-b border-[var(--border)] last:border-0">
                <th
                  scope="row"
                  className="sticky left-0 z-[1] bg-[var(--bg-elevated)] px-2 py-2 font-medium text-[var(--text-primary)] text-left max-w-[120px] border-r border-[var(--border)]"
                >
                  {fila.servicio}
                </th>
                {fila.celdas.map((c, i) => (
                  <Fragment key={`${fila.servicio}-${i}`}>
                    <td className="px-1.5 py-2 font-mono tabular-nums text-[var(--text-primary)] border-l border-[var(--border)] text-right">
                      {formatArs(c.tarifa)}
                    </td>
                    <td className="px-1.5 py-2 font-mono tabular-nums text-[var(--text-muted)] text-right">
                      {formatArs(c.subeNoNominalizada)}
                    </td>
                  </Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-[var(--text-dim)]">{t("configTarifasTableNote")}</p>
    </div>
  );
}
