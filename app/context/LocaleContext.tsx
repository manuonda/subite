"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MESSAGES, type AppLocale, type MessageKey } from "@/lib/i18n/messages";
import { isAppLocale } from "@/lib/i18n/locales";

const STORAGE_KEY = "suba-locale";

const DEFAULT_LOCALE: AppLocale = "es";

function readStoredLocale(): AppLocale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && isAppLocale(v)) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}

function applyHtmlLang(locale: AppLocale) {
  if (typeof document === "undefined") return;
  const map: Record<AppLocale, string> = {
    es: "es-AR",
    en: "en-GB",
    "pt-BR": "pt-BR",
    pl: "pl",
    "en-US": "en-US",
    ja: "ja",
    zh: "zh-Hans",
  };
  document.documentElement.lang = map[locale] ?? "es";
}

interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (l: AppLocale) => void;
  t: (key: MessageKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    const next = readStoredLocale();
    setLocaleState(next);
    applyHtmlLang(next);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    applyHtmlLang(locale);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale, hydrated]);

  const setLocale = useCallback((l: AppLocale) => {
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: MessageKey) => MESSAGES[locale][key] ?? String(key),
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
