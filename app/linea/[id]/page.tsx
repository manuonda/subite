import type { Metadata } from "next";
import { getSubteRoute } from "@/lib/subte/routes";
import { LineaPageClient } from "./LineaPageClient";

const BASE_URL = "https://suba.com.ar";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;
  const route = getSubteRoute(id);

  if (!route) return {};

  const title = `Línea ${route.nombre} — ${route.nombreLargo}`;
  const description = `Información en tiempo real de la Línea ${route.nombre} del Subte de Buenos Aires: ${route.nombreLargo}. Próximas llegadas, alertas y más.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/linea/${id}`,
    },
    twitter: { title, description },
  };
}

export default async function LineaPage(props: PageProps) {
  const { id } = await props.params;
  const route = getSubteRoute(id);

  const jsonLd = route
    ? {
        "@context": "https://schema.org",
        "@type": "TrainRoute",
        name: `Línea ${route.nombre} — ${route.nombreLargo}`,
        provider: {
          "@type": "Organization",
          name: "Subte de Buenos Aires",
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
      <LineaPageClient params={props.params} />
    </>
  );
}
