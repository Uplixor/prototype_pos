import { z } from "zod";

export const productTypeSchema = z.enum([
  "physical",
  "service",
  "digital",
  "bundle",
  "gift_card",
]);

export const productStatusSchema = z.enum(["draft", "active", "archived"]);

const optionAxisSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Option name is required").max(40),
  values: z
    .array(z.string().trim().min(1).max(40))
    .min(1, "Add at least one value"),
});

const variantSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(64)
    .regex(/^[A-Za-z0-9\-_.]+$/, "SKU may contain letters, numbers, - _ ."),
  skuSuffix: z.string().max(64),
  barcode: z.string().max(64).optional(),
  imageUrl: z.string().trim().max(500).optional().or(z.literal("")),
  optionValues: z.record(z.string(), z.string()),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  cost: z.coerce.number().min(0, "Cost cannot be negative"),
  status: productStatusSchema,
});

const modifierOptionSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Option name is required").max(80),
  priceDelta: z.coerce.number(),
});

const modifierGroupSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Group name is required").max(80),
  required: z.boolean(),
  multiSelect: z.boolean(),
  options: z
    .array(modifierOptionSchema)
    .min(1, "Add at least one modifier option"),
});

export const productFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(120, "Name must be 120 characters or fewer"),
    sku: z
      .string()
      .trim()
      .min(1, "SKU is required")
      .max(64, "SKU must be 64 characters or fewer")
      .regex(/^[A-Za-z0-9\-_.]+$/, "SKU may contain letters, numbers, - _ ."),
    barcode: z.string().trim().max(64).optional().or(z.literal("")),
    brand: z.string().trim().max(80).optional().or(z.literal("")),
    /** Primary product image — first gallery item is also primary */
    imageUrl: z.string().trim().max(500).optional().or(z.literal("")),
    mediaUrls: z.array(z.string().trim().max(500)).max(12),
    description: z.string().max(2000, "Description is too long"),
    categoryId: z.string().min(1, "Category is required"),
    productType: productTypeSchema,
    status: productStatusSchema,
    baseUnit: z.string().min(1, "Base unit is required"),
    price: z.coerce.number().min(0, "Price cannot be negative"),
    compareAtPrice: z.coerce.number().min(0).optional(),
    cost: z.coerce.number().min(0, "Cost cannot be negative"),
    taxProfile: z.string().min(1, "Tax profile is required"),
    trackInventory: z.boolean(),
    branchIds: z.array(z.string()).min(1, "Select at least one branch"),
    collections: z.array(z.string().trim().min(1).max(40)).max(20),
    tags: z.array(z.string().trim().min(1).max(40)).max(30),
    supplier: z.string().trim().max(80).optional().or(z.literal("")),
    weightOz: z.coerce.number().min(0).optional(),
    dimL: z.coerce.number().min(0).optional(),
    dimW: z.coerce.number().min(0).optional(),
    dimH: z.coerce.number().min(0).optional(),
    hsCode: z.string().trim().max(20).optional().or(z.literal("")),
    optionAxes: z.array(optionAxisSchema),
    variants: z.array(variantSchema),
    modifiers: z.array(modifierGroupSchema),
  })
  .superRefine((value, ctx) => {
    const hasVariants = value.variants.length > 0;
    if (value.status === "active" && !hasVariants && value.price <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Active products require a price greater than zero",
      });
    }
    if (value.status === "active" && hasVariants) {
      const active = value.variants.filter((v) => v.status === "active");
      if (active.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["variants"],
          message: "Active products need at least one active variant",
        });
      }
      for (const [index, variant] of active.entries()) {
        if (variant.price <= 0) {
          ctx.addIssue({
            code: "custom",
            path: ["variants", index, "price"],
            message: "Active variants require a price greater than zero",
          });
        }
      }
    }

    const skus = [value.sku, ...value.variants.map((v) => v.sku)].map((s) =>
      s.toLowerCase(),
    );
    const seen = new Set<string>();
    for (const sku of skus) {
      if (seen.has(sku)) {
        ctx.addIssue({
          code: "custom",
          path: ["variants"],
          message: `Duplicate SKU "${sku}"`,
        });
        break;
      }
      seen.add(sku);
    }
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(80, "Name must be 80 characters or fewer"),
  parentId: z.string().nullable(),
  status: z.enum(["active", "archived"]),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const PRODUCT_TYPE_LABELS: Record<
  z.infer<typeof productTypeSchema>,
  string
> = {
  physical: "Physical",
  service: "Service",
  digital: "Digital",
  bundle: "Bundle",
  gift_card: "Gift card",
};

export const PRODUCT_STATUS_LABELS: Record<
  z.infer<typeof productStatusSchema>,
  string
> = {
  draft: "Draft",
  active: "Active",
  archived: "Archived",
};
