import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  archiveSupplier,
  confirmGoodsReceipt,
  createPurchase,
  createSupplier,
  getPurchase,
  listPurchases,
  listReceipts,
  listSuppliers,
  orderPurchase,
  type ConfirmReceiptInput,
  type CreatePurchaseInput,
} from "~/features/purchasing/data/purchasing-store";
import type { SupplierFormValues } from "~/features/purchasing/schema";
import { inventoryKeys } from "~/features/inventory/api/query-keys";

export const purchasingKeys = {
  all: ["purchasing"] as const,
  suppliers: () => [...purchasingKeys.all, "suppliers"] as const,
  purchases: () => [...purchasingKeys.all, "purchases"] as const,
  purchase: (id: string) => [...purchasingKeys.purchases(), id] as const,
  receipts: () => [...purchasingKeys.all, "receipts"] as const,
};

export function useSuppliersQuery() {
  return useQuery({
    queryKey: purchasingKeys.suppliers(),
    queryFn: listSuppliers,
  });
}

export function usePurchasesQuery() {
  return useQuery({
    queryKey: purchasingKeys.purchases(),
    queryFn: listPurchases,
  });
}

export function usePurchaseQuery(id: string | undefined) {
  return useQuery({
    queryKey: purchasingKeys.purchase(id ?? ""),
    queryFn: () => getPurchase(id!),
    enabled: Boolean(id),
  });
}

export function useReceiptsQuery() {
  return useQuery({
    queryKey: purchasingKeys.receipts(),
    queryFn: listReceipts,
  });
}

export function useCreateSupplierMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: SupplierFormValues) => createSupplier(values),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: purchasingKeys.suppliers() });
      toast.success("Supplier created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useArchiveSupplierMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: archiveSupplier,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: purchasingKeys.suppliers() });
      toast.success("Supplier archived");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCreatePurchaseMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePurchaseInput) => createPurchase(input),
    onSuccess: (p) => {
      void qc.invalidateQueries({ queryKey: purchasingKeys.purchases() });
      toast.success(`Created ${p.purchaseNumber}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useOrderPurchaseMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: orderPurchase,
    onSuccess: (p) => {
      void qc.invalidateQueries({ queryKey: purchasingKeys.purchases() });
      void qc.invalidateQueries({ queryKey: purchasingKeys.purchase(p.id) });
      toast.success(`${p.purchaseNumber} ordered`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useConfirmReceiptMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ConfirmReceiptInput) => confirmGoodsReceipt(input),
    onSuccess: (r) => {
      void qc.invalidateQueries({ queryKey: purchasingKeys.all });
      void qc.invalidateQueries({ queryKey: inventoryKeys.all });
      toast.success(`${r.receiptNumber} confirmed — stock updated`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
