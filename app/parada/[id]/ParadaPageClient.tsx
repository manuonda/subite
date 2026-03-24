"use client";

import { use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mapa } from "@/shared/components/mapa/Mapa";
import { ProximosArribos } from "@/features/paradas/components/ProximosArribos";
import { BackIcon } from "@/shared/components/ui/Icons";
import { BA_CENTER } from "@/shared/constants/geo";
import { useParadaDetalle } from "@/features/paradas/hooks/useParadaDetalle";

interface ParadaPageClientProps {
  params: Promise<{ id: string }>;
}

export function ParadaPageClient({ params }: ParadaPageClientProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const linea = searchParams.get("linea");
  const backHref = from === "linea" && linea ? `/linea/${linea}` : "/";
  const detalle = useParadaDetalle(id);
  const { stop, estacion, accesos, sentido, viajes, primerServicio, ultimoServicio, trasbordos } = detalle;

  console.log(`stop:`, stop);
  console.log(`estacion:`, estacion);
  console.log(`accesos:`, accesos);
  console.log(`sentido:`, sentido);
  console.log(`viajes:`, viajes);
  console.log(`primerServicio:`, primerServicio);
  console.log(`ultimoServicio:`, ultimoServicio);
  console.log(`trasbordos:`, trasbordos);
  // Línea principal de esta parada (primer viaje disponible)
  const lineaPrincipal = viajes[0]?.route;
  const colorLinea = lineaPrincipal?.color ?? "#9ca3af";

  // Coordenadas reales del stop, fallback al centro de BA
  const lat = stop?.lat ?? BA_CENTER.lat;
  const lng = stop?.lng ?? BA_CENTER.lng;

  // Frecuencia actual: usar el primer viaje con franja activa
  const frecuenciaTexto = viajes.find((v) => v.frecuenciaTexto)?.frecuenciaTexto;

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[var(--bg-app)] border-b border-[var(--border)] flex items-center px-4 z-40 gap-3">
        <Link href={backHref} className="text-[var(--text-muted)] active:text-[var(--primary)] transition-colors">
          <BackIcon size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-[var(--text-primary)] text-sm truncate">
            {estacion?.nombre ?? stop?.nombre ?? `Parada ${id}`}
          </h1>
          {sentido && (
            <p className="text-xs text-[var(--text-muted)]">Plataforma {sentido}</p>
          )}
        </div>
        {lineaPrincipal && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: colorLinea }}
          >
            {lineaPrincipal.nombre}
          </div>
        )}
      </header>

      <div className="pt-14">
        {/* Mapa centrado en las coords reales del stop */}
        <div style={{ height: "200px" }}>
          <Mapa
            lat={lat}
            lng={lng}
            height="200px"
            zoom={16}
            markers={stop ? [{ id: stop.id, lat: stop.lat, lng: stop.lng, type: "subte", nombre: stop.nombre, label: stop.nombre }] : []}
          />
        </div>

        <div className="px-4 pb-6 space-y-4 mt-4">

          {/* Info de estación */}
          {(estacion || stop) && (
            <div className="bg-white/5 rounded-2xl border border-[var(--border)] p-4 space-y-2">
              <h2 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wide">Estación</h2>
              <div className="flex items-center gap-2 flex-wrap">
                {stop?.accesible && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                    ♿ Accesible
                  </span>
                )}
                {sentido && (
                  <span className="text-xs bg-white/10 text-[var(--text-muted)] px-2 py-0.5 rounded-full">
                    Plataforma {sentido}
                  </span>
                )}
                {lineaPrincipal && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                    style={{ backgroundColor: colorLinea + "33", color: colorLinea }}
                  >
                    Línea {lineaPrincipal.nombre}
                  </span>
                )}
              </div>
              {lineaPrincipal?.nombreLargo && (
                <p className="text-sm text-[var(--text-muted)]">{lineaPrincipal.nombreLargo}</p>
              )}
            </div>
          )}

          {/* Horarios del día */}
          {(frecuenciaTexto || primerServicio || ultimoServicio) && (
            <div className="bg-white/5 rounded-2xl border border-[var(--border)] p-4 space-y-3">
              <h2 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wide">Horarios</h2>
              {frecuenciaTexto && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">⏱</span>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{frecuenciaTexto}</p>
                    <p className="text-xs text-[var(--text-muted)]">Frecuencia ahora</p>
                  </div>
                </div>
              )}
              <div className="flex gap-4">
                {primerServicio && (
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Primer servicio</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{primerServicio}</p>
                  </div>
                )}
                {ultimoServicio && (
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Último servicio</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{ultimoServicio}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Próximas llegadas (tiempo real) */}
          <ProximosArribos paradaId={id} />

          {/* Trasbordos */}
          {trasbordos.length > 0 && (
            <div className="bg-white/5 rounded-2xl border border-[var(--border)] p-4 space-y-3">
              <h2 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wide">
                Trasbordos
              </h2>
              {trasbordos.map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  {t.route && (
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: t.route.color }}
                    >
                      {t.route.nombre}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)] truncate">
                      {t.estacionDestino?.nombre ?? t.stopDestino?.nombre ?? t.transfer.hasta}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{t.tiempoTexto}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Accesos */}
          {accesos.length > 0 && (
            <div className="bg-white/5 rounded-2xl border border-[var(--border)] p-4 space-y-3">
              <h2 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wide">
                Accesos ({accesos.length})
              </h2>
              {accesos.map((a) => (
                <div key={a.id} className="flex items-start gap-2">
                  <span className="text-base mt-0.5">{a.accesible ? "♿" : "🚶"}</span>
                  <p className="text-sm text-[var(--text-muted)] leading-snug">{a.descripcion}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
