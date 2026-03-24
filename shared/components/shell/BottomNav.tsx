"use client";

import { MapIcon, SettingsConfigIcon } from "@/shared/components/ui/Icons";
import { useLocale } from "@/app/context/LocaleContext";
import type { MessageKey } from "@/lib/i18n/messages";

export type TabId = "mapa" | "configuracion";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; labelKey: MessageKey; Icon: typeof MapIcon }[] = [
  { id: "mapa", labelKey: "tabMap", Icon: MapIcon },
  { id: "configuracion", labelKey: "tabConfig", Icon: SettingsConfigIcon },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useLocale();

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-colors duration-200"
        style={{
          background: "var(--bg-nav)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--border)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex h-16">
          {TABS.map(({ id, labelKey, Icon }) => {
            const isActive = activeTab === id;
            const label = t(labelKey);
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className="flex-1 flex flex-col items-center justify-center gap-1 transition-all"
              >
                <div
                  className="flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: "var(--primary-muted)",
                          boxShadow: "0 0 12px var(--primary-glow)",
                        }
                      : {}
                  }
                >
                  <span style={{ color: isActive ? "var(--primary)" : "var(--icon-inactive)" }}>
                    <Icon size={20} />
                  </span>
                </div>
                <span
                  className="text-[10px] font-semibold transition-colors"
                  style={{ color: isActive ? "var(--primary)" : "var(--icon-inactive)" }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <nav
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[220px] z-50 pt-5"
        style={{
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <div className="px-5 mb-8">
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
              <p className="text-[10px] text-[var(--text-dim)] mt-0.5">{t("brandTagline")}</p>
            </div>
          </div>
        </div>

        <div className="px-3 space-y-1">
          {TABS.map(({ id, labelKey, Icon }) => {
            const isActive = activeTab === id;
            const label = t(labelKey);
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                style={
                  isActive
                    ? {
                        background: "var(--primary-muted)",
                        boxShadow: "inset 0 0 0 1px var(--primary-border)",
                      }
                    : {}
                }
              >
                <span style={{ color: isActive ? "var(--primary)" : "var(--icon-inactive)" }}>
                  <Icon size={19} />
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: isActive ? "var(--primary)" : "var(--text-muted)" }}
                >
                  {label}
                </span>
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--primary)", boxShadow: "0 0 6px var(--primary)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
