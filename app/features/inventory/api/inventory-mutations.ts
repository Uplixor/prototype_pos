import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { inventoryKeys } from "~/features/inventory/api/query-keys";
import {
  createAdjustment,
  getStockBalance,
  listAdjustableProducts,
  listMovements,
  listStockBalances,
  type CreateAdjustmentInput,
} from "~/features/inventory/data/inventory-store";

export function useStockBalancesQuery() {
  return useQuery({
    queryKey: inventoryKeys.balances(),
    queryFn: listStockBalances,
  });
}

export function useStockBalanceQuery(id: string | undefined) {
  return useQuery({
    queryKey: inventoryKeys.balance(id ?? ""),
    queryFn: () => getStockBalance(id!),
    enabled: Boolean(id),
  });
}

export function useMovementsQuery(
  filters?: {
    productId?: string;
    branchId?: string;
  },
  enabled = true,
) {
  return useQuery({
    queryKey: inventoryKeys.movements(filters),
    queryFn: () => listMovements(filters),
    enabled,
  });
}

export function useAdjustableProductsQuery(branchId: string) {
  return useQuery({
    queryKey: inventoryKeys.adjustable(branchId),
    queryFn: () => listAdjustableProducts(branchId),
    enabled: Boolean(branchId),
  });
}

export function useCreateAdjustmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAdjustmentInput) => createAdjustment(input),
    onSuccess: (movement) => {
      void queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      toast.success(
        `Adjustment recorded for ${movement.productName} (${movement.quantity > 0 ? "+" : ""}${movement.quantity})`,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not record adjustment");
    },
  });
}
