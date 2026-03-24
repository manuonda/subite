import type { Metadata } from "next";
import { getEstacion } from "@/lib/subte/estaciones";
import { ParadaPageClient } from "./ParadaPageClient";

const BASE_URL = "https://suba.com.ar";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;
  const estacion = getEstacion(id);

  if (!estacion) return {};

  const title = `Estación ${estacion.nombre}`;
  const description = `Información en tiempo real de la estación ${estacion.nombre} del Subte de Buenos Aires. Próximas llegadas, accesos y más.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/parada/${id}`,
    },
    twitter: { title, description },
  };
}

/** No desestructurar `params` en la firma: pasar la Promise al cliente y usar `use()` allí. */
export default async function ParadaPage(props: PageProps) {
  const { id } = await props.params;
  const estacion = getEstacion(id);

  const jsonLd = estacion
    ? {
        "@context": "https://schema.org",
        "@type": "TrainStation",
        name: `Estación ${estacion.nombre}`,
        description: `Estación de subte en Ciudad Autónoma de Buenos Aires.`,
        url: `${BASE_URL}/parada/${id}`,
        geo: {
          "@type": "GeoCoordinates",
          latitude: estacion.lat,
          longitude: estacion.lng,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ciudad Autónoma de Buenos Aires",
          addressCountry: "AR",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ParadaPageClient params={props.params} />
    </>
  );
}
