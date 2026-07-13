import type { StatusKey } from "~/shared/components/status-badge";

export type ProductStatus = "draft" | "active" | "archived";

export type ProductType =
  | "physical"
  | "service"
  | "digital"
  | "bundle"
  | "gift_card";

export type Product = {
  id: string;
  organizationId: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  productType: ProductType;
  status: ProductStatus;
  baseUnit: string;
  price: number;
  cost: number;
  taxProfile: string;
  trackInventory: boolean;
  branchIds: string[];
  /** Optional product image URL — missing image never blocks sell/identify */
  imageUrl?: string;
  updatedAt: string;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
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
