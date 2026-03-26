"use client";

import { useId, useState, type FormEvent } from "react";
import { useLocale } from "@/app/context/LocaleContext";
import { APP_VERSION } from "@/shared/constants/version";

export function ConfigFeedbackForm() {
  const { t, locale } = useLocale();
  const trapId = useId();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const version =
    typeof process.env.NEXT_PUBLIC_APP_VERSION === "string" &&
    process.env.NEXT_PUBLIC_APP_VERSION.length > 0
      ? process.env.NEXT_PUBLIC_APP_VERSION
      : APP_VERSION;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (trap.length > 0) {
      setStatus("ok");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim(),
          locale,
          version,
          _trap: trap,
        }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (res.ok && data.ok) {
        setStatus("ok");
        setMessage("");
        setEmail("");
      } else {
        setStatus("err");
      }
    } catch {
      setStatus("err");
    }
  }

  if (status === "ok") {
    return (
      <div className="space-y-3">
        <p
          className="rounded-xl border border-[var(--primary-border)] bg-[var(--primary-muted)] px-4 py-3 text-sm text-[var(--text-primary)]"
          role="status"
        >
          {t("configFeedbackSuccess")}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-sm font-semibold text-[var(--primary)] active:opacity-75 py-1"
        >
          {t("configFeedbackSendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t("configFeedbackHint")}</p>

      <div className="hidden" aria-hidden>
        <label htmlFor={trapId}>Website</label>
        <input
          id={trapId}
          name="_trap"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="feedback-email"
          className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5"
        >
          {t("configFeedbackEmailLabel")}
        </label>
        <input
          id="feedback-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] text-sm px-4 py-3 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-app)]"
          placeholder=""
        />
      </div>

      <div>
        <label
          htmlFor="feedback-message"
          className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5"
        >
          {t("configFeedbackMessageLabel")}
        </label>
        <textarea
          id="feedback-message"
          required
          minLength={3}
          maxLength={8000}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] text-sm px-4 py-3 min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-app)]"
        />
      </div>

      {status === "err" && (
        <p className="text-sm text-[var(--accent-coral)]" role="alert">
          {t("configFeedbackError")}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending" || message.trim().length < 3}
        className="w-full rounded-xl py-3.5 px-4 text-sm font-semibold text-white transition-opacity active:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
        style={{ background: "var(--primary)", boxShadow: "0 0 16px var(--primary-glow)" }}
      >
        {status === "sending" ? t("configFeedbackSending") : t("configFeedbackSubmit")}
      </button>
    </form>
  );
}
