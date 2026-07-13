import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useStockBalancesQuery } from "~/features/inventory/api/inventory-mutations";
import { InventoryTable } from "~/features/inventory/components/inventory-table";
import { useInventoryDrawer } from "~/features/inventory/hooks/use-inventory-drawer";
import {
  STOCK_HEALTH_LABELS,
  stockHealth,
  type StockHealth,
} from "~/features/inventory/types";
import { FilterBar, PageHeader, StatCard } from "~/shared/components/page-primitives";
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

type HealthFilter = StockHealth | "all" | "attention";
type BranchFilter = "all" | "current";

function InventoryPage() {
  const { branch } = useWorkspace();
  const { openAdjustment } = useInventoryDrawer();
  const balancesQuery = useStockBalancesQuery();

  const [healthFilter, setHealthFilter] = useState<HealthFilter>("all");
  const [branchFilter, setBranchFilter] = useState<BranchFilter>("current");

  const filtered = useMemo(() => {
    const balances = balancesQuery.data ?? [];
    return balances.filter((balance) => {
      if (branchFilter === "current" && balance.branchId !== branch.id) {
        return false;
      }
      const health = stockHealth(balance);
      if (healthFilter === "attention") {
        return health === "low" || health === "out";
      }
      if (healthFilter !== "all" && health !== healthFilter) {
        return false;
      }
      return true;
    });
  }, [balancesQuery.data, healthFilter, branchFilter, branch.id]);

  const stats = useMemo(() => {
    const scope =
      branchFilter === "current"
        ? (balancesQuery.data ?? []).filter((b) => b.branchId === branch.id)
        : (balancesQuery.data ?? []);
    return {
      skus: scope.length,
      low: scope.filter((b) => stockHealth(b) === "low").length,
      out: scope.filter((b) => stockHealth(b) === "out").length,
    };
  }, [balancesQuery.data, branchFilter, branch.id]);

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Inventory"
        description="Manage and monitor inventory levels across all warehouse locations."
        actions={
          <PermissionGuard permissions={["inventory:write"]}>
            <Button type="button" size="sm" onClick={() => openAdjustment()}>
              <SlidersHorizontal className="size-3.5" />
              Adjust stock
            </Button>
          </PermissionGuard>
        }
      />

      <div className="grid gap-3 px-page py-3 sm:grid-cols-3">
        <StatCard label="Tracked SKUs" value={String(stats.skus)} />
        <StatCard
          label="Low stock"
          value={String(stats.low)}
          deltaTone={stats.low > 0 ? "negative" : "neutral"}
          delta={stats.low > 0 ? "Below reorder point" : "All healthy"}
        />
        <StatCard
          label="Out of stock"
          value={String(stats.out)}
          deltaTone={stats.out > 0 ? "negative" : "neutral"}
          delta={stats.out > 0 ? "Needs replenishment" : "None"}
        />
      </div>

      <FilterBar>
        <Select
          value={healthFilter}
          onValueChange={(value) => setHealthFilter(value as HealthFilter)}
        >
          <SelectTrigger className="w-[160px]" aria-label="Filter by health">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="attention">Needs attention</SelectItem>
            {(
              Object.keys(STOCK_HEALTH_LABELS) as Array<
                keyof typeof STOCK_HEALTH_LABELS
              >
            ).map((health) => (
              <SelectItem key={health} value={health}>
                {STOCK_HEALTH_LABELS[health]}
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
            <SelectItem value="current">This branch ({branch.code})</SelectItem>
            <SelectItem value="all">All branches</SelectItem>
          </SelectContent>
        </Select>

        <p className="ml-auto text-xs text-muted-foreground">
          {filtered.length} shown
        </p>
      </FilterBar>

      <div className="mx-page mb-4 overflow-x-auto rounded-md border border-border bg-card">
        <InventoryTable
          balances={filtered}
          isLoading={balancesQuery.isLoading}
          isError={balancesQuery.isError}
          onRetry={() => void balancesQuery.refetch()}
        />
      </div>
    </div>
  );
}

export { InventoryPage };
