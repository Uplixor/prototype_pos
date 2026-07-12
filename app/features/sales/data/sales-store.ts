import { listProducts } from "~/features/catalog/data/catalog-store";
import type { Product } from "~/features/catalog/types";
import {
  computeSaleTotals,
  round2,
  saleRefundableAmount,
  type PaymentMethod,
  type Sale,
  type SaleItem,
  type SalePayment,
  type SaleRefund,
} from "~/features/sales/types";

const BRANCHES = {
  br_hq: "HQ",
  br_dt: "DT",
  br_ml: "ML",
} as const;

function taxRateFromProfile(profile: string): number {
  if (profile.startsWith("Standard")) return 0.08;
  if (profile.startsWith("Reduced")) return 0.05;
  return 0;
}

function delay(ms = 260): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function lineFromProduct(
  product: Product,
  quantity: number,
): Omit<SaleItem, "id"> {
  const taxRate = taxRateFromProfile(product.taxProfile);
  const unitPrice = product.price;
  return {
    productId: product.id,
    sku: product.sku,
    name: product.name,
    unitPrice,
    quantity,
    taxRate,
    lineTotal: round2(unitPrice * quantity * (1 + taxRate)),
  };
}

function withTotals(sale: Sale): Sale {
  const totals = computeSaleTotals(sale.items);
  const amountPaid = round2(
    sale.payments.reduce((sum, payment) => sum + payment.amount, 0),
  );
  return { ...sale, ...totals, amountPaid };
}

let saleSeq = 10490;

const seededAt = "2026-07-12T09:30:00.000Z";

