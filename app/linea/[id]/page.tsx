import { LineaPageClient } from "./LineaPageClient";

type PageProps = { params: Promise<{ id: string }> };

export default function LineaPage(props: PageProps) {
  return <LineaPageClient params={props.params} />;
}
