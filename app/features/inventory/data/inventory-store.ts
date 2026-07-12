import { listProducts } from "~/features/catalog/data/catalog-store";
import type {
  MovementType,
  StockBalance,
  StockMovement,
} from "~/features/inventory/types";

const BRANCH_CODES: Record<string, string> = {
  br_hq: "HQ",
  br_dt: "DT",
  br_ml: "ML",
};

function delay(ms = 240): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function movement(
  partial: Omit<StockMovement, "id" | "organizationId"> & {
    id?: string;
    organizationId?: string;
  },
): StockMovement {
  return {
    id: partial.id ?? `mvt_${Math.random().toString(36).slice(2, 10)}`,
    organizationId: partial.organizationId ?? "org_demo",
    branchId: partial.branchId,
    branchCode: partial.branchCode,
    productId: partial.productId,
    sku: partial.sku,
    productName: partial.productName,
    type: partial.type,
    quantity: partial.quantity,
    unit: partial.unit,
    reason: partial.reason,
    referenceType: partial.referenceType,
    referenceId: partial.referenceId,
    actorName: partial.actorName,
    createdAt: partial.createdAt,
  };
}

/** Append-only ledger — balances are never stored as source of truth. */
let movements: StockMovement[] = [
  movement({
    id: "mvt_1",
    branchId: "br_hq",
    branchCode: "HQ",
    productId: "prd_1001",
    sku: "BEV-ESP-01",
    productName: "Espresso",
    type: "receipt",
    quantity: 120,
    unit: "each",
    reason: "Goods receipt PO-2201",
    referenceType: "goods_receipt",
    referenceId: "gr_2201",
    actorName: "Alex Morgan",
    createdAt: "2026-07-10T08:00:00.000Z",
  }),
  movement({
    id: "mvt_2",
    branchId: "br_hq",
    branchCode: "HQ",
    productId: "prd_1001",
    sku: "BEV-ESP-01",
    productName: "Espresso",
    type: "sale_consumption",
    quantity: -18,
    unit: "each",
    reason: "Completed sale SO-10482",
    referenceType: "sale",
    referenceId: "sale_1",
    actorName: "System",
    createdAt: "2026-07-12T09:30:00.000Z",
  }),
  movement({
    id: "mvt_3",
    branchId: "br_hq",
    branchCode: "HQ",
    productId: "prd_1002",
    sku: "BEV-LAT-12",
    productName: "Latte 12oz",
    type: "receipt",
    quantity: 80,
    unit: "each",
    reason: "Goods receipt PO-2201",
    referenceType: "goods_receipt",
    referenceId: "gr_2201",
    actorName: "Alex Morgan",
    createdAt: "2026-07-10T08:00:00.000Z",
  }),
  movement({
    id: "mvt_4",
    branchId: "br_dt",
    branchCode: "DT",
    productId: "prd_1002",
    sku: "BEV-LAT-12",
    productName: "Latte 12oz",
    type: "transfer_in",
    quantity: 24,
    unit: "each",
    reason: "Transfer from HQ",
    referenceType: "transfer",
    referenceId: "tr_101",
    actorName: "Alex Morgan",
    createdAt: "2026-07-11T14:00:00.000Z",
  }),
  movement({
    id: "mvt_5",
    branchId: "br_hq",
    branchCode: "HQ",
    productId: "prd_1002",
    sku: "BEV-LAT-12",
    productName: "Latte 12oz",
    type: "transfer_out",
    quantity: -24,
    unit: "each",
    reason: "Transfer to Downtown",
    referenceType: "transfer",
    referenceId: "tr_101",
    actorName: "Alex Morgan",
    createdAt: "2026-07-11T14:00:00.000Z",
  }),
  movement({
    id: "mvt_6",
    branchId: "br_hq",
    branchCode: "HQ",
    productId: "prd_1003",
    sku: "BKY-CRO-01",
    productName: "Butter Croissant",
    type: "receipt",
    quantity: 40,
    unit: "each",
    reason: "Bakery production receipt",
    referenceType: "goods_receipt",
    referenceId: "gr_2208",
    actorName: "Alex Morgan",
    createdAt: "2026-07-12T06:00:00.000Z",
  }),
  movement({
    id: "mvt_7",
    branchId: "br_hq",
    branchCode: "HQ",
    productId: "prd_1003",
    sku: "BKY-CRO-01",
    productName: "Butter Croissant",
    type: "sale_consumption",
    quantity: -12,
    unit: "each",
    reason: "Completed sale SO-10482",
    referenceType: "sale",
    referenceId: "sale_1",
    actorName: "System",
    createdAt: "2026-07-12T09:30:00.000Z",
  }),
  movement({
    id: "mvt_8",
    branchId: "br_hq",
    branchCode: "HQ",
    productId: "prd_1003",
    sku: "BKY-CRO-01",
    productName: "Butter Croissant",
    type: "adjustment",
    quantity: -3,
    unit: "each",
    reason: "Damaged",
    actorName: "Alex Morgan",
    createdAt: "2026-07-12T11:00:00.000Z",
  }),
  movement({
    id: "mvt_9",
    branchId: "br_hq",
    branchCode: "HQ",
    productId: "prd_1004",
    sku: "GRC-MLK-1L",
    productName: "Whole Milk 1L",
    type: "receipt",
    quantity: 24,
    unit: "each",
    reason: "Goods receipt PO-2210",
    referenceType: "goods_receipt",
    referenceId: "gr_2210",
    actorName: "Alex Morgan",
    createdAt: "2026-07-09T10:00:00.000Z",
  }),
  movement({
    id: "mvt_10",
    branchId: "br_hq",
    branchCode: "HQ",
    productId: "prd_1004",
    sku: "GRC-MLK-1L",
    productName: "Whole Milk 1L",
    type: "sale_consumption",
    quantity: -20,
    unit: "each",
    reason: "POS consumption",
    referenceType: "sale",
    referenceId: "sale_batch",
    actorName: "System",
    createdAt: "2026-07-12T12:00:00.000Z",
  }),
  movement({
    id: "mvt_11",
    branchId: "br_ml",
    branchCode: "ML",
    productId: "prd_1008",
    sku: "BKY-MUF-BL",
    productName: "Blueberry Muffin",
    type: "receipt",
    quantity: 15,
    unit: "each",
    reason: "Goods receipt PO-2212",
    referenceType: "goods_receipt",
    referenceId: "gr_2212",
    actorName: "Alex Morgan",
    createdAt: "2026-07-11T07:00:00.000Z",
  }),
  movement({
    id: "mvt_12",
    branchId: "br_ml",
    branchCode: "ML",
    productId: "prd_1008",
    sku: "BKY-MUF-BL",
    productName: "Blueberry Muffin",
    type: "sale_consumption",
    quantity: -14,
    unit: "each",
    reason: "Completed sales",
    referenceType: "sale",
    referenceId: "sale_ml",
    actorName: "System",
    createdAt: "2026-07-12T13:00:00.000Z",
  }),
  movement({
    id: "mvt_13",
    branchId: "br_dt",
    branchCode: "DT",
    productId: "prd_1001",
    sku: "BEV-ESP-01",
    productName: "Espresso",
    type: "receipt",
    quantity: 50,
    unit: "each",
    reason: "Goods receipt PO-2205",
    referenceType: "goods_receipt",
    referenceId: "gr_2205",
    actorName: "Alex Morgan",
    createdAt: "2026-07-10T09:00:00.000Z",
  }),
];

