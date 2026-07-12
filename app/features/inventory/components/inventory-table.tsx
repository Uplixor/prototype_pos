import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useInventoryDrawer } from "~/features/inventory/hooks/use-inventory-drawer";
import {
  STOCK_HEALTH_LABELS,
  stockHealth,
  stockHealthToBadge,
  type StockBalance,
  type StockHealth,
} from "~/features/inventory/types";
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

export type InventoryTableProps = {
  balances: StockBalance[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

function InventoryTable({
  balances,
  isLoading,
  isError,
  onRetry,
}: InventoryTableProps) {
  const { openStock, openAdjustment } = useInventoryDrawer();

  const columns = useMemo<ColumnDef<StockBalance>[]>(
    () => [
      {
        accessorKey: "productName",
        header: "Product",
        cell: ({ row }) => (
          <button
            type="button"
            className="text-left"
            onClick={() => openStock(row.original)}
          >
            <span className="block font-medium text-primary hover:underline">
              {row.original.productName}
            </span>
            <span className="block text-[11px] text-muted-foreground">
              {row.original.sku}
            </span>
          </button>
        ),
      },
      {
        accessorKey: "branchCode",
        header: "Branch",
      },
      {
        accessorKey: "onHand",
        header: "On hand",
        cell: ({ row }) => (
          <span className="tabular-nums font-medium">
            {row.original.onHand}{" "}
            <span className="font-normal text-muted-foreground">
              {row.original.unit}
            </span>
          </span>
        ),
      },
      {
        accessorKey: "reorderPoint",
        header: "Reorder",
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {row.original.reorderPoint}
          </span>
        ),
      },
      {
        id: "health",
        header: "Status",
        accessorFn: (row) => stockHealth(row),
        cell: ({ row }) => {
          const health = stockHealth(row.original);
          return (
            <StatusBadge
              status={stockHealthToBadge(health)}
              label={STOCK_HEALTH_LABELS[health]}
            />
          );
        },
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${row.original.productName}`}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => openStock(row.original)}>
                View movements
              </DropdownMenuItem>
              <PermissionGuard permissions={["inventory:write"]}>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => openAdjustment(row.original.productId)}
                >
                  Adjust stock
                </DropdownMenuItem>
              </PermissionGuard>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [openStock, openAdjustment],
  );

  return (
    <DataTable
      columns={columns}
      data={balances}
      searchKey="productName"
      searchPlaceholder="Search stock…"
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle="No stock balances"
      emptyDescription="Tracked products appear here after the first Stock Movement."
      getRowId={(row) => row.id}
      onExportCsv={(rows) =>
        exportToCsv(
          rows.map((row) => {
            const health: StockHealth = stockHealth(row);
            return {
              sku: row.sku,
              product: row.productName,
              branch: row.branchCode,
              onHand: row.onHand,
              reorderPoint: row.reorderPoint,
              unit: row.unit,
              status: health,
            };
          }),
          "inventory-balances",
        )
      }
    />
  );
}

export { InventoryTable };
