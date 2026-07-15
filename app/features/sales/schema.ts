import { z } from "zod";

export const saleItemInputSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  variantId: z.string().optional(),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

export const createSaleSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, "Customer is required")
    .max(120, "Customer name is too long"),
  notes: z.string().max(500).optional(),
  items: z
    .array(saleItemInputSchema)
    .min(1, "Add at least one product"),
});

export const recordPaymentSchema = z.object({
  method: z.enum(["cash", "card", "other"]),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
});

export const refundSaleSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  reason: z
    .string()
    .trim()
    .min(1, "Reason is required")
    .max(300, "Reason is too long"),
});

export type CreateSaleValues = z.infer<typeof createSaleSchema>;
export type RecordPaymentValues = z.infer<typeof recordPaymentSchema>;
export type SaleItemInput = z.infer<typeof saleItemInputSchema>;
export type RefundSaleValues = z.infer<typeof refundSaleSchema>;
