"use client";

import { useId } from "react";
import { LOCALE_OPTIONS, isAppLocale } from "@/lib/i18n/locales";
import { useLocale } from "@/app/context/LocaleContext";

interface LanguageSelectorProps {
  /** Etiqueta visible (ej. t("languageLabel")) */
  title?: string;
  /** Texto de ayuda debajo */
  hint?: string;
  /** full = rejilla; compact = scroll horizontal; combobox = &lt;select&gt; nativo estilizado */
  variant?: "compact" | "full" | "combobox";
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function LanguageSelector({
  title,
  hint,
  variant = "full",
}: LanguageSelectorProps) {
  const { locale, setLocale } = useLocale();
  const selectId = useId();

  if (variant === "combobox") {
    return (
      <div className="w-full max-w-md mx-auto">
        {title && (
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold text-[var(--text-primary)] mb-2 text-left"
          >
            {title}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            value={locale}
            onChange={(e) => {
              const v = e.target.value;
              if (isAppLocale(v)) setLocale(v);
            }}
            className="w-full appearance-none cursor-pointer rounded-xl border border-[var(--border)]
              bg-[var(--bg-card)] text-[var(--text-primary)] text-sm font-medium
              py-3.5 pl-4 pr-11 min-h-[52px]
              shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
              transition-[border-color,box-shadow] duration-200
              hover:border-[var(--primary-border)]
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-app)]"
            aria-label={title}
          >
            {LOCALE_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {`${opt.flag} ${opt.native}`}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            aria-hidden
          >
            <ChevronDown />
          </span>
        </div>
        {hint && (
          <p className="text-[11px] text-[var(--text-dim)] mt-2.5 leading-relaxed text-left">
            {hint}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {title && (
        <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wide mb-2 text-left">
          {title}
        </p>
      )}
      <div
        className={
          variant === "full"
            ? "grid grid-cols-2 sm:grid-cols-3 gap-2"
            : "flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
        }
        style={{ scrollbarWidth: "none" }}
      >
        {LOCALE_OPTIONS.map((opt) => {
          const active = locale === opt.code;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLocale(opt.code)}
              className={`
                flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-all
                min-h-[48px] border active:scale-[0.98]
                ${variant === "compact" ? "shrink-0 min-w-[140px]" : ""}
              `}
              style={
                active
                  ? {
                      background: "var(--primary-muted)",
                      borderColor: "var(--primary-border)",
                      borderWidth: "1.5px",
                      boxShadow: "0 0 12px var(--primary-glow)",
                    }
                  : {
                      background: "var(--bg-panel-subtle)",
                      borderColor: "var(--border)",
                      borderWidth: "1.5px",
                    }
              }
              aria-pressed={active}
              aria-label={opt.native}
            >
              <span className="text-2xl leading-none" aria-hidden>
                {opt.flag}
              </span>
              <span
                className="text-xs font-semibold leading-tight min-w-0"
                style={{ color: active ? "var(--primary)" : "var(--text-muted)" }}
              >
                {opt.native}
              </span>
            </button>
          );
        })}
      </div>
      {hint && (
        <p className="text-[11px] text-[var(--text-dim)] mt-2.5 leading-relaxed text-left">
          {hint}
        </p>
      )}
    </div>
  );
}
