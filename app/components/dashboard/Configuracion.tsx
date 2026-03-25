"use client";

import { LanguageSelector } from "@/shared/components/shell/LanguageSelector";
import { useLocale } from "@/app/context/LocaleContext";

interface ConfiguracionProps {
  /** Panel bajo el mapa (evita doble padding con el contenedor con px-4). */
  embedded?: boolean;
}

export function Configuracion({ embedded }: ConfiguracionProps) {
  const { t } = useLocale();

  return (
    <div
      className={`space-y-8 ${
        embedded
          ? "px-0 pt-1 pb-6 max-w-none"
          : "px-4 pt-4 pb-8 max-w-lg mx-auto"
      }`}
    >
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
