import { CatalogPage } from "~/features/catalog/components/catalog-page";

export function meta() {
  return [
    { title: "Catalog · Commerce OS" },
    {
      name: "description",
      content: "Manage products, pricing, and branch availability",
    },
  ];
}

export default function CatalogRoute() {
  return <CatalogPage />;
}
