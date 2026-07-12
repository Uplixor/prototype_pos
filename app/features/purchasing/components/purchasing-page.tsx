import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import {
  usePurchasesQuery,
  useReceiptsQuery,
  useSuppliersQuery,
} from "~/features/purchasing/api/purchasing-mutations";
import { usePurchasingDrawer } from "~/features/purchasing/hooks/use-purchasing-drawer";
import {
  PURCHASE_STATUS_LABELS,
  type Purchase,
  type PurchaseStatus,
} from "~/features/purchasing/types";
import { DataTable } from "~/shared/components/data-table/data-table";
import { FilterBar, PageHeader } from "~/shared/components/page-primitives";
import { PermissionGuard } from "~/shared/components/permission-guard";
import { StatusBadge, type StatusKey } from "~/shared/components/status-badge";
import { Button } from "~/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/shared/components/ui/tabs";

function toBadge(status: PurchaseStatus): StatusKey {
  if (status === "partially_received") return "unpaid";
  if (status === "ordered") return "pending";
  if (status === "received") return "completed";
  if (status === "cancelled") return "cancelled";
  return "draft";
}

function PurchasingPage() {
  const { openCreatePurchase, openCreateSupplier, openPurchase, openReceive } =
    usePurchasingDrawer();
  const purchasesQuery = usePurchasesQuery();
  const suppliersQuery = useSuppliersQuery();
  const [status, setStatus] = useState<PurchaseStatus | "all">("all");

  const purchases = useMemo(() => {
    const rows = purchasesQuery.data ?? [];
    if (status === "all") return rows;
    return rows.filter((p) => p.status === status);
  }, [purchasesQuery.data, status]);

  const columns = useMemo<ColumnDef<Purchase>[]>(
    () => [
      {
        accessorKey: "purchaseNumber",
        header: "Purchase",
        cell: ({ row }) => (
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => openPurchase(row.original)}
          >
            {row.original.purchaseNumber}
          </button>
        ),
      },
      { accessorKey: "supplierName", header: "Supplier" },
      { accessorKey: "branchCode", header: "Branch" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge
            status={toBadge(row.original.status)}
            label={PURCHASE_STATUS_LABELS[row.original.status]}
          />
        ),
      },
      {
        id: "lines",
        header: "Lines",
        cell: ({ row }) => row.original.items.length,
      },
    ],
    [openPurchase],
  );

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Purchases"
        description="Procurement intent — stock moves only on Goods Receipt"
        actions={
          <PermissionGuard permissions={["purchasing:write"]}>
            <Button type="button" variant="outline" size="sm" onClick={openCreateSupplier}>
              New supplier
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => openReceive()}>
              Receive goods
            </Button>
            <Button type="button" size="sm" onClick={openCreatePurchase}>
              <Plus className="size-3.5" />
              New purchase
            </Button>
          </PermissionGuard>
        }
      />

      <Tabs defaultValue="purchases" className="px-page pt-2">
        <TabsList>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>
        <TabsContent value="purchases" className="mt-0">
          <FilterBar className="px-0">
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as PurchaseStatus | "all")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {(Object.keys(PURCHASE_STATUS_LABELS) as PurchaseStatus[]).map(
                  (s) => (
                    <SelectItem key={s} value={s}>
                      {PURCHASE_STATUS_LABELS[s]}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </FilterBar>
          <div className="mb-4 overflow-hidden rounded-md border border-border bg-card">
            <DataTable
              columns={columns}
              data={purchases}
              searchKey="purchaseNumber"
              isLoading={purchasesQuery.isLoading}
              isError={purchasesQuery.isError}
              onRetry={() => void purchasesQuery.refetch()}
              getRowId={(r) => r.id}
            />
          </div>
        </TabsContent>
        <TabsContent value="suppliers">
          <div className="mb-4 overflow-hidden rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/80 text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium">Name</th>
                  <th className="px-3 py-2 text-left font-medium">Email</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {(suppliersQuery.data ?? []).map((s) => (
                  <tr key={s.id} className="border-b border-border">
                    <td className="px-3 py-2 font-medium">{s.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{s.email}</td>
                    <td className="px-3 py-2">
                      <StatusBadge
                        status={s.status === "active" ? "active" : "inactive"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReceiptsPage() {
  const { openReceive } = usePurchasingDrawer();
  const receiptsQuery = useReceiptsQuery();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Goods Receipts"
        description="Confirmed receipts that created inbound Stock Movements"
        actions={
          <PermissionGuard permissions={["purchasing:write"]}>
            <Button type="button" size="sm" onClick={() => openReceive()}>
              <Plus className="size-3.5" />
              New receipt
            </Button>
          </PermissionGuard>
        }
      />
      <div className="mx-page mb-4 overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/80 text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-medium">Receipt</th>
              <th className="px-3 py-2 text-left font-medium">Purchase</th>
              <th className="px-3 py-2 text-left font-medium">Branch</th>
              <th className="px-3 py-2 text-left font-medium">Lines</th>
              <th className="px-3 py-2 text-left font-medium">Actor</th>
            </tr>
          </thead>
          <tbody>
            {(receiptsQuery.data ?? []).map((r) => (
              <tr key={r.id} className="border-b border-border">
                <td className="px-3 py-2 font-medium">{r.receiptNumber}</td>
                <td className="px-3 py-2">{r.purchaseNumber}</td>
                <td className="px-3 py-2">{r.branchCode}</td>
                <td className="px-3 py-2 tabular-nums">{r.items.length}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.actorName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { PurchasingPage, ReceiptsPage };
