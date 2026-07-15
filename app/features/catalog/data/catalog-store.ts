import type {
  Category,
  ModifierGroup,
  Product,
  ProductOptionAxis,
  ProductVariant,
} from "~/features/catalog/types";
import { categoryPath } from "~/features/catalog/utils/category-tree";

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

let mutableCategories: Category[] = [
  {
    id: "cat_beverages",
    name: "Beverages",
    parentId: null,
    status: "active",
    sortOrder: 10,
  },
  {
    id: "cat_coffee",
    name: "Coffee",
    parentId: "cat_beverages",
    status: "active",
    sortOrder: 11,
  },
  {
    id: "cat_bakery",
    name: "Bakery",
    parentId: null,
    status: "active",
    sortOrder: 20,
  },
  {
    id: "cat_grocery",
    name: "Grocery",
    parentId: null,
    status: "active",
    sortOrder: 30,
  },
  {
    id: "cat_services",
    name: "Services",
    parentId: null,
    status: "active",
    sortOrder: 40,
  },
  {
    id: "cat_pharmacy",
    name: "Pharmacy OTC",
    parentId: null,
    status: "active",
    sortOrder: 50,
  },
  {
    id: "cat_electronics",
    name: "Electronics",
    parentId: null,
    status: "active",
    sortOrder: 60,
  },
  {
    id: "cat_wearables",
    name: "Wearables",
    parentId: "cat_electronics",
    status: "active",
    sortOrder: 61,
  },
];

/** @deprecated Prefer listCategoriesMutable — kept for existing imports. */
export const CATALOG_CATEGORIES: Category[] = mutableCategories;

function resolveCategoryName(categoryId: string): string {
  return categoryPath(mutableCategories, categoryId);
}

function emptyCatalogParts(): Pick<
  Product,
  "optionAxes" | "variants" | "modifiers" | "brand" | "barcode"
> {
  return {
    optionAxes: [],
    variants: [],
    modifiers: [],
  };
}

const latteAxes: ProductOptionAxis[] = [
  {
    id: "axis_latte_size",
    name: "Size",
    values: ["8oz", "12oz", "16oz"],
  },
];

const latteVariants: ProductVariant[] = [
  {
    id: "var_latte_8",
    name: "8oz",
    sku: "BEV-LAT-08",
    skuSuffix: "-08",
    barcode: "2001001008001",
    optionValues: { axis_latte_size: "8oz" },
    price: 4.25,
    cost: 0.95,
    status: "active",
  },
  {
    id: "var_latte_12",
    name: "12oz",
    sku: "BEV-LAT-12",
    skuSuffix: "-12",
    barcode: "2001001012001",
    optionValues: { axis_latte_size: "12oz" },
    price: 4.75,
    cost: 1.1,
    status: "active",
  },
  {
    id: "var_latte_16",
    name: "16oz",
    sku: "BEV-LAT-16",
    skuSuffix: "-16",
    barcode: "2001001016001",
    optionValues: { axis_latte_size: "16oz" },
    price: 5.25,
    cost: 1.25,
    status: "active",
  },
];

const watchAxes: ProductOptionAxis[] = [
  {
    id: "axis_watch_color",
    name: "Color",
    values: ["Midnight", "Silver"],
  },
  {
    id: "axis_watch_size",
    name: "Size",
    values: ["42mm", "46mm"],
  },
];

const watchVariants: ProductVariant[] = [
  {
    id: "var_watch_blk_42",
    name: "Midnight / 42mm",
    sku: "PRD-8903-B-BLK-42",
    skuSuffix: "-BLK-42",
    barcode: "890342001",
    optionValues: {
      axis_watch_color: "Midnight",
      axis_watch_size: "42mm",
    },
    price: 450,
    cost: 210,
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
  },
  {
    id: "var_watch_blk_46",
    name: "Midnight / 46mm",
    sku: "PRD-8903-B-BLK-46",
    skuSuffix: "-BLK-46",
    barcode: "890346001",
    optionValues: {
      axis_watch_color: "Midnight",
      axis_watch_size: "46mm",
    },
    price: 480,
    cost: 225,
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&sat=-50",
  },
  {
    id: "var_watch_slv_42",
    name: "Silver / 42mm",
    sku: "PRD-8903-B-SLV-42",
    skuSuffix: "-SLV-42",
    barcode: "890342002",
    optionValues: {
      axis_watch_color: "Silver",
      axis_watch_size: "42mm",
    },
    price: 450,
    cost: 210,
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1434493789847-2f02dc269da5?w=200&h=200&fit=crop",
  },
  {
    id: "var_watch_slv_46",
    name: "Silver / 46mm",
    sku: "PRD-8903-B-SLV-46",
    skuSuffix: "-SLV-46",
    barcode: "890346002",
    optionValues: {
      axis_watch_color: "Silver",
      axis_watch_size: "46mm",
    },
    price: 480,
    cost: 225,
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1434493789847-2f02dc269da5?w=200&h=200&fit=crop",
  },
];

