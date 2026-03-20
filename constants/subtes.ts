// constants/subtes.ts

export const GCBA_SUBTES_BASE = "https://apitransporte.buenosaires.gob.ar/subtes";

export const COLORES_SUBTE: Record<string, string> = {
  A: "#60a5fa",
  B: "#f87171",
  C: "#a78bfa",
  D: "#34d399",
  E: "#fb923c",
  H: "#facc15",
};

export function getColorSubte(lineaId: string): string {
  const letra = lineaId.toUpperCase().replace("LINEA_", "").replace("SUBTE", "").trim();
  return COLORES_SUBTE[letra] || "#9ca3af";
}

export const ESTACIONES: Record<string, string> = {
  SubteA: "Lima",
  SubteB: "Uruguay",
  SubteC: "Diagonal Norte",
  SubteD: "Catedral",
  SubteE: "Belgrano",
  SubteH: "Once",
};
