import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  useApproveStockCountMutation,
  useCreateStockCountMutation,
  useStockCountsQuery,
} from "~/features/inventory/api/counts-mutations";
import {
  useMovementsQuery,
  useStockBalancesQuery,
} from "~/features/inventory/api/inventory-mutations";
import { useInventoryDrawer } from "~/features/inventory/hooks/use-inventory-drawer";
import {
  MOVEMENT_TYPE_LABELS,
  type MovementType,
} from "~/features/inventory/types";
import { FilterBar, PageBody, PageHeader } from "~/shared/components/page-primitives";
import { PermissionGuard } from "~/shared/components/permission-guard";
import { StatusBadge } from "~/shared/components/status-badge";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/shared/components/ui/sheet";
import { useWorkspace } from "~/shared/providers/workspace-provider";

export function MovementsPage() {
  const { branch } = useWorkspace();
  const [branchFilter, setBranchFilter] = useState<"all" | "current">("current");
  const [typeFilter, setTypeFilter] = useState<MovementType | "all">("all");
  const movementsQuery = useMovementsQuery(
    branchFilter === "current" ? { branchId: branch.id } : undefined,
  );

  const rows = useMemo(() => {
    const list = movementsQuery.data ?? [];
    if (typeFilter === "all") return list;
    return list.filter((m) => m.type === typeFilter);
  }, [movementsQuery.data, typeFilter]);

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Stock Movements"
        description="Append-only ledger — balances are projections"
      />
      <FilterBar>
        <Select
          value={branchFilter}
          onValueChange={(v) => setBranchFilter(v as "all" | "current")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">This branch</SelectItem>
            <SelectItem value="all">All branches</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as MovementType | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {(Object.keys(MOVEMENT_TYPE_LABELS) as MovementType[]).map((t) => (
              <SelectItem key={t} value={t}>
                {MOVEMENT_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>
      <PageBody className="overflow-x-auto rounded-md border border-border p-0">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-muted/80 text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-medium">When</th>
              <th className="px-3 py-2 text-left font-medium">Product</th>
              <th className="px-3 py-2 text-left font-medium">Type</th>
              <th className="px-3 py-2 text-left font-medium">Qty</th>
              <th className="px-3 py-2 text-left font-medium">Reason</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-b border-border">
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {new Date(m.createdAt).toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  <p className="font-medium">{m.productName}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {m.branchCode}
                  </p>
                </td>
                <td className="px-3 py-2">{MOVEMENT_TYPE_LABELS[m.type]}</td>
                <td className="px-3 py-2 tabular-nums font-medium">
                  {m.quantity > 0 ? "+" : ""}
                  {m.quantity}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {m.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageBody>
    </div>
  );
}

export function AdjustmentsPage() {
  const { openAdjustment } = useInventoryDrawer();
  const movementsQuery = useMovementsQuery();
  const adjustments = (movementsQuery.data ?? []).filter(
    (m) => m.type === "adjustment",
  );

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Stock Adjustments"
        description="Reasoned corrections that create Stock Movements"
        actions={
          <PermissionGuard permissions={["inventory:write"]}>
            <Button type="button" size="sm" onClick={() => openAdjustment()}>
              <Plus className="size-3.5" />
              Adjust stock
            </Button>
          </PermissionGuard>
        }
      />
      <PageBody className="overflow-x-auto rounded-md border border-border p-0">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-muted/80 text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-medium">Product</th>
              <th className="px-3 py-2 text-left font-medium">Branch</th>
              <th className="px-3 py-2 text-left font-medium">Qty</th>
              <th className="px-3 py-2 text-left font-medium">Reason</th>
              <th className="px-3 py-2 text-left font-medium">Actor</th>
            </tr>
          </thead>
          <tbody>
            {adjustments.map((m) => (
              <tr key={m.id} className="border-b border-border">
                <td className="px-3 py-2 font-medium">{m.productName}</td>
                <td className="px-3 py-2">{m.branchCode}</td>
                <td className="px-3 py-2 tabular-nums">
                  {m.quantity > 0 ? "+" : ""}
                  {m.quantity}
                </td>
                <td className="px-3 py-2 text-xs">{m.reason}</td>
                <td className="px-3 py-2 text-muted-foreground">{m.actorName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageBody>
    </div>
  );
}

export function CountsPage() {
  const { organization, branch, user } = useWorkspace();
  const countsQuery = useStockCountsQuery();
  const balancesQuery = useStockBalancesQuery();
  const createMutation = useCreateStockCountMutation();
  const approveMutation = useApproveStockCountMutation();
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [countedQty, setCountedQty] = useState(0);

  const branchBalances = (balancesQuery.data ?? []).filter(
    (b) => b.branchId === branch.id,
  );

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Stock Counts"
        description="Approval creates reconciliation movements — never overwrites history"
        actions={
          <PermissionGuard permissions={["inventory:write"]}>
            <Button type="button" size="sm" onClick={() => setOpen(true)}>
              <Plus className="size-3.5" />
              New count
            </Button>
          </PermissionGuard>
        }
      />
      <PageBody className="overflow-x-auto rounded-md border border-border p-0">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-muted/80 text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-medium">Count</th>
              <th className="px-3 py-2 text-left font-medium">Branch</th>
              <th className="px-3 py-2 text-left font-medium">Lines</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(countsQuery.data ?? []).map((c) => (
              <tr key={c.id} className="border-b border-border">
                <td className="px-3 py-2 font-medium">{c.countNumber}</td>
                <td className="px-3 py-2">{c.branchCode}</td>
                <td className="px-3 py-2 tabular-nums">{c.items.length}</td>
                <td className="px-3 py-2">
                  <StatusBadge
                    status={
                      c.status === "approved"
                        ? "completed"
                        : c.status === "submitted"
                          ? "pending"
                          : "draft"
                    }
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  {c.status !== "approved" ? (
                    <PermissionGuard permissions={["inventory:write"]}>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={approveMutation.isPending}
                        onClick={() =>
                          approveMutation.mutate({
                            id: c.id,
                            actorName: user.name,
                          })
                        }
                      >
                        Approve
                      </Button>
                    </PermissionGuard>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageBody>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent size="md">
          <SheetHeader>
            <SheetTitle>New stock count · {branch.code}</SheetTitle>
          </SheetHeader>
          <SheetBody className="space-y-3">
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                {branchBalances.map((b) => (
                  <SelectItem key={b.id} value={b.productId}>
                    {b.productName} (on hand {b.onHand})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={0}
              value={countedQty}
              onChange={(e) => setCountedQty(Number(e.target.value) || 0)}
              placeholder="Counted quantity"
            />
          </SheetBody>
          <SheetFooter>
            <Button
              type="button"
              size="sm"
              disabled={!productId || createMutation.isPending}
              onClick={() => {
                void createMutation
                  .mutateAsync({
                    organizationId: organization.id,
                    branchId: branch.id,
                    items: [{ productId, countedQty }],
                  })
                  .then(() => setOpen(false));
              }}
            >
              Submit count
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
