export type SupplierStatus = "active" | "archived";

export type Supplier = {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  status: SupplierStatus;
  updatedAt: string;
};

export type PurchaseStatus =
  | "draft"
  | "ordered"
  | "partially_received"
  | "received"
  | "cancelled";

export type PurchaseItem = {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  unit: string;
  orderedQty: number;
  receivedQty: number;
  unitCost: number;
};

export type Purchase = {
  id: string;
  organizationId: string;
  branchId: string;
  branchCode: string;
  purchaseNumber: string;
  supplierId: string;
  supplierName: string;
  status: PurchaseStatus;
  items: PurchaseItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type GoodsReceipt = {
  id: string;
  organizationId: string;
  purchaseId: string;
  purchaseNumber: string;
  branchId: string;
  branchCode: string;
  receiptNumber: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
  }>;
  actorName: string;
  createdAt: string;
};

export const PURCHASE_STATUS_LABELS: Record<PurchaseStatus, string> = {
  draft: "Draft",
  ordered: "Ordered",
  partially_received: "Partially received",
  received: "Received",
  cancelled: "Cancelled",
};