let sales: Sale[] = [
  withTotals({
    id: "sale_1",
    organizationId: "org_demo",
    branchId: "br_hq",
    branchCode: "HQ",
    saleNumber: "SO-10482",
    status: "completed",
    customerName: "Walk-in",
    items: [
      {
        id: "si_1",
        productId: "prd_1001",
        sku: "BEV-ESP-01",
        name: "Espresso",
        unitPrice: 3.5,
        quantity: 2,
        taxRate: 0.08,
        lineTotal: 7.56,
      },
      {
        id: "si_2",
        productId: "prd_1003",
        sku: "BKY-CRO-01",
        name: "Butter Croissant",
        unitPrice: 3.25,
        quantity: 1,
        taxRate: 0.05,
        lineTotal: 3.41,
      },
    ],
    subtotal: 0,
    taxTotal: 0,
    total: 0,
    amountPaid: 0,
    payments: [
      {
        id: "pay_1",
        method: "card",
        amount: 10.97,
        recordedAt: seededAt,
        idempotencyKey: "idem_pay_1",
      },
    ],
    refunds: [],
    createdAt: seededAt,
    updatedAt: seededAt,
    completedAt: seededAt,
  }),
  withTotals({
    id: "sale_2",
    organizationId: "org_demo",
    branchId: "br_dt",
    branchCode: "DT",
    saleNumber: "SO-10481",
    status: "completed",
    customerName: "Acme Cafe",
    items: [
      {
        id: "si_3",
        productId: "prd_1002",
        sku: "BEV-LAT-12",
        name: "Latte 12oz",
        unitPrice: 4.75,
        quantity: 4,
        taxRate: 0.08,
        lineTotal: 20.52,
      },
      {
        id: "si_4",
        productId: "prd_1008",
        sku: "BKY-MUF-BL",
        name: "Blueberry Muffin",
        unitPrice: 2.95,
        quantity: 4,
        taxRate: 0.05,
        lineTotal: 12.39,
      },
    ],
    subtotal: 0,
    taxTotal: 0,
    total: 0,
    amountPaid: 0,
    payments: [
      {
        id: "pay_2",
        method: "cash",
        amount: 32.91,
        recordedAt: "2026-07-12T10:05:00.000Z",
        idempotencyKey: "idem_pay_2",
      },
    ],
    refunds: [],
    createdAt: "2026-07-12T10:00:00.000Z",
    updatedAt: "2026-07-12T10:05:00.000Z",
    completedAt: "2026-07-12T10:05:00.000Z",
  }),
  withTotals({
    id: "sale_3",
    organizationId: "org_demo",
    branchId: "br_hq",
    branchCode: "HQ",
    saleNumber: "SO-10480",
    status: "awaiting_payment",
    customerName: "Jordan Lee",
    items: [
      {
        id: "si_5",
        productId: "prd_1005",
        sku: "SVC-CAT-01",
        name: "Catering Setup",
        unitPrice: 75,
        quantity: 1,
        taxRate: 0.08,
        lineTotal: 81,
      },
    ],
    subtotal: 0,
    taxTotal: 0,
    total: 0,
    amountPaid: 0,
    payments: [],
    refunds: [],
    createdAt: "2026-07-12T11:20:00.000Z",
    updatedAt: "2026-07-12T11:22:00.000Z",
    notes: "Event setup for lobby",
  }),
  withTotals({
    id: "sale_4",
    organizationId: "org_demo",
    branchId: "br_ml",
    branchCode: "ML",
    saleNumber: "SO-10479",
    status: "refunded",
    customerName: "Walk-in",
    items: [
      {
        id: "si_6",
        productId: "prd_1004",
        sku: "GRC-MLK-1L",
        name: "Whole Milk 1L",
        unitPrice: 2.49,
        quantity: 1,
        taxRate: 0,
        lineTotal: 2.49,
      },
    ],
    subtotal: 0,
    taxTotal: 0,
    total: 0,
    amountPaid: 0,
    payments: [
      {
        id: "pay_3",
        method: "card",
        amount: 2.49,
        recordedAt: "2026-07-12T08:15:00.000Z",
        idempotencyKey: "idem_pay_3",
      },
    ],
    refunds: [
      {
        id: "rfd_1",
        amount: 2.49,
        reason: "Customer changed mind — unopened product returned",
        recordedAt: "2026-07-12T08:40:00.000Z",
      },
    ],
    createdAt: "2026-07-12T08:10:00.000Z",
    updatedAt: "2026-07-12T08:40:00.000Z",
    completedAt: "2026-07-12T08:15:00.000Z",
  }),
  withTotals({
    id: "sale_5",
    organizationId: "org_demo",
    branchId: "br_hq",
    branchCode: "HQ",
    saleNumber: "SO-10478",
    status: "open",
    customerName: "Northwind Staff",
    items: [
      {
        id: "si_7",
        productId: "prd_1001",
        sku: "BEV-ESP-01",
        name: "Espresso",
        unitPrice: 3.5,
        quantity: 6,
        taxRate: 0.08,
        lineTotal: 22.68,
      },
      {
        id: "si_8",
        productId: "prd_1002",
        sku: "BEV-LAT-12",
        name: "Latte 12oz",
        unitPrice: 4.75,
        quantity: 4,
        taxRate: 0.08,
        lineTotal: 20.52,
      },
    ],
    subtotal: 0,
    taxTotal: 0,
    total: 0,
    amountPaid: 0,
    payments: [],
    refunds: [],
    createdAt: "2026-07-12T12:00:00.000Z",
    updatedAt: "2026-07-12T12:10:00.000Z",
  }),
  withTotals({
    id: "sale_6",
    organizationId: "org_demo",
    branchId: "br_dt",
    branchCode: "DT",
    saleNumber: "SO-10477",
    status: "cancelled",
    customerName: "Walk-in",
    items: [
      {
        id: "si_9",
        productId: "prd_1003",
        sku: "BKY-CRO-01",
        name: "Butter Croissant",
        unitPrice: 3.25,
        quantity: 2,
        taxRate: 0.05,
        lineTotal: 6.83,
      },
    ],
    subtotal: 0,
    taxTotal: 0,
    total: 0,
    amountPaid: 0,
    payments: [],
    refunds: [],
    createdAt: "2026-07-12T07:45:00.000Z",
    updatedAt: "2026-07-12T07:50:00.000Z",
    cancelledAt: "2026-07-12T07:50:00.000Z",
  }),
];

