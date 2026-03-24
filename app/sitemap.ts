import type { MetadataRoute } from "next";
import { getSubteRoutes } from "@/lib/subte/routes";
import { getEstaciones } from "@/lib/subte/estaciones";

const BASE_URL = "https://suba.com.ar";

export default function sitemap(): MetadataRoute.Sitemap {
  const lineas = getSubteRoutes().map((r) => ({
    url: `${BASE_URL}/linea/${r.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const paradas = getEstaciones().map((e) => ({
    url: `${BASE_URL}/parada/${e.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...lineas,
    ...paradas,
  ];
}
