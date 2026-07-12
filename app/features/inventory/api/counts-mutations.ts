import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { inventoryKeys } from "~/features/inventory/api/query-keys";
import {
  approveStockCount,
  createStockCount,
  listStockCounts,
} from "~/features/inventory/data/inventory-store";

export function useStockCountsQuery() {
  return useQuery({
    queryKey: [...inventoryKeys.all, "counts"],
    queryFn: listStockCounts,
  });
}

export function useCreateStockCountMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createStockCount,
    onSuccess: (c) => {
      void qc.invalidateQueries({ queryKey: inventoryKeys.all });
      toast.success(`Submitted ${c.countNumber}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useApproveStockCountMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, actorName }: { id: string; actorName: string }) =>
      approveStockCount(id, actorName),
    onSuccess: (c) => {
      void qc.invalidateQueries({ queryKey: inventoryKeys.all });
      toast.success(`${c.countNumber} approved`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
