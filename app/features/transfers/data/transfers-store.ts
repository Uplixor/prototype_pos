import { appendStockMovement } from "~/features/inventory/data/inventory-store";
import { listProducts } from "~/features/catalog/data/catalog-store";

export type TransferStatus = "pending" | "completed" | "cancelled";

export type StockTransfer = {
  id: string;
  organizationId: string;
  transferNumber: string;
  originBranchId: string;
  originCode: string;
  destinationBranchId: string;
  destinationCode: string;
  status: TransferStatus;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
  }>;
  createdAt: string;
  completedAt?: string;
};

const CODES: Record<string, string> = {
  br_hq: "HQ",
  br_dt: "DT",
  br_ml: "ML",
};

let seq = 100;
let transfers: StockTransfer[] = [
  {
    id: "tr_101",
    organizationId: "org_demo",
    transferNumber: "TR-101",
    originBranchId: "br_hq",
    originCode: "HQ",
    destinationBranchId: "br_dt",
    destinationCode: "DT",
    status: "completed",
    items: [
      {
        productId: "prd_1002",
        productName: "Latte 12oz",
        quantity: 24,
        unit: "each",
      },
    ],
    createdAt: "2026-07-11T13:00:00.000Z",
    completedAt: "2026-07-11T14:00:00.000Z",
  },
];

function delay(ms = 200) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function listTransfers(): Promise<StockTransfer[]> {
  await delay();
  return transfers.map((t) => ({
    ...t,
    items: t.items.map((i) => ({ ...i })),
  }));
}

export async function createTransfer(input: {
  organizationId: string;
  originBranchId: string;
  destinationBranchId: string;
  items: Array<{ productId: string; quantity: number }>;
  actorName: string;
}): Promise<StockTransfer> {
  await delay();
  if (input.originBranchId === input.destinationBranchId) {
    throw new Error("Origin and destination must differ");
  }
  const products = await listProducts();
  const items = input.items.map((line) => {
    const product = products.find((p) => p.id === line.productId);
    if (!product) throw new Error("Product not found");
    return {
      productId: product.id,
      productName: product.name,
      quantity: line.quantity,
      unit: product.baseUnit,
    };
  });
  seq += 1;
  const transfer: StockTransfer = {
    id: `tr_${Date.now()}`,
    organizationId: input.organizationId,
    transferNumber: `TR-${seq}`,
    originBranchId: input.originBranchId,
    originCode: CODES[input.originBranchId] ?? "HQ",
    destinationBranchId: input.destinationBranchId,
    destinationCode: CODES[input.destinationBranchId] ?? "DT",
    status: "pending",
    items,
    createdAt: new Date().toISOString(),
  };
  transfers = [transfer, ...transfers];
  return { ...transfer, items: items.map((i) => ({ ...i })) };
}

export async function completeTransfer(
  id: string,
  actorName: string,
): Promise<StockTransfer> {
  await delay();
  const index = transfers.findIndex((t) => t.id === id);
  if (index < 0) throw new Error("Transfer not found");
  const transfer = transfers[index]!;
  if (transfer.status !== "pending") {
    throw new Error("Only pending transfers can be completed");
  }
  for (const item of transfer.items) {
    await appendStockMovement({
      organizationId: transfer.organizationId,
      branchId: transfer.originBranchId,
      productId: item.productId,
      type: "transfer_out",
      quantity: -item.quantity,
      reason: `Transfer ${transfer.transferNumber} to ${transfer.destinationCode}`,
      referenceType: "transfer",
      referenceId: transfer.id,
      actorName,
    });
    await appendStockMovement({
      organizationId: transfer.organizationId,
      branchId: transfer.destinationBranchId,
      productId: item.productId,
      type: "transfer_in",
      quantity: item.quantity,
      reason: `Transfer ${transfer.transferNumber} from ${transfer.originCode}`,
      referenceType: "transfer",
      referenceId: transfer.id,
      actorName,
    });
  }
  const next = {
    ...transfer,
    status: "completed" as const,
    completedAt: new Date().toISOString(),
  };
  transfers = [...transfers.slice(0, index), next, ...transfers.slice(index + 1)];
  return { ...next, items: next.items.map((i) => ({ ...i })) };
}
