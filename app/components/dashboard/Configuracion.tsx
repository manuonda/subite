"use client";

import { LanguageSelector } from "@/shared/components/shell/LanguageSelector";
import { useLocale } from "@/app/context/LocaleContext";

export function Configuracion() {
  const { t } = useLocale();

  return (
    <div className="px-4 pt-4 pb-8 max-w-lg mx-auto space-y-8">
      <div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">{t("configTitle")}</h2>
        <p className="text-sm text-[var(--text-muted)]">{t("configLanguageHint")}</p>
      </div>

      <section>
        <LanguageSelector
          title={t("configLanguage")}
          hint={t("languageHint")}
          variant="combobox"
        />
      </section>
    </div>
  );
}
