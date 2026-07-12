import { ProductForm } from "~/features/catalog/components/product-form";
import type { Product } from "~/features/catalog/types";
import { useDrawer } from "~/shared/providers/drawer-provider";

export function useProductDrawer() {
  const { openDrawer } = useDrawer();

  function openCreateProduct() {
    const drawerId = "product-create";
    openDrawer({
      id: drawerId,
      title: "New product",
      description: "Define sellable product identity and pricing",
      size: "lg",
      content: <ProductForm drawerId={drawerId} />,
    });
  }

  function openEditProduct(product: Product) {
    const drawerId = `product-${product.id}`;
    openDrawer({
      id: drawerId,
      title: product.name,
      description: `${product.sku} · ${product.categoryName}`,
      size: "lg",
      content: <ProductForm product={product} drawerId={drawerId} />,
    });
  }

  return { openCreateProduct, openEditProduct };
}
