/**
 * Datos referenciales del cuadro tarifario Emova (Subte / Premetro).
 * Actualizar cuando cambie la fuente oficial.
 * @see https://emova.com.ar/index.php/cuadro-Tarifario/
 */

export const EMOVA_CUADRO_TARIFARIO_URL =
  "https://emova.com.ar/index.php/cuadro-Tarifario/";

export const TARIFAS_INTRO_ES: string[] = [
  "TARIFAS DEL SERVICIO DE LA RED DE SUBTE",
  "Los usuarios de Subte abonan una menor tarifa cuanto más viajan. Los descuentos son del 20%, 30% y 40% en la medida que se superan los 20, 30 y 40 viajes mensuales y se aplican desde el primer día del mes hasta el último.",
  "Este beneficio se encuentra disponible con todos los medios de pago, es decir tanto con la tarjeta SUBE como con tarjetas de crédito, débito, NFC y pago con código QR, siempre que se use el mismo medio de pago. Se puede utilizar todos los días, sin límite de horario.",
];

/** Encabezados de columnas: cantidad de viajes por mes */
export const TRAMOS_VIAJES_ES = ["1 a 20", "21 a 30", "31 a 40", "41 o más"] as const;

export interface CeldaTarifa {
  tarifa: number;
  subeNoNominalizada: number;
}

export interface FilaCuadroTarifas {
  servicio: string;
  celdas: CeldaTarifa[];
}

/** Valores en ARS (número) según cuadro Emova (referencia). */
export const FILAS_CUADRO_TARIFAS: FilaCuadroTarifas[] = [
  {
    servicio: "Subte / Subte y Premetro",
    celdas: [
      { tarifa: 1363, subeNoNominalizada: 2167.17 },
      { tarifa: 1090.4, subeNoNominalizada: 1733.74 },
      { tarifa: 954.1, subeNoNominalizada: 1517.02 },
      { tarifa: 817.8, subeNoNominalizada: 1300.3 },
    ],
  },
  {
    servicio: "Premetro",
    celdas: [
      { tarifa: 477.05, subeNoNominalizada: 758.51 },
      { tarifa: 477.05, subeNoNominalizada: 758.51 },
      { tarifa: 477.05, subeNoNominalizada: 758.51 },
      { tarifa: 477.05, subeNoNominalizada: 758.51 },
    ],
  },
];

export function formatArs(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