function replaceSale(next: Sale) {
  const index = sales.findIndex((sale) => sale.id === next.id);
  if (index < 0) throw new Error("Sale not found");
  sales = [...sales.slice(0, index), next, ...sales.slice(index + 1)];
  return {
    ...next,
    items: next.items.map((item) => ({ ...item })),
    payments: next.payments.map((payment) => ({ ...payment })),
    refunds: next.refunds.map((refund) => ({ ...refund })),
  };
}

export async function listSales(): Promise<Sale[]> {
  await delay();
  return sales.map((sale) => ({
    ...sale,
    items: sale.items.map((item) => ({ ...item })),
    payments: sale.payments.map((payment) => ({ ...payment })),
    refunds: sale.refunds.map((refund) => ({ ...refund })),
  }));
}

export async function getSale(id: string): Promise<Sale | null> {
  await delay(100);
  const sale = sales.find((item) => item.id === id);
  if (!sale) return null;
  return {
    ...sale,
    items: sale.items.map((item) => ({ ...item })),
    payments: sale.payments.map((payment) => ({ ...payment })),
    refunds: sale.refunds.map((refund) => ({ ...refund })),
  };
}

export type CreateSaleInput = {
  organizationId: string;
  branchId: string;
  customerName: string;
  notes?: string;
  items: Array<{ productId: string; quantity: number }>;
};

export async function createSale(input: CreateSaleInput): Promise<Sale> {
  await delay();
  const products = await listProducts();
  const active = products.filter(
    (product) =>
      product.status === "active" &&
      product.branchIds.includes(input.branchId),
  );

  const items: SaleItem[] = input.items.map((line, index) => {
    const product = active.find((item) => item.id === line.productId);
    if (!product) {
      throw new Error("Product is not sellable at this branch");
    }
    return {
      id: `si_new_${Date.now()}_${index}`,
      ...lineFromProduct(product, line.quantity),
    };
  });

  saleSeq += 1;
  const timestamp = new Date().toISOString();
  const branchCode =
    BRANCHES[input.branchId as keyof typeof BRANCHES] ?? "HQ";

  const sale = withTotals({
    id: `sale_${Date.now()}`,
    organizationId: input.organizationId,
    branchId: input.branchId,
    branchCode,
    saleNumber: `SO-${saleSeq}`,
    status: "open",
    customerName: input.customerName,
    items,
    subtotal: 0,
    taxTotal: 0,
    total: 0,
    amountPaid: 0,
    payments: [],
    refunds: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    notes: input.notes,
  });

  sales = [sale, ...sales];
  return getSale(sale.id) as Promise<Sale>;
}

export async function addSaleItem(
  saleId: string,
  productId: string,
  quantity: number,
): Promise<Sale> {
  await delay(150);
  const sale = sales.find((item) => item.id === saleId);
  if (!sale) throw new Error("Sale not found");
  if (sale.status !== "open") {
    throw new Error("Only open sales can be amended");
  }

  const products = await listProducts();
  const product = products.find(
    (item) =>
      item.id === productId &&
      item.status === "active" &&
      item.branchIds.includes(sale.branchId),
  );
  if (!product) {
    throw new Error("Product is not sellable at this branch");
  }

  const existing = sale.items.find((item) => item.productId === productId);
  let items: SaleItem[];
  if (existing) {
    items = sale.items.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: item.quantity + quantity,
            lineTotal: round2(
              item.unitPrice * (item.quantity + quantity) * (1 + item.taxRate),
            ),
          }
        : item,
    );
  } else {
    items = [
      ...sale.items,
      {
        id: `si_${Date.now()}`,
        ...lineFromProduct(product, quantity),
      },
    ];
  }

  return replaceSale(
    withTotals({
      ...sale,
      items,
      updatedAt: new Date().toISOString(),
    }),
  );
}

export async function removeSaleItem(
  saleId: string,
  itemId: string,
): Promise<Sale> {
  await delay(120);
  const sale = sales.find((item) => item.id === saleId);
  if (!sale) throw new Error("Sale not found");
  if (sale.status !== "open") {
    throw new Error("Only open sales can be amended");
  }
  const items = sale.items.filter((item) => item.id !== itemId);
  if (items.length === 0) {
    throw new Error("Sale must retain at least one item");
  }
  return replaceSale(
    withTotals({
      ...sale,
      items,
      updatedAt: new Date().toISOString(),
    }),
  );
}