const watchModifiers: ModifierGroup[] = [
  {
    id: "mod_warranty",
    name: "Extended Warranty",
    required: false,
    multiSelect: false,
    options: [
      { id: "mod_w1", name: "1 Year Protection", priceDelta: 49 },
      { id: "mod_w2", name: "2 Year Protection", priceDelta: 79 },
    ],
  },
  {
    id: "mod_gift",
    name: "Gift Packaging",
    required: false,
    multiSelect: false,
    options: [
      { id: "mod_g1", name: "Premium Box w/ Ribbon", priceDelta: 15 },
    ],
  },
];

/** In-memory catalog projection for local development until API exists. */
let products: Product[] = [
  {
    id: "prd_1001",
    organizationId: "org_demo",
    sku: "BEV-ESP-01",
    barcode: "2001001001001",
    name: "Espresso",
    description: "Single shot espresso",
    brand: "House Roast",
    categoryId: "cat_coffee",
    categoryName: resolveCategoryName("cat_coffee"),
    productType: "physical",
    status: "active",
    baseUnit: "each",
    price: 3.5,
    cost: 0.85,
    taxProfile: "Standard (8%)",
    trackInventory: true,
    branchIds: ["br_hq", "br_dt", "br_ml"],
    imageUrl:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop",
    createdAt: now,
    updatedAt: now,
    ...emptyCatalogParts(),
  },
  {
    id: "prd_1002",
    organizationId: "org_demo",
    sku: "BEV-LAT",
    barcode: "2001001000002",
    name: "Latte",
    description: "Espresso with steamed milk",
    brand: "House Roast",
    categoryId: "cat_coffee",
    categoryName: resolveCategoryName("cat_coffee"),
    productType: "physical",
    status: "active",
    baseUnit: "each",
    price: 4.75,
    cost: 1.1,
    taxProfile: "Standard (8%)",
    trackInventory: true,
    branchIds: ["br_hq", "br_dt"],
    imageUrl:
      "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=400&fit=crop",
    optionAxes: latteAxes,
    variants: latteVariants,
    modifiers: [
      {
        id: "mod_milk",
        name: "Milk",
        required: false,
        multiSelect: false,
        options: [
          { id: "mod_m1", name: "Oat milk", priceDelta: 0.75 },
          { id: "mod_m2", name: "Almond milk", priceDelta: 0.75 },
        ],
      },
    ],
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
    categoryName: resolveCategoryName("cat_bakery"),
    productType: "physical",
    status: "active",
    baseUnit: "each",
    price: 3.25,
    cost: 0.95,
    taxProfile: "Reduced (5%)",
    trackInventory: true,
    branchIds: ["br_hq", "br_dt", "br_ml"],
    imageUrl:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop",
    createdAt: now,
    updatedAt: now,
    ...emptyCatalogParts(),
  },
  {
    id: "prd_1004",
    organizationId: "org_demo",
    sku: "GRC-MLK-1L",
    name: "Whole Milk 1L",
    description: "Refrigerated dairy",
    categoryId: "cat_grocery",
    categoryName: resolveCategoryName("cat_grocery"),
    productType: "physical",
    status: "active",
    baseUnit: "each",
    price: 2.49,
    cost: 1.6,
    taxProfile: "Zero-rated",
    trackInventory: true,
    branchIds: ["br_hq"],
    imageUrl:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
    createdAt: now,
    updatedAt: now,
    ...emptyCatalogParts(),
  },
  {
    id: "prd_1005",
    organizationId: "org_demo",
    sku: "SVC-CAT-01",
    name: "Catering Setup",
    description: "On-site catering setup fee",
    categoryId: "cat_services",
    categoryName: resolveCategoryName("cat_services"),
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
    ...emptyCatalogParts(),
  },
  {
    id: "prd_1006",
    organizationId: "org_demo",
    sku: "PHM-IBU-200",
    name: "Ibuprofen 200mg",
    description: "OTC pain relief, 24 ct",
    categoryId: "cat_pharmacy",
    categoryName: resolveCategoryName("cat_pharmacy"),
    productType: "physical",
    status: "draft",
    baseUnit: "box",
    price: 6.99,
    cost: 2.4,
    taxProfile: "Exempt",
    trackInventory: true,
    branchIds: ["br_hq"],
    imageUrl:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    createdAt: now,
    updatedAt: now,
    ...emptyCatalogParts(),
  },
  {
    id: "prd_1007",
    organizationId: "org_demo",
    sku: "BEV-TEA-CH",
    name: "Chai Latte",
    description: "Spiced chai with milk",
    categoryId: "cat_coffee",
    categoryName: resolveCategoryName("cat_coffee"),
    productType: "physical",
    status: "archived",
    baseUnit: "each",
    price: 4.5,
    cost: 1.05,
    taxProfile: "Standard (8%)",
    trackInventory: true,
    branchIds: ["br_dt"],
    imageUrl:
      "https://images.unsplash.com/photo-1578314675249-a691d4f6c2d6?w=400&h=400&fit=crop",
    createdAt: now,
    updatedAt: now,
    ...emptyCatalogParts(),
  },
  {
    id: "prd_1008",
    organizationId: "org_demo",
    sku: "BKY-MUF-BL",
    name: "Blueberry Muffin",
    description: "Bakery muffin",
    categoryId: "cat_bakery",
    categoryName: resolveCategoryName("cat_bakery"),
    productType: "physical",
    status: "active",
    baseUnit: "each",
    price: 2.95,
    cost: 0.8,
    taxProfile: "Reduced (5%)",
    trackInventory: true,
    branchIds: ["br_hq", "br_ml"],
    imageUrl:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop",
    createdAt: now,
    updatedAt: now,
    ...emptyCatalogParts(),
  },
  {
    id: "prd_8903",
    organizationId: "org_demo",
    sku: "PRD-8903-B",
    barcode: "890300000",
    name: "Titanium Smartwatch Series X",
    description: "Flagship titanium smartwatch with cellular",
    brand: "AuraTech",
    categoryId: "cat_wearables",
    categoryName: resolveCategoryName("cat_wearables"),
    productType: "physical",
    status: "active",
    baseUnit: "each",
    price: 450,
    cost: 210,
    taxProfile: "Standard (8%)",
    trackInventory: true,
    branchIds: ["br_hq", "br_dt", "br_ml"],
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    optionAxes: watchAxes,
    variants: watchVariants,
    modifiers: watchModifiers,
    mediaUrls: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1434493789847-2f02dc269da5?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop",
    ],
    collections: ["Best Sellers", "Wearables"],
    tags: ["smartwatch", "titanium"],
    supplier: "AuraTech Direct",
    weightOz: 2.4,
    dimL: 1.8,
    dimW: 1.8,
    dimH: 0.45,
    hsCode: "9102.12",
    createdAt: now,
    updatedAt: now,
  },
];

