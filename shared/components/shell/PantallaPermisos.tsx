"use client";

import type { GPSState } from "@/shared/types/gps";
import { ThemeToggleButton } from "@/shared/components/ui/ThemeToggleButton";
import { GPSIcon, MapIcon, TrainIcon } from "@/shared/components/ui/Icons";
import { useLocale } from "@/app/context/LocaleContext";
import { LanguageSelector } from "@/shared/components/shell/LanguageSelector";
import type { MessageKey } from "@/lib/i18n/messages";

interface PantallaPermisosProps {
  gps: GPSState;
  onSkip: () => void;
}

const LINEAS = [
  { letra: "A", color: "var(--subte-a)", dark: false },
  { letra: "B", color: "var(--subte-b)", dark: false },
  { letra: "C", color: "var(--subte-c)", dark: false },
  { letra: "D", color: "var(--subte-d)", dark: false },
  { letra: "E", color: "var(--subte-e)", dark: false },
  { letra: "H", color: "var(--subte-h)", dark: true },
] as const;

const FEATURE_KEYS: {
  Icon: typeof GPSIcon;
  titleKey: MessageKey;
  descKey: MessageKey;
}[] = [
  { Icon: GPSIcon, titleKey: "featureNearTitle", descKey: "featureNearDesc" },
  { Icon: MapIcon, titleKey: "featureMapTitle", descKey: "featureMapDesc" },
  { Icon: TrainIcon, titleKey: "featureArrivalsTitle", descKey: "featureArrivalsDesc" },
];

export function PantallaPermisos({ gps, onSkip }: PantallaPermisosProps) {
  const { t } = useLocale();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-app)] overflow-y-auto">
      <div className="flex h-1 w-full shrink-0">
        {LINEAS.map((l) => (
          <div key={l.letra} className="flex-1 min-w-0" style={{ background: l.color }} />
        ))}
      </div>

      <div
        className="flex items-center justify-end shrink-0 px-4 py-3"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "linear-gradient(to bottom, var(--bg-surface) 0%, transparent 100%)",
        }}
      >
        <ThemeToggleButton />
      </div>

      <div className="flex flex-col items-center flex-1 px-6 py-6 sm:py-8 text-center max-w-md mx-auto w-full gap-8">
        <div className="relative">
          <div
            className="w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg"
            style={{
              background: "var(--primary)",
              boxShadow: "0 8px 32px var(--primary-glow)",
            }}
          >
            S
          </div>
          <span
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-[var(--bg-app)]"
            style={{ background: "var(--accent-amber)" }}
            aria-hidden
          />
        </div>

        <h1 className="text-[2rem] sm:text-4xl font-extrabold tracking-tight -mt-2 text-[var(--primary)]">
          Suba
        </h1>
        <p className="text-sm font-medium text-[var(--text-muted)] -mt-4 max-w-[280px] leading-relaxed">
          {t("welcomeTagline")}
        </p>

        <div className="flex flex-wrap justify-center gap-2 -mt-2">
          {LINEAS.map((l) => (
            <span
              key={l.letra}
              className="min-w-[1.75rem] h-7 px-1.5 rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm ring-1 ring-black/10"
              style={{
                background: l.color,
                color: l.dark ? "#0f172a" : "#fff",
              }}
            >
              {l.letra}
            </span>
          ))}
        </div>

        <div className="w-full space-y-3 -mt-2">
          {FEATURE_KEYS.map(({ Icon, titleKey, descKey }) => (
            <div
              key={titleKey}
              className="flex items-start gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors
                border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
            >
              <div
                className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: "var(--primary-muted)",
                  color: "var(--primary)",
                }}
              >
                <Icon size={22} />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                  {t(titleKey)}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">{t(descKey)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full max-w-sm">
          <LanguageSelector
            title={t("languageLabel")}
            hint={t("languageHint")}
            variant="combobox"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            void gps.requestPermission();
            onSkip();
          }}
          disabled={gps.status === "requesting"}
          className="w-full max-w-sm font-semibold py-3.5 px-6 rounded-2xl text-base text-white
            shadow-lg active:scale-[0.98] transition-transform disabled:opacity-60 disabled:pointer-events-none
            hover:brightness-105"
          style={{
            background: "var(--primary)",
            boxShadow: "0 4px 24px var(--primary-glow)",
          }}
        >
          {gps.status === "requesting" ? t("btnAccessLoading") : t("btnAccess")}
        </button>

        <p className="text-[11px] font-medium tracking-wide text-[var(--text-dim)] uppercase -mt-4">
          {t("welcomeFooter")}
        </p>
      </div>
    </div>
  );
}
