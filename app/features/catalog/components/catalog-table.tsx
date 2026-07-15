import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { BRANCH_OPTIONS } from "~/features/catalog/data/catalog-store";
import { ProductImage } from "~/features/catalog/components/product-image";
import { useProductDrawer } from "~/features/catalog/hooks/use-product-drawer";
import { PRODUCT_TYPE_LABELS } from "~/features/catalog/schema";
import {
  formatProductPrice,
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
  const { openViewProduct, openEditProduct } = useProductDrawer();

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product",
        size: 240,
        maxSize: 280,
        cell: ({ row }) => {
          const { name, sku, imageUrl } = row.original;
          return (
            <button
              type="button"
              className="flex w-full max-w-[15rem] items-center gap-2.5 text-left sm:max-w-[18rem]"
              title={name}
              onClick={() => openViewProduct(row.original)}
            >
              <ProductImage
                src={imageUrl}
                alt={name}
                size="sm"
                className="shrink-0"
              />
              <span className="min-w-0 flex-1 overflow-hidden">
                <span className="block truncate font-medium text-primary hover:underline">
                  {name}
                </span>
                <span className="block truncate font-mono text-[11px] text-muted-foreground">
                  {sku}
                </span>
              </span>
            </button>
          );
        },
      },
      {
        accessorKey: "categoryName",
        header: "Category",
        size: 140,
        cell: ({ row }) => (
          <span className="block max-w-[9rem] truncate text-xs" title={row.original.categoryName}>
            {row.original.categoryName}
          </span>
        ),
      },
      {
        accessorKey: "productType",
        header: "Type",
        size: 100,
        cell: ({ row }) => PRODUCT_TYPE_LABELS[row.original.productType],
      },
      {
        id: "variants",
        header: "Variants",
        size: 80,
        cell: ({ row }) => {
          const count = row.original.variants.length;
          return (
            <span className="text-xs text-muted-foreground">
              {count === 0 ? "—" : count}
            </span>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        size: 100,
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatProductPrice(row.original)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        cell: ({ row }) => (
          <StatusBadge status={productStatusToBadge(row.original.status)} />
        ),
      },
      {
        id: "branches",
        header: "Branches",
        size: 120,
        cell: ({ row }) => (
          <span
            className="block max-w-[7rem] truncate text-xs text-muted-foreground"
            title={branchLabels(row.original.branchIds)}
          >
            {branchLabels(row.original.branchIds)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        size: 48,
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
              <DropdownMenuItem onSelect={() => openViewProduct(row.original)}>
                View
              </DropdownMenuItem>
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
    [openViewProduct, openEditProduct, onArchive],
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
            variants: row.variants.length,
            unit: row.baseUnit,
            brand: row.brand ?? "",
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
