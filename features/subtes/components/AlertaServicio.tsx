import type { SubteServiceAlert } from "@/types/subtes/subteServiceAlert";
import {
  pickTranslatedText,
  routeIdsFromAlert,
  formatLineaRouteLabel,
} from "@/lib/subte/service-alert-helpers";

interface AlertaServicioProps {
  alert?: SubteServiceAlert | null;
}

export function AlertaServicio({ alert }: AlertaServicioProps) {
  if (!alert) return null;

  const header = pickTranslatedText(alert.header_text);
  const description = pickTranslatedText(alert.description_text);
  const routeIds = routeIdsFromAlert(alert);
  const lineLabel = routeIds.map(formatLineaRouteLabel).join(", ");
  const showDesc = Boolean(description && description !== header);

  return (
    <div
      className="rounded-2xl p-3 mb-4 flex gap-2 border transition-colors"
      style={{
        background: "var(--alert-danger-bg)",
        borderColor: "var(--alert-danger-border)",
      }}
    >
      <span
        className="text-base flex-shrink-0"
        style={{ color: "var(--alert-danger-heading)" }}
        aria-hidden
      >
        ⚠
      </span>
      <div className="min-w-0 flex-1">
        {lineLabel ? (
          <p
            className="text-xs font-bold mb-0.5"
            style={{ color: "var(--alert-danger-heading)" }}
          >
            {lineLabel}
          </p>
        ) : null}
        {header ? (
          <p className="text-xs leading-snug" style={{ color: "var(--alert-danger-text)" }}>
            {header}
          </p>
        ) : null}
        {showDesc ? (
          <p className="text-xs leading-snug mt-1 text-[var(--text-muted)]">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