const REORDER_POINTS: Record<string, number> = {
  prd_1001: 20,
  prd_1002: 15,
  prd_1003: 10,
  prd_1004: 8,
  prd_1008: 5,
};

function projectBalances(): StockBalance[] {
  const byKey = new Map<string, StockBalance>();

  for (const m of movements) {
    const key = `${m.branchId}:${m.productId}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.onHand += m.quantity;
      if (m.createdAt > existing.updatedAt) {
        existing.updatedAt = m.createdAt;
      }
    } else {
      byKey.set(key, {
        id: key,
        organizationId: m.organizationId,
        branchId: m.branchId,
        branchCode: m.branchCode,
        productId: m.productId,
        sku: m.sku,
        productName: m.productName,
        unit: m.unit,
        onHand: m.quantity,
        reorderPoint: REORDER_POINTS[m.productId] ?? 5,
        trackInventory: true,
        updatedAt: m.createdAt,
      });
    }
  }

  return Array.from(byKey.values()).sort((a, b) =>
    a.productName.localeCompare(b.productName),
  );
}

export async function listStockBalances(): Promise<StockBalance[]> {
  await delay();
  const products = await listProducts();
  const tracked = new Set(
    products.filter((p) => p.trackInventory).map((p) => p.id),
  );
  return projectBalances()
    .filter((balance) => tracked.has(balance.productId))
    .map((balance) => ({ ...balance }));
}

export async function getStockBalance(
  balanceId: string,
): Promise<StockBalance | null> {
  await delay(100);
  return projectBalances().find((balance) => balance.id === balanceId) ?? null;
}

export async function listMovements(filters?: {
  productId?: string;
  branchId?: string;
}): Promise<StockMovement[]> {
  await delay(120);
  return movements
    .filter((m) => {
      if (filters?.productId && m.productId !== filters.productId) return false;
      if (filters?.branchId && m.branchId !== filters.branchId) return false;
      return true;
    })
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((m) => ({ ...m }));
}

export type CreateAdjustmentInput = {
  organizationId: string;
  branchId: string;
  productId: string;
  quantity: number;
  reason: string;
  notes?: string;
  actorName: string;
};

export async function createAdjustment(
  input: CreateAdjustmentInput,
): Promise<StockMovement> {
  await delay();
  const products = await listProducts();
  const product = products.find((p) => p.id === input.productId);
  if (!product) throw new Error("Product not found");
  if (!product.trackInventory) {
    throw new Error("Product does not track inventory");
  }
  if (!product.branchIds.includes(input.branchId)) {
    throw new Error("Product is not available at this branch");
  }

  const branchCode = BRANCH_CODES[input.branchId] ?? "HQ";
  const reason =
    input.reason === "Other" && input.notes?.trim()
      ? `Other: ${input.notes.trim()}`
      : input.notes?.trim()
        ? `${input.reason} — ${input.notes.trim()}`
        : input.reason;

  const next = movement({
    branchId: input.branchId,
    branchCode,
    productId: product.id,
    sku: product.sku,
    productName: product.name,
    type: "adjustment" satisfies MovementType,
    quantity: input.quantity,
    unit: product.baseUnit,
    reason,
    actorName: input.actorName,
    createdAt: new Date().toISOString(),
  });

  movements = [next, ...movements];
  return { ...next };
}

export type AppendMovementInput = {
  organizationId?: string;
  branchId: string;
  productId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  referenceType?: string;
  referenceId?: string;
  actorName: string;
};

/**
 * Append an immutable Stock Movement. Used by Goods Receipt, Transfers, Counts, Sales.
 * Never edits a balance record.
 */
export async function appendStockMovement(
  input: AppendMovementInput,
): Promise<StockMovement> {
  await delay(80);
  const products = await listProducts();
  const product = products.find((p) => p.id === input.productId);
  if (!product) throw new Error("Product not found");
  if (!product.trackInventory) {
    throw new Error("Product does not track inventory");
  }

  const next = movement({
    organizationId: input.organizationId,
    branchId: input.branchId,
    branchCode: BRANCH_CODES[input.branchId] ?? "HQ",
    productId: product.id,
    sku: product.sku,
    productName: product.name,
    type: input.type,
    quantity: input.quantity,
    unit: product.baseUnit,
    reason: input.reason,
    referenceType: input.referenceType,
    referenceId: input.referenceId,
    actorName: input.actorName,
    createdAt: new Date().toISOString(),
  });

  movements = [next, ...movements];
  return { ...next };
}

export async function listAdjustableProducts(branchId: string) {
  await delay(80);
  const products = await listProducts();
  return products.filter(
    (product) =>
      product.trackInventory &&
      product.status === "active" &&
      product.branchIds.includes(branchId),
  );
}

export type StockCountStatus = "draft" | "submitted" | "approved";

export type StockCount = {
  id: string;
  organizationId: string;
  branchId: string;
  branchCode: string;
  countNumber: string;
  status: StockCountStatus;
  items: Array<{
    productId: string;
    productName: string;
    expectedQty: number;
    countedQty: number;
    unit: string;
  }>;
  createdAt: string;
  approvedAt?: string;
};

let countSeq = 40;
let stockCounts: StockCount[] = [
  {
    id: "cnt_1",
    organizationId: "org_demo",
    branchId: "br_hq",
    branchCode: "HQ",
    countNumber: "SC-040",
    status: "draft",
    items: [
      {
        productId: "prd_1004",
        productName: "Whole Milk 1L",
        expectedQty: 4,
        countedQty: 4,
        unit: "each",
      },
    ],
    createdAt: "2026-07-12T15:00:00.000Z",
  },
];

export async function listStockCounts(): Promise<StockCount[]> {
  await delay(120);
  return stockCounts.map((c) => ({
    ...c,
    items: c.items.map((i) => ({ ...i })),
  }));
}

export async function createStockCount(input: {
  organizationId: string;
  branchId: string;
  items: Array<{ productId: string; countedQty: number }>;
}): Promise<StockCount> {
  await delay();
  const balances = projectBalances().filter((b) => b.branchId === input.branchId);
  const products = await listProducts();
  const items = input.items.map((line) => {
    const product = products.find((p) => p.id === line.productId);
    if (!product) throw new Error("Product not found");
    const balance = balances.find((b) => b.productId === line.productId);
    return {
      productId: product.id,
      productName: product.name,
      expectedQty: balance?.onHand ?? 0,
      countedQty: line.countedQty,
      unit: product.baseUnit,
    };
  });
  countSeq += 1;
  const count: StockCount = {
    id: `cnt_${Date.now()}`,
    organizationId: input.organizationId,
    branchId: input.branchId,
    branchCode: BRANCH_CODES[input.branchId] ?? "HQ",
    countNumber: `SC-${countSeq}`,
    status: "submitted",
    items,
    createdAt: new Date().toISOString(),
  };
  stockCounts = [count, ...stockCounts];
  return { ...count, items: items.map((i) => ({ ...i })) };
}

export async function approveStockCount(
  id: string,
  actorName: string,
): Promise<StockCount> {
  await delay();
  const index = stockCounts.findIndex((c) => c.id === id);
  if (index < 0) throw new Error("Count not found");
  const count = stockCounts[index]!;
  if (count.status === "approved") return { ...count };
  for (const item of count.items) {
    const variance = item.countedQty - item.expectedQty;
    if (variance === 0) continue;
    await appendStockMovement({
      organizationId: count.organizationId,
      branchId: count.branchId,
      productId: item.productId,
      type: "count_reconciliation",
      quantity: variance,
      reason: `Count ${count.countNumber} reconciliation`,
      referenceType: "stock_count",
      referenceId: count.id,
      actorName,
    });
  }
  const next = {
    ...count,
    status: "approved" as const,
    approvedAt: new Date().toISOString(),
  };
  stockCounts = [
    ...stockCounts.slice(0, index),
    next,
    ...stockCounts.slice(index + 1),
  ];
  return { ...next, items: next.items.map((i) => ({ ...i })) };
}
