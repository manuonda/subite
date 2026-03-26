import { NextResponse } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const runtime = "nodejs";

const MAX_MSG = 8000;
const MAX_EMAIL = 320;

/** URL del Web App de Google Apps Script (desplegado como “Cualquiera”). Ver `scripts/google-apps-script-feedback.gs`. */
const GOOGLE_FEEDBACK_WEBAPP_URL = process.env.GOOGLE_FEEDBACK_WEBAPP_URL?.trim() ?? "";
/** Opcional: mismo valor que en Script Properties del Apps Script para validar solicitudes. */
const FEEDBACK_SHEET_SECRET = process.env.FEEDBACK_SHEET_SECRET?.trim() ?? "";

function escapeCsvField(s: string): string {
  const needsQuote = /[",\r\n]/.test(s);
  const escaped = s.replace(/"/g, '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

async function appendLocalCsv(
  email: string,
  message: string,
  locale: string,
  version: string,
  ua: string,
) {
  const line =
    [
      escapeCsvField(new Date().toISOString()),
      escapeCsvField(locale),
      escapeCsvField(version),
      escapeCsvField(email),
      escapeCsvField(message),
      escapeCsvField(ua),
    ].join(",") + "\n";

  const dir = path.join(process.cwd(), "data");
  const file = path.join(dir, "feedback.csv");
  await mkdir(dir, { recursive: true });

  if (!existsSync(file)) {
    const header = "timestamp_iso,locale,app_version,email,message,user_agent\n";
    await appendFile(file, header, "utf8");
  }
  await appendFile(file, line, "utf8");
}

/**
 * Envía `email` y `comentario` a la hoja (columnas A y B) vía Apps Script.
 * Si `GOOGLE_FEEDBACK_WEBAPP_URL` no está definida, guarda en CSV local (solo desarrollo).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const trap = typeof body._trap === "string" ? body._trap : "";
    if (trap.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (message.length < 3 || message.length > MAX_MSG) {
      return NextResponse.json({ ok: false, error: "invalid_message" }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim().slice(0, MAX_EMAIL) : "";
    const locale = typeof body.locale === "string" ? body.locale.slice(0, 16) : "";
    const version = typeof body.version === "string" ? body.version.slice(0, 32) : "";
    const ua = req.headers.get("user-agent")?.slice(0, 400) ?? "";

    if (GOOGLE_FEEDBACK_WEBAPP_URL.length > 0) {
      /** Los Web App de Apps Script suelen aceptar mejor form-urlencoded que JSON desde el servidor. */
      const form = new URLSearchParams();
      form.set("email", email);
      form.set("comentario", message);
      if (FEEDBACK_SHEET_SECRET.length > 0) {
        form.set("secret", FEEDBACK_SHEET_SECRET);
      }

      const googleHeaders = {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Accept: "application/json, text/plain, */*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      };

      async function postToGoogle(body: string, json: boolean) {
        return fetch(GOOGLE_FEEDBACK_WEBAPP_URL, {
          method: "POST",
          redirect: "follow",
          headers: {
            ...googleHeaders,
            "Content-Type": json
              ? "application/json;charset=UTF-8"
              : "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body,
          signal: AbortSignal.timeout(25_000),
        });
      }

      let gRes = await postToGoogle(form.toString(), false);
      let text = await gRes.text();

      let parsed: { ok?: boolean } = {};
      try {
        parsed = JSON.parse(text) as { ok?: boolean };
      } catch {
        /* HTML de error de Google, etc. */
      }

      const failed = !gRes.ok || parsed.ok !== true;
      if (failed) {
        const payload: Record<string, string> = {
          email,
          comentario: message,
        };
        if (FEEDBACK_SHEET_SECRET.length > 0) {
          payload.secret = FEEDBACK_SHEET_SECRET;
        }
        gRes = await postToGoogle(JSON.stringify(payload), true);
        text = await gRes.text();
        try {
          parsed = JSON.parse(text) as { ok?: boolean };
        } catch {
          parsed = {};
        }
      }

      if (!gRes.ok || parsed.ok !== true) {
        const is403 = gRes.status === 403;
        const looksLikeGoogleDeny =
          text.includes("Acceso denegado") ||
          text.includes("Access denied") ||
          text.includes("Sign in");
        console.error(
          "feedback google sheet",
          gRes.status,
          is403 || looksLikeGoogleDeny
            ? "(Apps Script: Implementar → Web app → Quién tiene acceso = Cualquiera; URL …/exec; nueva versión tras editar el .gs)"
            : "",
          text.slice(0, 400),
        );
        return NextResponse.json(
          {
            ok: false,
            error: "sheet",
            ...(is403 ? { code: "google_webapp_forbidden" as const } : {}),
          },
          { status: 502 },
        );
      }

      return NextResponse.json({ ok: true });
    }

    await appendLocalCsv(email, message, locale, version, ua);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("feedback route", e);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
