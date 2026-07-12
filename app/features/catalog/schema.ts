import { z } from "zod";

export const productTypeSchema = z.enum([
  "physical",
  "service",
  "digital",
  "bundle",
  "gift_card",
]);

export const productStatusSchema = z.enum(["draft", "active", "archived"]);

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
    description: z.string().max(2000, "Description is too long"),
    categoryId: z.string().min(1, "Category is required"),
    productType: productTypeSchema,
    status: productStatusSchema,
    baseUnit: z.string().min(1, "Base unit is required"),
    price: z.coerce.number().min(0, "Price cannot be negative"),
    cost: z.coerce.number().min(0, "Cost cannot be negative"),
    taxProfile: z.string().min(1, "Tax profile is required"),
    trackInventory: z.boolean(),
    branchIds: z.array(z.string()).min(1, "Select at least one branch"),
  })
  .superRefine((value, ctx) => {
    if (value.status === "active" && value.price <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Active products require a price greater than zero",
      });
    }
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;

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
