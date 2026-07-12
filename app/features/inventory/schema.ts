import { z } from "zod";

export const ADJUSTMENT_REASONS = [
  "Damaged",
  "Expired",
  "Theft / shrinkage",
  "Found stock",
  "Count correction",
  "Other",
] as const;

export const stockAdjustmentSchema = z
  .object({
    productId: z.string().min(1, "Product is required"),
    quantity: z.coerce
      .number()
      .refine((value) => value !== 0, "Quantity cannot be zero"),
    reason: z.enum(ADJUSTMENT_REASONS),
    notes: z.string().max(500).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.reason === "Other" && !value.notes?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["notes"],
        message: "Notes are required when reason is Other",
      });
    }
  });

export type StockAdjustmentValues = z.infer<typeof stockAdjustmentSchema>;
