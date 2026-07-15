import type { StatusKey } from "~/shared/components/status-badge";

export type ProductStatus = "draft" | "active" | "archived";

export type ProductType =
  | "physical"
  | "service"
  | "digital"
  | "bundle"
  | "gift_card";

export type CategoryStatus = "active" | "archived";

export type Category = {
  id: string;
  name: string;
  parentId: string | null;
  status: CategoryStatus;
  sortOrder: number;
};

/** One selectable axis on a product (e.g. Color, Size). */
export type ProductOptionAxis = {
  id: string;
  name: string;
  values: string[];
};

/** Purchasable version of a Product — own SKU, price, and lifecycle. */
export type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  skuSuffix: string;
  barcode?: string;
  /** Maps option axis id → selected value */
  optionValues: Record<string, string>;
  price: number;
  cost: number;
  status: ProductStatus;
  /** Optional variant image — falls back to product image when missing */
  imageUrl?: string;
};

export type ModifierOption = {
  id: string;
  name: string;
  priceDelta: number;
};

/** Optional add-on group at sell time (distinct from variants). */
export type ModifierGroup = {
  id: string;
  name: string;
  required: boolean;
  multiSelect: boolean;
  options: ModifierOption[];
};

export type Product = {
  id: string;
  organizationId: string;
  sku: string;
  barcode?: string;
  name: string;
  description: string;
  brand?: string;
  categoryId: string;
  /** Denormalized breadcrumb path for list/POS display */
  categoryName: string;
  productType: ProductType;
  status: ProductStatus;
  baseUnit: string;
  /** Base / fallback price when no active variants */
  price: number;
  cost: number;
  taxProfile: string;
  trackInventory: boolean;
  branchIds: string[];
  optionAxes: ProductOptionAxis[];
  variants: ProductVariant[];
  modifiers: ModifierGroup[];
  /** Optional product image URL — missing image never blocks sell/identify */
  imageUrl?: string;
  /** Gallery images; first item is treated as primary when imageUrl empty */
  mediaUrls?: string[];
  compareAtPrice?: number;
  collections?: string[];
  tags?: string[];
  supplier?: string;
  weightOz?: number;
  dimL?: number;
  dimW?: number;
  dimH?: number;
  hsCode?: string;
  updatedAt: string;
  createdAt: string;
};

export type ProductListFilters = {
  status?: ProductStatus | "all";
  categoryId?: string | "all";
  search?: string;
};

export function productStatusToBadge(status: ProductStatus): StatusKey {
  switch (status) {
    case "active":
      return "active";
    case "draft":
      return "draft";
    case "archived":
      return "inactive";
  }
}

export function formatMoney(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/** Active sellable variants, or empty when the product sells as a single SKU. */
export function activeVariants(product: Product): ProductVariant[] {
  return product.variants.filter((v) => v.status === "active");
}

/** Display price: lowest active variant price, else product base price. */
export function displayProductPrice(product: Product): number {
  const variants = activeVariants(product);
  if (variants.length === 0) return product.price;
  return Math.min(...variants.map((v) => v.price));
}

export function formatProductPrice(product: Product): string {
  const variants = activeVariants(product);
  if (variants.length <= 1) {
    return formatMoney(displayProductPrice(product));
  }
  const prices = variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return formatMoney(min);
  return `${formatMoney(min)} – ${formatMoney(max)}`;
}

/** Variant image, else product primary image. */
export function resolveVariantImage(
  product: Product,
  variant: ProductVariant,
): string | undefined {
  return variant.imageUrl || product.imageUrl;
}