function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cloneProduct(product: Product): Product {
  return {
    ...product,
    branchIds: [...product.branchIds],
    mediaUrls: product.mediaUrls ? [...product.mediaUrls] : undefined,
    collections: product.collections ? [...product.collections] : undefined,
    tags: product.tags ? [...product.tags] : undefined,
    optionAxes: product.optionAxes.map((axis) => ({
      ...axis,
      values: [...axis.values],
    })),
    variants: product.variants.map((variant) => ({
      ...variant,
      optionValues: { ...variant.optionValues },
    })),
    modifiers: product.modifiers.map((group) => ({
      ...group,
      options: group.options.map((option) => ({ ...option })),
    })),
  };
}

export async function listProducts(): Promise<Product[]> {
  await delay();
  return products.map(cloneProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  await delay(120);
  const product = products.find((p) => p.id === id);
  return product ? cloneProduct(product) : null;
}

export type ProductWriteInput = Omit<
  Product,
  "id" | "createdAt" | "updatedAt" | "categoryName" | "organizationId"
> & {
  organizationId?: string;
};

export async function createProduct(
  input: ProductWriteInput,
): Promise<Product> {
  await delay();
  const timestamp = new Date().toISOString();
  const product: Product = {
    ...input,
    brand: input.brand || undefined,
    barcode: input.barcode || undefined,
    optionAxes: input.optionAxes ?? [],
    variants: input.variants ?? [],
    modifiers: input.modifiers ?? [],
    id: `prd_${Date.now()}`,
    organizationId: input.organizationId ?? "org_demo",
    categoryName: resolveCategoryName(input.categoryId),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  products = [product, ...products];
  return cloneProduct(product);
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
    brand: input.brand !== undefined ? input.brand || undefined : current.brand,
    barcode:
      input.barcode !== undefined
        ? input.barcode || undefined
        : current.barcode,
    categoryName: input.categoryId
      ? resolveCategoryName(input.categoryId)
      : current.categoryName,
    updatedAt: new Date().toISOString(),
  };
  products = [
    ...products.slice(0, index),
    next,
    ...products.slice(index + 1),
  ];
  return cloneProduct(next);
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
  return mutableCategories.map((c) => ({ ...c }));
}

export async function listCategoriesMutable(): Promise<Category[]> {
  await delay(60);
  return mutableCategories.map((c) => ({ ...c }));
}

export async function createCategory(input: {
  name: string;
  parentId?: string | null;
  status?: Category["status"];
}): Promise<Category> {
  await delay(100);
  const name = input.name.trim();
  const parentId = input.parentId ?? null;
  if (!name) throw new Error("Category name is required");
  if (
    parentId &&
    !mutableCategories.some((c) => c.id === parentId && c.status === "active")
  ) {
    throw new Error("Parent category not found");
  }
  const siblingClash = mutableCategories.some(
    (c) =>
      c.parentId === parentId &&
      c.name.toLowerCase() === name.toLowerCase() &&
      c.status !== "archived",
  );
  if (siblingClash) {
    throw new Error("Category name must be unique among siblings");
  }
  const siblings = mutableCategories.filter((c) => c.parentId === parentId);
  const sortOrder =
    siblings.reduce((max, c) => Math.max(max, c.sortOrder), 0) + 1;
  const category: Category = {
    id: `cat_${Date.now()}`,
    name,
    parentId,
    status: input.status ?? "active",
    sortOrder,
  };
  mutableCategories = [...mutableCategories, category];
  return { ...category };
}

export async function updateCategory(
  id: string,
  input: Partial<Pick<Category, "name" | "parentId" | "status" | "sortOrder">>,
): Promise<Category> {
  await delay(100);
  const index = mutableCategories.findIndex((c) => c.id === id);
  if (index < 0) throw new Error("Category not found");
  const current = mutableCategories[index]!;
  const name = input.name?.trim() ?? current.name;
  const parentId =
    input.parentId !== undefined ? input.parentId : current.parentId;

  if (parentId === id) {
    throw new Error("Category cannot be its own parent");
  }
  if (parentId) {
    const parent = mutableCategories.find((c) => c.id === parentId);
    if (!parent) throw new Error("Parent category not found");
    // Prevent cycles: parent cannot be a descendant of this node
    let walk: string | null = parentId;
    const seen = new Set<string>();
    while (walk) {
      if (walk === id) {
        throw new Error("Cannot move category under its own descendant");
      }
      if (seen.has(walk)) break;
      seen.add(walk);
      walk =
        mutableCategories.find((c) => c.id === walk)?.parentId ?? null;
    }
  }

  const siblingClash = mutableCategories.some(
    (c) =>
      c.id !== id &&
      c.parentId === parentId &&
      c.name.toLowerCase() === name.toLowerCase() &&
      c.status !== "archived",
  );
  if (siblingClash) {
    throw new Error("Category name must be unique among siblings");
  }

  const next: Category = {
    ...current,
    name,
    parentId,
    status: input.status ?? current.status,
    sortOrder: input.sortOrder ?? current.sortOrder,
  };
  mutableCategories = [
    ...mutableCategories.slice(0, index),
    next,
    ...mutableCategories.slice(index + 1),
  ];

  // Refresh denormalized category paths on products
  products = products.map((product) =>
    product.categoryId === id ||
    product.categoryName.includes(current.name)
      ? {
          ...product,
          categoryName: resolveCategoryName(product.categoryId),
          updatedAt: new Date().toISOString(),
        }
      : {
          ...product,
          categoryName: resolveCategoryName(product.categoryId),
        },
  );

  return { ...next };
}

export async function archiveCategory(id: string): Promise<void> {
  await updateCategory(id, { status: "archived" });
}

let mutableUnits: string[] = [...UNITS];

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
