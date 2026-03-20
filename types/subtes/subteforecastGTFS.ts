/**
 * Tipos para la respuesta del endpoint forecastGTFS de la API Subtes GCBA.
 *
 * @see https://apitransporte.buenosaires.gob.ar/subtes/forecastGTFS
 *
 * ForecastGTFS captura la información de los trips actualmente recorridos por
 * vehículos en tránsito, incluyendo tiempos estimados de arribo y demoras en las
 * paradas a lo largo del trip.
 *
 * No existe necesariamente una relación uno-a-uno entre vehículos activos y trip
 * updates: las actualizaciones pueden incluir tanto el trip en curso como el
 * trip que está por empezar en los próximos minutos.
 */

export interface SubteForecastHeader {
    timestamp: number;
}

export interface SubteForecastArrivalDeparture {
    time: number;
    delay: number;
}

export interface SubteForecastEstacion {
    stop_id: string;
    stop_name: string;
    arrival: SubteForecastArrivalDeparture;
    departure: SubteForecastArrivalDeparture;
}

export interface SubteForecastLinea {
    Trip_Id: string;
    Route_Id: string;
    Direction_ID: number;
    start_time: string;
    start_date: string;
    Estaciones: SubteForecastEstacion[];
}

export interface SubteForecastEntity {
    ID: string;
    Linea: SubteForecastLinea;
}

export interface SubteForecastGTFS {
    Header: SubteForecastHeader;
    Entity: SubteForecastEntity[];
}
