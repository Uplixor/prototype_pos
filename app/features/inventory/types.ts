import type { StatusKey } from "~/shared/components/status-badge";

export type MovementType =
  | "receipt"
  | "sale_consumption"
  | "adjustment"
  | "transfer_out"
  | "transfer_in"
  | "count_reconciliation"
  | "return";

export type StockMovement = {
  id: string;
  organizationId: string;
  branchId: string;
  branchCode: string;
  productId: string;
  sku: string;
  productName: string;
  type: MovementType;
  /** Signed quantity delta in base unit */
  quantity: number;
  unit: string;
  reason: string;
  referenceType?: string;
  referenceId?: string;
  actorName: string;
  createdAt: string;
};

export type StockBalance = {
  id: string;
  organizationId: string;
  branchId: string;
  branchCode: string;
  productId: string;
  sku: string;
  productName: string;
  unit: string;
  /** Derived projection of movements — never edited directly */
  onHand: number;
  reorderPoint: number;
  trackInventory: boolean;
  updatedAt: string;
};

export type StockHealth = "ok" | "low" | "out" | "untracked";

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  receipt: "Receipt",
  sale_consumption: "Sale",
  adjustment: "Adjustment",
  transfer_out: "Transfer out",
  transfer_in: "Transfer in",
  count_reconciliation: "Count",
  return: "Return",
};

export function stockHealth(balance: StockBalance): StockHealth {
  if (!balance.trackInventory) return "untracked";
  if (balance.onHand <= 0) return "out";
  if (balance.onHand <= balance.reorderPoint) return "low";
  return "ok";
}

export function stockHealthToBadge(health: StockHealth): StatusKey {
  switch (health) {
    case "ok":
      return "active";
    case "low":
      return "low_stock";
    case "out":
      return "out_of_stock";
    case "untracked":
      return "inactive";
  }
}

export const STOCK_HEALTH_LABELS: Record<StockHealth, string> = {
  ok: "In stock",
  low: "Low stock",
  out: "Out of stock",
  untracked: "Not tracked",
};
