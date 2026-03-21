import { ParadaPageClient } from "./ParadaPageClient";

type PageProps = { params: Promise<{ id: string }> };

/** No desestructurar `params` en la firma: pasar la Promise al cliente y usar `use()` allí. */
export default function ParadaPage(props: PageProps) {
  return <ParadaPageClient params={props.params} />;
}
