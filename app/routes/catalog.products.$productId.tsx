import { useParams } from "react-router";
import { ProductEditorPage } from "~/features/catalog/components/product-editor/product-editor-page";

export function meta() {
  return [{ title: "Edit product · Commerce OS" }];
}

export default function CatalogProductEditRoute() {
  const { productId } = useParams();
  return <ProductEditorPage productId={productId} />;
}
