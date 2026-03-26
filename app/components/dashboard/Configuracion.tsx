"use client";

import { useState, type ReactNode } from "react";
import { LanguageSelector } from "@/shared/components/shell/LanguageSelector";
import { useLocale } from "@/app/context/LocaleContext";
import { LOCALE_OPTIONS } from "@/lib/i18n/locales";
import { APP_VERSION } from "@/shared/constants/version";
import { ConfigTarifasSubte } from "./ConfigTarifasSubte";
import { ConfigFeedbackForm } from "./ConfigFeedbackForm";
import { ConfigDonatePanel, donateSectionVisible } from "./ConfigDonatePanel";
import {
  ChevronRightIcon,
  GlobeIcon,
  HeartIcon,
  InfoCircleIcon,
  MessageSquareIcon,
} from "@/shared/components/ui/Icons";

interface ConfiguracionProps {
  /** Panel bajo el mapa (evita doble padding con el contenedor con px-4). */
  embedded?: boolean;
}

type ConfigView = "menu" | "idioma" | "tarifas" | "acerca" | "feedback" | "donate";

export function Configuracion({ embedded }: ConfiguracionProps) {
  const { t, locale } = useLocale();
  const [view, setView] = useState<ConfigView>("menu");

  const shellClass = embedded
    ? "px-0 pt-1 pb-6 max-w-none"
    : "px-4 pt-4 pb-8 max-w-lg mx-auto";

  const version =
    typeof process.env.NEXT_PUBLIC_APP_VERSION === "string" &&
    process.env.NEXT_PUBLIC_APP_VERSION.length > 0
      ? process.env.NEXT_PUBLIC_APP_VERSION
      : APP_VERSION;

  const localeFlag = LOCALE_OPTIONS.find((o) => o.code === locale)?.flag ?? "🌐";

  function SubHeader({ title }: { title: string }) {
    return (
      <div className="flex items-center gap-3 mb-1 shrink-0">
        <button
          type="button"
          onClick={() => setView("menu")}
          className="text-sm font-semibold text-[var(--primary)] active:opacity-75 shrink-0 py-1 -my-1"
        >
          {t("configBack")}
        </button>
        <h2 className="text-lg font-bold text-[var(--text-primary)] truncate min-w-0">{title}</h2>
      </div>
    );
  }

  function MenuRow({ label, icon, onClick }: { label: string; icon: ReactNode; onClick: () => void }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2.5 sm:px-4 sm:py-3.5 text-left text-[var(--text-primary)] active:opacity-85 transition-opacity"
      >
        <span className="flex items-center gap-3 min-w-0 flex-1">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-muted)] text-[var(--primary)]"
            aria-hidden
          >
            {icon}
          </span>
          <span className="font-medium truncate">{label}</span>
        </span>
        <ChevronRightIcon size={20} className="text-[var(--text-dim)] shrink-0" aria-hidden />
      </button>
    );
  }

  const languageIcon = (
    <span className="flex items-center justify-center gap-0.5">
      <span className="text-[20px] leading-none">{localeFlag}</span>
      <GlobeIcon size={17} className="opacity-90" />
    </span>
  );

  const tarifasIcon = (
    <span className="text-xl font-bold leading-none font-sans" aria-hidden>
      $
    </span>
  );

  if (view === "idioma") {
    return (
      <div className={`space-y-5 ${shellClass}`}>
        <SubHeader title={t("configRowLanguage")} />
        <LanguageSelector
          title={t("configLanguage")}
          hint={t("languageHint")}
          variant="combobox"
        />
      </div>
    );
  }

  if (view === "tarifas") {
    return (
      <div className={`space-y-4 ${shellClass}`}>
        <SubHeader title={t("configTarifasSectionTitle")} />
        <div className="overflow-y-auto min-h-0">
          <ConfigTarifasSubte />
        </div>
      </div>
    );
  }

  if (view === "feedback") {
    return (
      <div className={`space-y-5 ${shellClass}`}>
        <SubHeader title={t("configFeedbackTitle")} />
        <ConfigFeedbackForm />
      </div>
    );
  }

  if (view === "donate") {
    return (
      <div className={`space-y-5 ${shellClass}`}>
        <SubHeader title={t("configDonateTitle")} />
        <ConfigDonatePanel />
      </div>
    );
  }

  if (view === "acerca") {
    return (
      <div className={`space-y-5 ${shellClass}`}>
        <SubHeader title={t("configRowAbout")} />
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">{t("configAboutTitle")}</h3>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t("configAboutTagline")}</p>
          <p className="text-sm text-[var(--text-dim)]">
            {t("configAboutVersionLabel")} {version}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${shellClass}`}>
      <div>
        <h2 className="text-lg font-bold text-[var(--text-primary)]">{t("configTitle")}</h2>
      </div>

      <nav className="space-y-2" aria-label={t("configTitle")}>
        <MenuRow label={t("configRowLanguage")} icon={languageIcon} onClick={() => setView("idioma")} />
        <MenuRow label={t("configRowTarifas")} icon={tarifasIcon} onClick={() => setView("tarifas")} />
        <MenuRow
          label={t("configRowFeedback")}
          icon={<MessageSquareIcon size={22} />}
          onClick={() => setView("feedback")}
        />
        {donateSectionVisible() ? (
          <MenuRow
            label={t("configRowDonate")}
            icon={<HeartIcon size={22} />}
            onClick={() => setView("donate")}
          />
        ) : null}
        <MenuRow
          label={t("configRowAbout")}
          icon={<InfoCircleIcon size={22} />}
          onClick={() => setView("acerca")}
        />
      </nav>
    </div>
  );
}
