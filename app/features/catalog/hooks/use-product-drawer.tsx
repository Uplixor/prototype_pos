import { useNavigate } from "react-router";
import { ProductViewPanel } from "~/features/catalog/components/product-view-panel";
import type { Product } from "~/features/catalog/types";
import { useDrawer } from "~/shared/providers/drawer-provider";

/**
 * Catalog product UX:
 * - New → full editor page
 * - Row click → Stitch-style view drawer
 * - Edit → full editor page
 */
export function useProductDrawer() {
  const navigate = useNavigate();
  const { openDrawer } = useDrawer();

  function openCreateProduct() {
    void navigate("/catalog/products/new");
  }

  function openViewProduct(product: Product) {
    const drawerId = `product-view-${product.id}`;
    openDrawer({
      id: drawerId,
      title: product.name,
      size: "lg",
      hideHeader: true,
      content: <ProductViewPanel product={product} drawerId={drawerId} />,
    });
  }

  function openEditProduct(product: Product | string) {
    const id = typeof product === "string" ? product : product.id;
    void navigate(`/catalog/products/${id}`);
  }

  return { openCreateProduct, openViewProduct, openEditProduct };
}
