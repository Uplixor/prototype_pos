import type { Category, Product } from "~/features/catalog/types";

export const CATALOG_CATEGORIES: Category[] = [
  { id: "cat_beverages", name: "Beverages" },
  { id: "cat_bakery", name: "Bakery" },
  { id: "cat_grocery", name: "Grocery" },
  { id: "cat_services", name: "Services" },
  { id: "cat_pharmacy", name: "Pharmacy OTC" },
];

export const TAX_PROFILES = [
  "Standard (8%)",
  "Reduced (5%)",
  "Zero-rated",
  "Exempt",
] as const;

export const UNITS = ["each", "kg", "g", "L", "mL", "box", "pack", "hour"] as const;

export const BRANCH_OPTIONS = [
  { id: "br_hq", name: "Headquarters", code: "HQ" },
  { id: "br_dt", name: "Downtown", code: "DT" },
  { id: "br_ml", name: "Mall Kiosk", code: "ML" },
] as const;

const now = "2026-07-12T10:00:00.000Z";

function categoryName(id: string): string {
  return CATALOG_CATEGORIES.find((c) => c.id === id)?.name ?? "Uncategorized";
}

/** In-memory catalog projection for local development until API exists. */
let products: Product[] = [
  {
    id: "prd_1001",
    organizationId: "org_demo",
    sku: "BEV-ESP-01",
    name: "Espresso",
    description: "Single shot espresso",
    categoryId: "cat_beverages",
    categoryName: categoryName("cat_beverages"),
    productType: "physical",
    status: "active",
    baseUnit: "each",
    price: 3.5,
    cost: 0.85,
    taxProfile: "Standard (8%)",
    trackInventory: true,
    branchIds: ["br_hq", "br_dt", "br_ml"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prd_1002",
    organizationId: "org_demo",
    sku: "BEV-LAT-12",
    name: "Latte 12oz",
    description: "Espresso with steamed milk",
    categoryId: "cat_beverages",
    categoryName: categoryName("cat_beverages"),
    productType: "physical",
    status: "active",
    baseUnit: "each",
    price: 4.75,
    cost: 1.1,
    taxProfile: "Standard (8%)",
    trackInventory: true,
    branchIds: ["br_hq", "br_dt"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prd_1003",
    organizationId: "org_demo",
    sku: "BKY-CRO-01",
    name: "Butter Croissant",
    description: "Fresh baked croissant",
    categoryId: "cat_bakery",
    categoryName: categoryName("cat_bakery"),
    productType: "physical",
    status: "active",
    baseUnit: "each",
    price: 3.25,
    cost: 0.95,
    taxProfile: "Reduced (5%)",
    trackInventory: true,
    branchIds: ["br_hq", "br_dt", "br_ml"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prd_1004",
    organizationId: "org_demo",
    sku: "GRC-MLK-1L",
    name: "Whole Milk 1L",
    description: "Refrigerated dairy",
    categoryId: "cat_grocery",
    categoryName: categoryName("cat_grocery"),
    productType: "physical",
    status: "active",
    baseUnit: "each",
    price: 2.49,
    cost: 1.6,
    taxProfile: "Zero-rated",
    trackInventory: true,
    branchIds: ["br_hq"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prd_1005",
    organizationId: "org_demo",
    sku: "SVC-CAT-01",
    name: "Catering Setup",
    description: "On-site catering setup fee",
    categoryId: "cat_services",
    categoryName: categoryName("cat_services"),
    productType: "service",
    status: "active",
    baseUnit: "hour",
    price: 75,
    cost: 0,
    taxProfile: "Standard (8%)",
    trackInventory: false,
    branchIds: ["br_hq", "br_dt"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prd_1006",
    organizationId: "org_demo",
    sku: "PHM-IBU-200",
    name: "Ibuprofen 200mg",
    description: "OTC pain relief, 24 ct",
    categoryId: "cat_pharmacy",
    categoryName: categoryName("cat_pharmacy"),
    productType: "physical",
    status: "draft",
    baseUnit: "box",
    price: 6.99,
    cost: 2.4,
    taxProfile: "Exempt",
    trackInventory: true,
    branchIds: ["br_hq"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prd_1007",
    organizationId: "org_demo",
    sku: "BEV-TEA-CH",
    name: "Chai Latte",
    description: "Spiced chai with milk",
    categoryId: "cat_beverages",
    categoryName: categoryName("cat_beverages"),
    productType: "physical",
    status: "archived",
    baseUnit: "each",
    price: 4.5,
    cost: 1.05,
    taxProfile: "Standard (8%)",
    trackInventory: true,
    branchIds: ["br_dt"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prd_1008",
    organizationId: "org_demo",
    sku: "BKY-MUF-BL",
    name: "Blueberry Muffin",
    description: "Bakery muffin",
    categoryId: "cat_bakery",
    categoryName: categoryName("cat_bakery"),
    productType: "physical",
    status: "active",
    baseUnit: "each",
    price: 2.95,
    cost: 0.8,
    taxProfile: "Reduced (5%)",
    trackInventory: true,
    branchIds: ["br_hq", "br_ml"],
    createdAt: now,
    updatedAt: now,
  },
];

function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function listProducts(): Promise<Product[]> {
  await delay();
  return products.map((p) => ({ ...p }));
}

export async function getProduct(id: string): Promise<Product | null> {
  await delay(120);
  const product = products.find((p) => p.id === id);
  return product ? { ...product } : null;
}

export async function createProduct(
  input: Omit<Product, "id" | "createdAt" | "updatedAt" | "categoryName" | "organizationId"> & {
    organizationId?: string;
  },
): Promise<Product> {
  await delay();
  const timestamp = new Date().toISOString();
  const product: Product = {
    ...input,
    id: `prd_${Date.now()}`,
    organizationId: input.organizationId ?? "org_demo",
    categoryName: categoryName(input.categoryId),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  products = [product, ...products];
  return { ...product };
}

export async function updateProduct(
  id: string,
  input: Partial<Omit<Product, "id" | "organizationId" | "createdAt">>,
): Promise<Product> {
  await delay();
  const index = products.findIndex((p) => p.id === id);
  if (index < 0) {
    throw new Error("Product not found");
  }
  const current = products[index]!;
  const next: Product = {
    ...current,
    ...input,
    categoryName: input.categoryId
      ? categoryName(input.categoryId)
      : current.categoryName,
    updatedAt: new Date().toISOString(),
  };
  products = [
    ...products.slice(0, index),
    next,
    ...products.slice(index + 1),
  ];
  return { ...next };
}

export async function archiveProducts(ids: string[]): Promise<void> {
  await delay();
  const idSet = new Set(ids);
  products = products.map((product) =>
    idSet.has(product.id)
      ? {
          ...product,
          status: "archived" as const,
          updatedAt: new Date().toISOString(),
        }
      : product,
  );
}

export async function listCategories(): Promise<Category[]> {
  await delay(80);
  return [...CATALOG_CATEGORIES];
}

let mutableCategories = [...CATALOG_CATEGORIES];
let mutableUnits: string[] = [...UNITS];

export async function createCategory(name: string): Promise<Category> {
  await delay(100);
  if (mutableCategories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("Category name must be unique");
  }
  const category = { id: `cat_${Date.now()}`, name };
  mutableCategories = [...mutableCategories, category];
  return category;
}

export async function listCategoriesMutable(): Promise<Category[]> {
  await delay(60);
  return [...mutableCategories];
}

export async function listUnitsMutable(): Promise<string[]> {
  await delay(60);
  return [...mutableUnits];
}

export async function addUnit(unit: string): Promise<string[]> {
  await delay(100);
  const next = unit.trim().toLowerCase();
  if (!next) throw new Error("Unit is required");
  if (mutableUnits.includes(next)) throw new Error("Unit already exists");
  mutableUnits = [...mutableUnits, next];
  return [...mutableUnits];
}
