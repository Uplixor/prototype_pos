import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useSaleDrawer } from "~/features/sales/hooks/use-sale-drawer";
import {
  formatMoney,
  saleStatusToBadge,
  SALE_STATUS_LABELS,
  type Sale,
} from "~/features/sales/types";
import { DataTable } from "~/shared/components/data-table/data-table";
import { exportToCsv } from "~/shared/components/data-table/export-csv";
import { PermissionGuard } from "~/shared/components/permission-guard";
import { StatusBadge } from "~/shared/components/status-badge";
import { Button } from "~/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/shared/components/ui/dropdown-menu";

export type SalesTableProps = {
  sales: Sale[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onCancel: (ids: string[]) => void;
};

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function SalesTable({
  sales,
  isLoading,
  isError,
  onRetry,
  onCancel,
}: SalesTableProps) {
  const { openSale } = useSaleDrawer();

  const columns = useMemo<ColumnDef<Sale>[]>(
    () => [
      {
        accessorKey: "saleNumber",
        header: "Sale",
        cell: ({ row }) => (
          <button
            type="button"
            className="text-left"
            onClick={() => openSale(row.original)}
          >
            <span className="block font-medium text-primary hover:underline">
              {row.original.saleNumber}
            </span>
            <span className="block text-[11px] text-muted-foreground">
              {row.original.items.length} item
              {row.original.items.length === 1 ? "" : "s"}
            </span>
          </button>
        ),
      },
      { accessorKey: "customerName", header: "Customer" },
      {
        accessorKey: "branchCode",
        header: "Branch",
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => (
          <span className="tabular-nums">{formatMoney(row.original.total)}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge
            status={saleStatusToBadge(row.original.status)}
            label={SALE_STATUS_LABELS[row.original.status]}
          />
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {formatWhen(row.original.updatedAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          const mutable =
            row.original.status === "open" ||
            row.original.status === "awaiting_payment";
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Actions for ${row.original.saleNumber}`}
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => openSale(row.original)}>
                  View
                </DropdownMenuItem>
                <PermissionGuard permissions={["sales:write"]}>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={!mutable}
                    onSelect={() => onCancel([row.original.id])}
                  >
                    Cancel
                  </DropdownMenuItem>
                </PermissionGuard>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [openSale, onCancel],
  );

  return (
    <DataTable
      columns={columns}
      data={sales}
      searchKey="saleNumber"
      searchPlaceholder="Search sales…"
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle="No sales"
      emptyDescription="Create a sale for the current branch to get started."
      getRowId={(row) => row.id}
      onExportCsv={(rows) =>
        exportToCsv(
          rows.map((row) => ({
            saleNumber: row.saleNumber,
            customer: row.customerName,
            branch: row.branchCode,
            status: row.status,
            total: row.total,
            paid: row.amountPaid,
            updatedAt: row.updatedAt,
          })),
          "sales",
        )
      }
      bulkActions={(selected) => (
        <PermissionGuard permissions={["sales:write"]}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onCancel(
                selected
                  .filter(
                    (row) =>
                      row.status === "open" ||
                      row.status === "awaiting_payment",
                  )
                  .map((row) => row.id),
              )
            }
          >
            Cancel selected
          </Button>
        </PermissionGuard>
      )}
    />
  );
}

export { SalesTable };
