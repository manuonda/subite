"use client";

import { useLocale } from "@/app/context/LocaleContext";

/**
 * Cafecito u otro enlace de donación:
 * - `NEXT_PUBLIC_DONATE_CAFECITO_URL` (recomendado si es Cafecito)
 * - o `NEXT_PUBLIC_DONATE_URL` (un solo enlace; suele ser https://cafecito.app/tuusuario)
 * Opcional: `NEXT_PUBLIC_DONATE_OTHER_URL` (ej. Mercado Pago) para un segundo botón.
 */
function donateUrls() {
  const explicit =
    typeof process.env.NEXT_PUBLIC_DONATE_CAFECITO_URL === "string"
      ? process.env.NEXT_PUBLIC_DONATE_CAFECITO_URL.trim()
      : "";
  const generic =
    typeof process.env.NEXT_PUBLIC_DONATE_URL === "string"
      ? process.env.NEXT_PUBLIC_DONATE_URL.trim()
      : "";
  const cafecito = explicit || generic;
  const otherArg =
    typeof process.env.NEXT_PUBLIC_DONATE_OTHER_URL === "string"
      ? process.env.NEXT_PUBLIC_DONATE_OTHER_URL.trim()
      : "";
  return { cafecito, otherArg };
}

export function donateSectionVisible(): boolean {
  const { cafecito, otherArg } = donateUrls();
  return Boolean(cafecito || otherArg);
}

export function ConfigDonatePanel() {
  const { t } = useLocale();
  const { cafecito, otherArg } = donateUrls();

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t("configDonateIntro")}</p>

      <div className="flex flex-col gap-3">
        {cafecito ? (
          <a
            href={cafecito}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full rounded-xl py-3.5 px-4 text-sm font-semibold text-white transition-opacity active:opacity-90"
            style={{ background: "var(--primary)", boxShadow: "0 0 16px var(--primary-glow)" }}
          >
            {t("configDonateCafecito")}
          </a>
        ) : null}
        {otherArg ? (
          <a
            href={otherArg}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] py-3.5 px-4 text-sm font-semibold text-[var(--text-primary)] transition-opacity active:opacity-90"
          >
            {t("configDonateOtherArgentina")}
          </a>
        ) : null}
      </div>
    </div>
  );
}
