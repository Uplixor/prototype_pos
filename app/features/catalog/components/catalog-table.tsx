import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { BRANCH_OPTIONS } from "~/features/catalog/data/catalog-store";
import { ProductImage } from "~/features/catalog/components/product-image";
import { useProductDrawer } from "~/features/catalog/hooks/use-product-drawer";
import { PRODUCT_TYPE_LABELS } from "~/features/catalog/schema";
import {
  formatMoney,
  productStatusToBadge,
  type Product,
} from "~/features/catalog/types";
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

export type CatalogTableProps = {
  products: Product[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onArchive: (ids: string[]) => void;
};

function branchLabels(ids: string[]): string {
  return ids
    .map(
      (id) => BRANCH_OPTIONS.find((branch) => branch.id === id)?.code ?? id,
    )
    .join(", ");
}

function CatalogTable({
  products,
  isLoading,
  isError,
  onRetry,
  onArchive,
}: CatalogTableProps) {
  const { openEditProduct } = useProductDrawer();

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => (
          <button
            type="button"
            className="flex items-center gap-3 text-left"
            onClick={() => openEditProduct(row.original)}
          >
            <ProductImage
              src={row.original.imageUrl}
              alt={row.original.name}
              size="sm"
              className="shrink-0"
            />
            <span className="min-w-0">
              <span className="block font-medium text-primary hover:underline">
                {row.original.name}
              </span>
              <span className="block font-mono text-[11px] text-muted-foreground">
                {row.original.sku}
              </span>
            </span>
          </button>
        ),
      },
      {
        accessorKey: "categoryName",
        header: "Category",
      },
      {
        accessorKey: "productType",
        header: "Type",
        cell: ({ row }) => PRODUCT_TYPE_LABELS[row.original.productType],
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatMoney(row.original.price)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={productStatusToBadge(row.original.status)} />
        ),
      },
      {
        id: "branches",
        header: "Branches",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {branchLabels(row.original.branchIds)}
          </span>
        ),
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
                aria-label={`Actions for ${row.original.name}`}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => openEditProduct(row.original)}>
                Edit
              </DropdownMenuItem>
              <PermissionGuard permissions={["catalog:write"]}>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  disabled={row.original.status === "archived"}
                  onSelect={() => onArchive([row.original.id])}
                >
                  Archive
                </DropdownMenuItem>
              </PermissionGuard>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [openEditProduct, onArchive],
  );

  return (
    <DataTable
      columns={columns}
      data={products}
      searchKey="name"
      searchPlaceholder="Search products…"
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle="No products"
      emptyDescription="Create a product to start selling from this catalog."
      getRowId={(row) => row.id}
      onExportCsv={(rows) =>
        exportToCsv(
          rows.map((row) => ({
            sku: row.sku,
            name: row.name,
            category: row.categoryName,
            type: row.productType,
            status: row.status,
            price: row.price,
            cost: row.cost,
            unit: row.baseUnit,
            branches: branchLabels(row.branchIds),
          })),
          "catalog-products",
        )
      }
      bulkActions={(selected) => (
        <PermissionGuard permissions={["catalog:write"]}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onArchive(
                selected
                  .filter((row) => row.status !== "archived")
                  .map((row) => row.id),
              )
            }
          >
            Archive selected
          </Button>
        </PermissionGuard>
      )}
    />
  );
}

export { CatalogTable };