export async function requestPayment(saleId: string): Promise<Sale> {
  await delay(120);
  const sale = sales.find((item) => item.id === saleId);
  if (!sale) throw new Error("Sale not found");
  if (sale.status !== "open") {
    throw new Error("Only open sales can move to awaiting payment");
  }
  if (sale.items.length === 0) {
    throw new Error("Add items before requesting payment");
  }
  return replaceSale(
    withTotals({
      ...sale,
      status: "awaiting_payment",
      updatedAt: new Date().toISOString(),
    }),
  );
}

export async function recordPayment(
  saleId: string,
  input: {
    method: PaymentMethod;
    amount: number;
    idempotencyKey: string;
  },
): Promise<Sale> {
  await delay();
  const sale = sales.find((item) => item.id === saleId);
  if (!sale) throw new Error("Sale not found");
  if (sale.status !== "awaiting_payment" && sale.status !== "open") {
    throw new Error("Sale is not eligible for payment");
  }

  const existing = sale.payments.find(
    (payment) => payment.idempotencyKey === input.idempotencyKey,
  );
  if (existing) {
    return { ...sale };
  }

  const remaining = round2(sale.total - sale.amountPaid);
  if (input.amount > remaining + 0.001) {
    throw new Error("Payment exceeds amount due");
  }

  const payment: SalePayment = {
    id: `pay_${Date.now()}`,
    method: input.method,
    amount: round2(input.amount),
    recordedAt: new Date().toISOString(),
    idempotencyKey: input.idempotencyKey,
  };

  const next = withTotals({
    ...sale,
    status: "awaiting_payment",
    payments: [...sale.payments, payment],
    updatedAt: new Date().toISOString(),
  });

  if (next.amountPaid >= next.total - 0.001) {
    next.status = "completed";
    next.completedAt = new Date().toISOString();
  }

  return replaceSale(next);
}

export async function cancelSale(saleId: string): Promise<Sale> {
  await delay(150);
  const sale = sales.find((item) => item.id === saleId);
  if (!sale) throw new Error("Sale not found");
  if (sale.status === "completed" || sale.status === "refunded") {
    throw new Error("Completed sales cannot be cancelled — use a refund");
  }
  if (sale.status === "cancelled") {
    return { ...sale };
  }
  return replaceSale({
    ...sale,
    status: "cancelled",
    cancelledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function refundSale(
  saleId: string,
  amount: number,
  reason: string,
): Promise<Sale> {
  await delay(180);
  const sale = sales.find((item) => item.id === saleId);
  if (!sale) throw new Error("Sale not found");
  if (sale.status !== "completed") {
    throw new Error("Only completed sales can be refunded");
  }
  if (sale.payments.length === 0) {
    throw new Error("Sale has no payments to refund");
  }
  if (!reason.trim()) {
    throw new Error("A refund reason is required");
  }

  const refundable = saleRefundableAmount(sale);
  if (amount <= 0) {
    throw new Error("Refund amount must be greater than zero");
  }
  if (amount > refundable + 0.001) {
    throw new Error("Refund exceeds amount available to refund");
  }

  const refund: SaleRefund = {
    id: `rfd_${Date.now()}`,
    amount: round2(amount),
    reason: reason.trim(),
    recordedAt: new Date().toISOString(),
  };

  const refunds = [...sale.refunds, refund];
  const totalRefunded = round2(
    refunds.reduce((sum, item) => sum + item.amount, 0),
  );

  return replaceSale(
    withTotals({
      ...sale,
      refunds,
      status:
        totalRefunded >= sale.amountPaid - 0.001 ? "refunded" : sale.status,
      updatedAt: new Date().toISOString(),
    }),
  );
}

export async function listSellableProducts(branchId: string): Promise<Product[]> {
  await delay(80);
  const products = await listProducts();
  return products.filter(
    (product) =>
      product.status === "active" && product.branchIds.includes(branchId),
  );
}
