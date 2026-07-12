import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  useCancelSaleMutation,
  useSalesQuery,
} from "~/features/sales/api/sales-mutations";
import { SalesTable } from "~/features/sales/components/sales-table";
import { useSaleDrawer } from "~/features/sales/hooks/use-sale-drawer";
import {
  SALE_STATUS_LABELS,
  type SaleStatus,
} from "~/features/sales/types";
import { ConfirmDialog } from "~/shared/components/confirm-dialog";
import { FilterBar, PageHeader } from "~/shared/components/page-primitives";
import { PermissionGuard } from "~/shared/components/permission-guard";
import { Button } from "~/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select";
import { useWorkspace } from "~/shared/providers/workspace-provider";

type StatusFilter = SaleStatus | "all";
type BranchFilter = "all" | "current";

function SalesPage() {
  const { branch } = useWorkspace();
  const { openCreateSale } = useSaleDrawer();
  const salesQuery = useSalesQuery();
  const cancelMutation = useCancelSaleMutation();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [branchFilter, setBranchFilter] = useState<BranchFilter>("all");
  const [cancelIds, setCancelIds] = useState<string[] | null>(null);

  const filtered = useMemo(() => {
    const sales = salesQuery.data ?? [];
    return sales.filter((sale) => {
      if (statusFilter !== "all" && sale.status !== statusFilter) return false;
      if (branchFilter === "current" && sale.branchId !== branch.id) {
        return false;
      }
      return true;
    });
  }, [salesQuery.data, statusFilter, branchFilter, branch.id]);

  const openCount =
    salesQuery.data?.filter((sale) => sale.status === "open").length ?? 0;
  const awaitingCount =
    salesQuery.data?.filter((sale) => sale.status === "awaiting_payment")
      .length ?? 0;

  function requestCancel(ids: string[]) {
    if (ids.length === 0) return;
    setCancelIds(ids);
  }

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Sales"
        description={`${openCount} open · ${awaitingCount} awaiting payment · Branch ${branch.code}`}
        actions={
          <PermissionGuard permissions={["sales:write"]}>
            <Button type="button" size="sm" onClick={openCreateSale}>
              <Plus className="size-3.5" />
              New sale
            </Button>
          </PermissionGuard>
        }
      />

      <FilterBar>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="w-[170px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(
              Object.keys(SALE_STATUS_LABELS) as Array<
                keyof typeof SALE_STATUS_LABELS
              >
            ).map((status) => (
              <SelectItem key={status} value={status}>
                {SALE_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={branchFilter}
          onValueChange={(value) => setBranchFilter(value as BranchFilter)}
        >
          <SelectTrigger className="w-[160px]" aria-label="Filter by branch">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All branches</SelectItem>
            <SelectItem value="current">This branch ({branch.code})</SelectItem>
          </SelectContent>
        </Select>

        <p className="ml-auto text-xs text-muted-foreground">
          {filtered.length} shown
        </p>
      </FilterBar>

      <div className="mx-page mb-4 overflow-hidden rounded-md border border-border bg-card">
        <SalesTable
          sales={filtered}
          isLoading={salesQuery.isLoading}
          isError={salesQuery.isError}
          onRetry={() => void salesQuery.refetch()}
          onCancel={requestCancel}
        />
      </div>

      <ConfirmDialog
        open={Boolean(cancelIds)}
        onOpenChange={(open) => {
          if (!open) setCancelIds(null);
        }}
        title={
          cancelIds?.length === 1
            ? "Cancel sale?"
            : `Cancel ${cancelIds?.length ?? 0} sales?`
        }
        description="Cancellation retains history. Completed and refunded sales cannot be cancelled."
        confirmLabel="Cancel sales"
        variant="destructive"
        loading={cancelMutation.isPending}
        onConfirm={() => {
          if (!cancelIds) return;
          void Promise.all(
            cancelIds.map(
              (id) =>
                new Promise<void>((resolve, reject) => {
                  cancelMutation.mutate(id, {
                    onSuccess: () => resolve(),
                    onError: (error) => reject(error),
                  });
                }),
            ),
          ).then(() => setCancelIds(null));
        }}
      />
    </div>
  );
}

export { SalesPage };
