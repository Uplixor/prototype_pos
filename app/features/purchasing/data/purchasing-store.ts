import { listProducts } from "~/features/catalog/data/catalog-store";
import { appendStockMovement } from "~/features/inventory/data/inventory-store";
import type {
  GoodsReceipt,
  Purchase,
  PurchaseItem,
  Supplier,
} from "~/features/purchasing/types";

const BRANCH_CODES: Record<string, string> = {
  br_hq: "HQ",
  br_dt: "DT",
  br_ml: "ML",
};

function delay(ms = 220): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let purchaseSeq = 2205;
let receiptSeq = 2215;

let suppliers: Supplier[] = [
  {
    id: "sup_1",
    organizationId: "org_demo",
    name: "Summit Distributors",
    email: "orders@summit.example",
    phone: "+1 555 0101",
    status: "active",
    updatedAt: "2026-07-10T00:00:00.000Z",
  },
  {
    id: "sup_2",
    organizationId: "org_demo",
    name: "Fresh Farms Co-op",
    email: "hello@freshfarms.example",
    phone: "+1 555 0102",
    status: "active",
    updatedAt: "2026-07-10T00:00:00.000Z",
  },
  {
    id: "sup_3",
    organizationId: "org_demo",
    name: "Legacy Packaging",
    email: "sales@legacypkg.example",
    phone: "+1 555 0103",
    status: "archived",
    updatedAt: "2026-07-01T00:00:00.000Z",
  },
];

let purchases: Purchase[] = [
  {
    id: "po_1",
    organizationId: "org_demo",
    branchId: "br_hq",
    branchCode: "HQ",
    purchaseNumber: "PO-2201",
    supplierId: "sup_1",
    supplierName: "Summit Distributors",
    status: "received",
    items: [
      {
        id: "poi_1",
        productId: "prd_1001",
        sku: "BEV-ESP-01",
        productName: "Espresso",
        unit: "each",
        orderedQty: 120,
        receivedQty: 120,
        unitCost: 0.7,
      },
      {
        id: "poi_2",
        productId: "prd_1002",
        sku: "BEV-LAT-12",
        productName: "Latte 12oz",
        unit: "each",
        orderedQty: 80,
        receivedQty: 80,
        unitCost: 0.95,
      },
    ],
    createdAt: "2026-07-09T10:00:00.000Z",
    updatedAt: "2026-07-10T08:00:00.000Z",
  },
  {
    id: "po_2",
    organizationId: "org_demo",
    branchId: "br_hq",
    branchCode: "HQ",
    purchaseNumber: "PO-2208",
    supplierId: "sup_2",
    supplierName: "Fresh Farms Co-op",
    status: "ordered",
    items: [
      {
        id: "poi_3",
        productId: "prd_1003",
        sku: "BKY-CRO-01",
        productName: "Butter Croissant",
        unit: "each",
        orderedQty: 60,
        receivedQty: 0,
        unitCost: 0.85,
      },
      {
        id: "poi_4",
        productId: "prd_1008",
        sku: "BKY-MUF-BL",
        productName: "Blueberry Muffin",
        unit: "each",
        orderedQty: 40,
        receivedQty: 0,
        unitCost: 0.7,
      },
    ],
    notes: "Morning bakery replenishment",
    createdAt: "2026-07-12T06:30:00.000Z",
    updatedAt: "2026-07-12T06:35:00.000Z",
  },
  {
    id: "po_3",
    organizationId: "org_demo",
    branchId: "br_hq",
    branchCode: "HQ",
    purchaseNumber: "PO-2210",
    supplierId: "sup_1",
    supplierName: "Summit Distributors",
    status: "draft",
    items: [
      {
        id: "poi_5",
        productId: "prd_1004",
        sku: "GRC-MLK-1L",
        productName: "Whole Milk 1L",
        unit: "each",
        orderedQty: 48,
        receivedQty: 0,
        unitCost: 1.45,
      },
    ],
    createdAt: "2026-07-12T14:00:00.000Z",
    updatedAt: "2026-07-12T14:00:00.000Z",
  },
];

let receipts: GoodsReceipt[] = [
  {
    id: "gr_1",
    organizationId: "org_demo",
    purchaseId: "po_1",
    purchaseNumber: "PO-2201",
    branchId: "br_hq",
    branchCode: "HQ",
    receiptNumber: "GR-2201",
    items: [
      {
        productId: "prd_1001",
        productName: "Espresso",
        quantity: 120,
        unit: "each",
      },
      {
        productId: "prd_1002",
        productName: "Latte 12oz",
        quantity: 80,
        unit: "each",
      },
    ],
    actorName: "Alex Morgan",
    createdAt: "2026-07-10T08:00:00.000Z",
  },
];

export async function listSuppliers(): Promise<Supplier[]> {
  await delay(100);
  return suppliers.map((s) => ({ ...s }));
}

export async function createSupplier(
  input: Omit<Supplier, "id" | "updatedAt" | "organizationId" | "status"> & {
    organizationId?: string;
  },
): Promise<Supplier> {
  await delay();
  const supplier: Supplier = {
    id: `sup_${Date.now()}`,
    organizationId: input.organizationId ?? "org_demo",
    name: input.name,
    email: input.email,
    phone: input.phone,
    status: "active",
    updatedAt: new Date().toISOString(),
  };
  suppliers = [supplier, ...suppliers];
  return { ...supplier };
}

export async function archiveSupplier(id: string): Promise<void> {
  await delay(100);
  suppliers = suppliers.map((s) =>
    s.id === id
      ? { ...s, status: "archived" as const, updatedAt: new Date().toISOString() }
      : s,
  );
}

export async function listPurchases(): Promise<Purchase[]> {
  await delay();
  return purchases.map((p) => ({
    ...p,
    items: p.items.map((i) => ({ ...i })),
  }));
}

