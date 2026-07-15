import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { salesKeys } from "~/features/sales/api/query-keys";
import {
  addSaleItem,
  cancelSale,
  createSale,
  getSale,
  listSales,
  listSellableProducts,
  recordPayment,
  refundSale,
  removeSaleItem,
  requestPayment,
  type CreateSaleInput,
} from "~/features/sales/data/sales-store";
import type { PaymentMethod } from "~/features/sales/types";

export function useSalesQuery() {
  return useQuery({
    queryKey: salesKeys.list(),
    queryFn: listSales,
  });
}

export function useSaleQuery(id: string | undefined) {
  return useQuery({
    queryKey: salesKeys.detail(id ?? ""),
    queryFn: () => getSale(id!),
    enabled: Boolean(id),
  });
}

export function useSellableProductsQuery(branchId: string) {
  return useQuery({
    queryKey: salesKeys.sellable(branchId),
    queryFn: () => listSellableProducts(branchId),
    enabled: Boolean(branchId),
  });
}

function invalidateSales(queryClient: ReturnType<typeof useQueryClient>, id?: string) {
  void queryClient.invalidateQueries({ queryKey: salesKeys.list() });
  if (id) {
    void queryClient.invalidateQueries({ queryKey: salesKeys.detail(id) });
  }
}

export function useCreateSaleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSaleInput) => createSale(input),
    onSuccess: (sale) => {
      invalidateSales(queryClient, sale.id);
      toast.success(`Created ${sale.saleNumber}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not create sale");
    },
  });
}

export function useAddSaleItemMutation(saleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      productId: string;
      quantity: number;
      variantId?: string;
    }) =>
      addSaleItem(saleId, input.productId, input.quantity, input.variantId),
    onSuccess: () => {
      invalidateSales(queryClient, saleId);
      toast.success("Item added");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not add item");
    },
  });
}

export function useRemoveSaleItemMutation(saleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => removeSaleItem(saleId, itemId),
    onSuccess: () => {
      invalidateSales(queryClient, saleId);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not remove item");
    },
  });
}

export function useRequestPaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (saleId: string) => requestPayment(saleId),
    onSuccess: (sale) => {
      invalidateSales(queryClient, sale.id);
      toast.success("Ready for payment");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not request payment");
    },
  });
}

export function useRecordPaymentMutation(saleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      method: PaymentMethod;
      amount: number;
      idempotencyKey: string;
    }) => recordPayment(saleId, input),
    onSuccess: (sale) => {
      invalidateSales(queryClient, saleId);
      toast.success(
        sale.status === "completed"
          ? `${sale.saleNumber} completed`
          : "Payment recorded",
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not record payment");
    },
  });
}

export function useCancelSaleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (saleId: string) => cancelSale(saleId),
    onSuccess: (sale) => {
      invalidateSales(queryClient, sale.id);
      toast.success(`${sale.saleNumber} cancelled`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not cancel sale");
    },
  });
}

export function useRefundSaleMutation(saleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { amount: number; reason: string }) =>
      refundSale(saleId, input.amount, input.reason),
    onSuccess: (sale) => {
      invalidateSales(queryClient, saleId);
      toast.success(
        sale.status === "refunded"
          ? `${sale.saleNumber} refunded`
          : "Refund recorded",
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not process refund");
    },
  });
}
