import { z } from "zod";

export const supplierFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().email("Valid email required"),
  phone: z.string().trim().min(1, "Phone is required").max(40),
});

export const purchaseItemSchema = z.object({
  productId: z.string().min(1),
  orderedQty: z.coerce.number().int().min(1),
  unitCost: z.coerce.number().min(0),
});

export const purchaseFormSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  notes: z.string().max(500).optional(),
  items: z.array(purchaseItemSchema).min(1, "Add at least one line"),
});

export const receiptLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(0),
});

export const receiptFormSchema = z.object({
  purchaseId: z.string().min(1),
  lines: z.array(receiptLineSchema).min(1),
});

export type SupplierFormValues = z.infer<typeof supplierFormSchema>;
export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;
export type ReceiptFormValues = z.infer<typeof receiptFormSchema>;
