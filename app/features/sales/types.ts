import type { StatusKey } from "~/shared/components/status-badge";

export type SaleStatus =
  | "open"
  | "awaiting_payment"
  | "completed"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "cash" | "card" | "other";

export type SaleItem = {
  id: string;
  productId: string;
  /** Present when the sale line is a specific product variant */
  variantId?: string;
  /** Frozen sell-time snapshot — never recalculated from Catalog after add */
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
  taxRate: number;
  lineTotal: number;
};

export type SalePayment = {
  id: string;
  method: PaymentMethod;
  amount: number;
  recordedAt: string;
  idempotencyKey: string;
};

export type SaleRefund = {
  id: string;
  amount: number;
  reason: string;
  recordedAt: string;
};

export type Sale = {
  id: string;
  organizationId: string;
  branchId: string;
  branchCode: string;
  saleNumber: string;
  status: SaleStatus;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  payments: SalePayment[];
  refunds: SaleRefund[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  notes?: string;
};

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  open: "Open",
  awaiting_payment: "Awaiting payment",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function saleStatusToBadge(status: SaleStatus): StatusKey {
  switch (status) {
    case "open":
      return "draft";
    case "awaiting_payment":
      return "unpaid";
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled";
    case "refunded":
      return "refunded";
  }
}

export function formatMoney(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function computeSaleTotals(items: SaleItem[]): {
  subtotal: number;
  taxTotal: number;
  total: number;
} {
  const subtotal = round2(
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
  const taxTotal = round2(
    items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity * item.taxRate,
      0,
    ),
  );
  return { subtotal, taxTotal, total: round2(subtotal + taxTotal) };
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function isSaleMutable(status: SaleStatus): boolean {
  return status === "open" || status === "awaiting_payment";
}

export function saleTotalRefunded(sale: Sale): number {
  return round2(sale.refunds.reduce((sum, refund) => sum + refund.amount, 0));
}

export function saleRefundableAmount(sale: Sale): number {
  return round2(Math.max(sale.amountPaid - saleTotalRefunded(sale), 0));
}
