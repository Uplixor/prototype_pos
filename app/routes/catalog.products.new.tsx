import { ProductEditorPage } from "~/features/catalog/components/product-editor/product-editor-page";

export function meta() {
  return [{ title: "New product · Commerce OS" }];
}

export default function CatalogProductNewRoute() {
  return <ProductEditorPage />;
}
