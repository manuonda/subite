"use client";
import Link from "next/link";
import { useParadaDetalle } from "@/features/paradas/hooks/useParadaDetalle";
import { ProximosArribos } from "./ProximosArribos";
import type { MarkerData } from "@/shared/types/mapa";
import { COLORES_SUBTE } from "@/constants/subtes";

interface ParadaDetalleSheetProps {
  marker: MarkerData | null;
  onClose: () => void;
}

export function ParadaDetalleSheet({ marker, onClose }: ParadaDetalleSheetProps) {
  const isOpen = marker !== null;
  return (
    <div
      className="lg:hidden fixed left-0 right-0 bottom-16 z-[1150] rounded-t-3xl transition-[background,box-shadow,border-color] duration-200"
      style={{
        maxHeight: "72dvh",
        background: "var(--bg-glass)",
        backdropFilter: "blur(24px)",
        borderTop: "1px solid var(--border)",
        boxShadow: "var(--shadow-sheet-up)",
        transform: isOpen ? "translateY(0)" : "translateY(110%)",
        transition: "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1), background 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {marker && <ParadaDetalleContent marker={marker} onClose={onClose} />}
    </div>
  );
}

function ParadaDetalleContent({ marker, onClose }: { marker: MarkerData; onClose: () => void }) {
  const {
    stop, estacion, accesos, sentido,
    viajes, primerServicio, ultimoServicio, trasbordos,
  } = useParadaDetalle(marker.id ?? "");

  const lineaPrincipal = viajes[0]?.route;
  const lineaLetra = lineaPrincipal?.nombre ?? "";
  const colorLinea = lineaPrincipal?.color
    ?? (lineaLetra in COLORES_SUBTE ? COLORES_SUBTE[lineaLetra as keyof typeof COLORES_SUBTE] : "#9ca3af");
  const frecuenciaTexto = viajes.find((v) => v.frecuenciaTexto)?.frecuenciaTexto;
  const nombre = estacion?.nombre ?? stop?.nombre ?? marker.nombre ?? `Parada ${marker.id}`;

  return (
    <div className="flex flex-col" style={{ maxHeight: "72dvh" }}>
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-1 shrink-0">
        <div className="w-10 h-1 rounded-full" style={{ background: "var(--drag-handle)" }} />
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 px-4 pb-3 pt-1 shrink-0">
        {lineaPrincipal && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
            style={{
              background: `${colorLinea}22`,
              border: `1.5px solid ${colorLinea}66`,
              color: colorLinea,
            }}
          >
            {lineaLetra}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base text-[var(--text-primary)] leading-tight">{nombre}</h2>
          {sentido && (
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Plataforma {sentido}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 transition-colors"
          style={{
            background: "var(--control-muted-bg)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      {/* Divider con color de línea */}
      {lineaPrincipal && (
        <div className="mx-4 mb-3 h-px shrink-0" style={{ background: `linear-gradient(to right, ${colorLinea}66, transparent)` }} />
      )}

      {/* Scrollable content */}
      <div className="overflow-y-auto flex-1 min-h-0 pb-5 space-y-3" style={{ scrollbarWidth: "none" }}>

        {/* Próximas llegadas */}
        <ProximosArribos paradaId={marker.id ?? ""} />

        {/* Horarios */}
        {(frecuenciaTexto || primerServicio || ultimoServicio) && (
          <div
            className="mx-4 rounded-2xl p-4 space-y-3"
            style={{ background: "var(--bg-panel-subtle)", border: "1px solid var(--border)" }}
          >
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-dim)]">
              Horarios
            </h3>
            {frecuenciaTexto && (
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                  style={{ background: "var(--primary-muted)", border: "1px solid var(--primary-border)" }}
                >
                  ⏱
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{frecuenciaTexto}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Frecuencia ahora</p>
                </div>
              </div>
            )}
            <div className="flex gap-5">
              {primerServicio && (
                <div>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Primer servicio</p>
                  <p
                    className="text-sm font-black mt-0.5"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-space-mono)" }}
                  >
                    {primerServicio}
                  </p>
                </div>
              )}
              {ultimoServicio && (
                <div>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Último servicio</p>
                  <p
                    className="text-sm font-black mt-0.5"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-space-mono)" }}
                  >
                    {ultimoServicio}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trasbordos */}
        {trasbordos.length > 0 && (
          <div
            className="mx-4 rounded-2xl p-4 space-y-2.5"
            style={{ background: "var(--bg-panel-subtle)", border: "1px solid var(--border)" }}
          >
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-dim)]">
              Trasbordos
            </h3>
            {trasbordos.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                {t.route && (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0"
                    style={{ background: `${t.route.color}22`, color: t.route.color, border: `1px solid ${t.route.color}44` }}
                  >
                    {t.route.nombre}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {t.estacionDestino?.nombre ?? t.stopDestino?.nombre ?? t.transfer.hasta}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.tiempoTexto}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Accesos */}
        {accesos.length > 0 && (
          <div
            className="mx-4 rounded-2xl p-4 space-y-2"
            style={{ background: "var(--bg-panel-subtle)", border: "1px solid var(--border)" }}
          >
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-dim)]">
              Accesos ({accesos.length})
            </h3>
            {accesos.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-start gap-2">
                <span className="text-sm mt-0.5">{a.accesible ? "♿" : "🚶"}</span>
                <p className="text-xs leading-snug" style={{ color: "var(--text-muted)" }}>
                  {a.descripcion}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Link a página completa */}
        <div className="mx-4">
          <Link
            href={`/parada/${marker.id}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white transition-opacity active:opacity-80"
            style={{
              background: "var(--primary)",
              boxShadow: "0 0 20px var(--primary-glow)",
            }}
          >
            Ver detalles completos →
          </Link>
        </div>
      </div>
    </div>
  );
}
