import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { inventoryKeys } from "~/features/inventory/api/query-keys";
import {
  completeTransfer,
  createTransfer,
  listTransfers,
} from "~/features/transfers/data/transfers-store";

export const transferKeys = {
  all: ["transfers"] as const,
  list: () => [...transferKeys.all, "list"] as const,
};

export function useTransfersQuery() {
  return useQuery({ queryKey: transferKeys.list(), queryFn: listTransfers });
}

export function useCreateTransferMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTransfer,
    onSuccess: (t) => {
      void qc.invalidateQueries({ queryKey: transferKeys.list() });
      toast.success(`Created ${t.transferNumber}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCompleteTransferMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, actorName }: { id: string; actorName: string }) =>
      completeTransfer(id, actorName),
    onSuccess: (t) => {
      void qc.invalidateQueries({ queryKey: transferKeys.list() });
      void qc.invalidateQueries({ queryKey: inventoryKeys.all });
      toast.success(`${t.transferNumber} completed`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