export async function getPurchase(id: string): Promise<Purchase | null> {
  await delay(80);
  const purchase = purchases.find((p) => p.id === id);
  return purchase
    ? { ...purchase, items: purchase.items.map((i) => ({ ...i })) }
    : null;
}

export type CreatePurchaseInput = {
  organizationId: string;
  branchId: string;
  supplierId: string;
  notes?: string;
  items: Array<{ productId: string; orderedQty: number; unitCost: number }>;
};

export async function createPurchase(
  input: CreatePurchaseInput,
): Promise<Purchase> {
  await delay();
  const supplier = suppliers.find((s) => s.id === input.supplierId);
  if (!supplier || supplier.status !== "active") {
    throw new Error("Active supplier required");
  }
  const products = await listProducts();
  const items: PurchaseItem[] = input.items.map((line, index) => {
    const product = products.find((p) => p.id === line.productId);
    if (!product) throw new Error("Product not found");
    return {
      id: `poi_${Date.now()}_${index}`,
      productId: product.id,
      sku: product.sku,
      productName: product.name,
      unit: product.baseUnit,
      orderedQty: line.orderedQty,
      receivedQty: 0,
      unitCost: line.unitCost,
    };
  });

  purchaseSeq += 1;
  const timestamp = new Date().toISOString();
  const purchase: Purchase = {
    id: `po_${Date.now()}`,
    organizationId: input.organizationId,
    branchId: input.branchId,
    branchCode: BRANCH_CODES[input.branchId] ?? "HQ",
    purchaseNumber: `PO-${purchaseSeq}`,
    supplierId: supplier.id,
    supplierName: supplier.name,
    status: "draft",
    items,
    notes: input.notes,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  purchases = [purchase, ...purchases];
  return { ...purchase, items: items.map((i) => ({ ...i })) };
}

export async function orderPurchase(id: string): Promise<Purchase> {
  await delay(120);
  const index = purchases.findIndex((p) => p.id === id);
  if (index < 0) throw new Error("Purchase not found");
  const current = purchases[index]!;
  if (current.status !== "draft") {
    throw new Error("Only draft purchases can be ordered");
  }
  const next = {
    ...current,
    status: "ordered" as const,
    updatedAt: new Date().toISOString(),
  };
  purchases = [...purchases.slice(0, index), next, ...purchases.slice(index + 1)];
  return { ...next, items: next.items.map((i) => ({ ...i })) };
}

export async function listReceipts(): Promise<GoodsReceipt[]> {
  await delay();
  return receipts.map((r) => ({
    ...r,
    items: r.items.map((i) => ({ ...i })),
  }));
}

export type ConfirmReceiptInput = {
  purchaseId: string;
  actorName: string;
  lines: Array<{ productId: string; quantity: number }>;
};

export async function confirmGoodsReceipt(
  input: ConfirmReceiptInput,
): Promise<GoodsReceipt> {
  await delay();
  const index = purchases.findIndex((p) => p.id === input.purchaseId);
  if (index < 0) throw new Error("Purchase not found");
  const purchase = purchases[index]!;
  if (
    purchase.status !== "ordered" &&
    purchase.status !== "partially_received"
  ) {
    throw new Error("Purchase is not receivable");
  }

  const receivedLines = input.lines.filter((l) => l.quantity > 0);
  if (receivedLines.length === 0) {
    throw new Error("Enter at least one received quantity");
  }

  const updatedItems = purchase.items.map((item) => {
    const line = receivedLines.find((l) => l.productId === item.productId);
    if (!line) return item;
    const remaining = item.orderedQty - item.receivedQty;
    if (line.quantity > remaining) {
      throw new Error(
        `Cannot receive more than remaining for ${item.productName}`,
      );
    }
    return { ...item, receivedQty: item.receivedQty + line.quantity };
  });

  for (const line of receivedLines) {
    const item = purchase.items.find((i) => i.productId === line.productId);
    if (!item) throw new Error("Unknown product on purchase");
    await appendStockMovement({
      organizationId: purchase.organizationId,
      branchId: purchase.branchId,
      productId: line.productId,
      type: "receipt",
      quantity: line.quantity,
      reason: `Goods receipt ${purchase.purchaseNumber}`,
      referenceType: "goods_receipt",
      referenceId: purchase.id,
      actorName: input.actorName,
    });
  }

  const allReceived = updatedItems.every((i) => i.receivedQty >= i.orderedQty);
  const anyReceived = updatedItems.some((i) => i.receivedQty > 0);
  const nextPurchase: Purchase = {
    ...purchase,
    items: updatedItems,
    status: allReceived
      ? "received"
      : anyReceived
        ? "partially_received"
        : purchase.status,
    updatedAt: new Date().toISOString(),
  };
  purchases = [
    ...purchases.slice(0, index),
    nextPurchase,
    ...purchases.slice(index + 1),
  ];

  receiptSeq += 1;
  const receipt: GoodsReceipt = {
    id: `gr_${Date.now()}`,
    organizationId: purchase.organizationId,
    purchaseId: purchase.id,
    purchaseNumber: purchase.purchaseNumber,
    branchId: purchase.branchId,
    branchCode: purchase.branchCode,
    receiptNumber: `GR-${receiptSeq}`,
    items: receivedLines.map((line) => {
      const item = purchase.items.find((i) => i.productId === line.productId)!;
      return {
        productId: line.productId,
        productName: item.productName,
        quantity: line.quantity,
        unit: item.unit,
      };
    }),
    actorName: input.actorName,
    createdAt: new Date().toISOString(),
  };
  receipts = [receipt, ...receipts];
  return {
    ...receipt,
    items: receipt.items.map((i) => ({ ...i })),
  };
}
