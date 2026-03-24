/**
 * Hook que compone toda la información estática GTFS para una parada de subte.
 * No hace llamadas HTTP — usa los JSON procesados en data/subtes/processed/.
 */

import { useMemo } from "react";
import {
  getSubteStop,
  getEstacionDeParada,
  getAccesosDeEstacion,
  getTrips,
  getHorarioEnParada,
  getFrecuenciaActual,
  formatFrecuencia,
  getServiceIdHoy,
  getTransfersDesde,
  getSubteRoute,
} from "@/lib/subte";
import type {
  SubteStop,
  SubteEstacion,
  SubteAcceso,
  SubteTrip,
  SubteRoute,
  StopTimeEntry,
  FranjaHoraria,
  SubteTransfer,
} from "@/lib/subte";

export interface ViajeEnParada {
  trip: SubteTrip;
  route: SubteRoute | undefined;
  horario: StopTimeEntry | undefined;
  /** Franja horaria activa ahora mismo */
  frecuenciaAhora: FranjaHoraria | undefined;
  frecuenciaTexto: string | undefined;
}

export interface TrasbordomDetalle {
  transfer: SubteTransfer;
  stopDestino: SubteStop | undefined;
  estacionDestino: SubteEstacion | undefined;
  route: SubteRoute | undefined;
  tiempoTexto: string;
}

export interface ParadaDetalle {
  stop: SubteStop | undefined;
  estacion: SubteEstacion | undefined;
  accesos: SubteAcceso[];
  /** Sentido de circulación derivado del sufijo del ID */
  sentido: string | undefined;
  /** Viajes que pasan por esta parada, del servicio activo hoy */
  viajes: ViajeEnParada[];
  /** Hora del primer servicio en esta parada (HH:MM) */
  primerServicio: string | undefined;
  /** Hora del último servicio en esta parada (HH:MM) */
  ultimoServicio: string | undefined;
  trasbordos: TrasbordomDetalle[];
  serviceIdHoy: string | undefined;
}

function horaActualHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function parseSentido(stopId: string): string | undefined {
  const sufijo = stopId.slice(-1).toUpperCase();
  const map: Record<string, string> = { N: "Norte", S: "Sur", E: "Este", O: "Oeste" };
  return map[sufijo];
}

/** Primer horario de la lista de franjas de un trip para esta parada */
function extractHH(timeStr: string): string {
  // times can be "25:30:00" (next-day GTFS), normalize to HH:MM
  const [h, m] = timeStr.split(":");
  const hNum = parseInt(h) % 24;
  return `${String(hNum).padStart(2, "0")}:${m}`;
}

export function useParadaDetalle(stopId: string): ParadaDetalle {
  return useMemo(() => {
    const stop = getSubteStop(stopId);
    const estacion = getEstacionDeParada(stopId);
    const accesos = estacion ? getAccesosDeEstacion(estacion.id) : [];
    const sentido = parseSentido(stopId);
    const serviceIdHoy = getServiceIdHoy();
    const hora = horaActualHHMM();

    // Todos los viajes que incluyen esta parada, filtrados por servicio de hoy
    const todosLosViajes = getTrips();
    const viajesEnParada = todosLosViajes.filter((t) => {
      if (serviceIdHoy && t.serviceId !== serviceIdHoy) return false;
      return getHorarioEnParada(t.id, stopId) !== undefined;
    });

    const viajes: ViajeEnParada[] = viajesEnParada.map((trip) => {
      const route = getSubteRoute(trip.routeId);
      const horario = getHorarioEnParada(trip.id, stopId);
      const frecuenciaAhora = getFrecuenciaActual(trip.id, hora);
      return {
        trip,
        route,
        horario,
        frecuenciaAhora,
        frecuenciaTexto: frecuenciaAhora
          ? formatFrecuencia(frecuenciaAhora.cada)
          : undefined,
      };
    });

    // Primer y último servicio: min/max de horarios de llegada entre todos los viajes de hoy
    const horariosLlegada = viajes
      .map((v) => v.horario?.llegada)
      .filter((h): h is string => !!h)
      .sort();
    const primerServicio = horariosLlegada[0]
      ? extractHH(horariosLlegada[0])
      : undefined;
    const ultimoServicio = horariosLlegada[horariosLlegada.length - 1]
      ? extractHH(horariosLlegada[horariosLlegada.length - 1])
      : undefined;

    // Trasbordos
    const rawTransfers = getTransfersDesde(stopId);
    const trasbordos: TrasbordomDetalle[] = rawTransfers.map((t) => {
      const stopDestino = getSubteStop(t.hasta);
      const estacionDestino = getEstacionDeParada(t.hasta);
      // Línea del destino: buscar cualquier viaje que pase por ese stop
      const tripDestino = todosLosViajes.find(
        (trip) => getHorarioEnParada(trip.id, t.hasta) !== undefined
      );
      const route = tripDestino ? getSubteRoute(tripDestino.routeId) : undefined;
      const minutos = Math.ceil(t.tiempoMin / 60);
      return {
        transfer: t,
        stopDestino,
        estacionDestino,
        route,
        tiempoTexto: `${minutos} min caminando`,
      };
    });

    return {
      stop,
      estacion,
      accesos,
      sentido,
      viajes,
      primerServicio,
      ultimoServicio,
      trasbordos,
      serviceIdHoy,
    };
  }, [stopId]);
}
