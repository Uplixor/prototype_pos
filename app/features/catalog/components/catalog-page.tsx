import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useArchiveProductsMutation } from "~/features/catalog/api/catalog-mutations";
import { CatalogTable } from "~/features/catalog/components/catalog-table";
import {
  useCategoriesQuery,
  useProductsQuery,
} from "~/features/catalog/hooks/use-catalog-queries";
import { useProductDrawer } from "~/features/catalog/hooks/use-product-drawer";
import { PRODUCT_STATUS_LABELS } from "~/features/catalog/schema";
import type { ProductStatus } from "~/features/catalog/types";
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

type StatusFilter = ProductStatus | "all";

function CatalogPage() {
  const { openCreateProduct } = useProductDrawer();
  const productsQuery = useProductsQuery();
  const categoriesQuery = useCategoriesQuery();
  const archiveMutation = useArchiveProductsMutation();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [archiveIds, setArchiveIds] = useState<string[] | null>(null);

  const filtered = useMemo(() => {
    const products = productsQuery.data ?? [];
    return products.filter((product) => {
      if (statusFilter !== "all" && product.status !== statusFilter) {
        return false;
      }
      if (categoryFilter !== "all" && product.categoryId !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [productsQuery.data, statusFilter, categoryFilter]);

  const activeCount =
    productsQuery.data?.filter((p) => p.status === "active").length ?? 0;
  const draftCount =
    productsQuery.data?.filter((p) => p.status === "draft").length ?? 0;

  function requestArchive(ids: string[]) {
    const actionable = ids.filter(Boolean);
    if (actionable.length === 0) return;
    setArchiveIds(actionable);
  }

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Catalog"
        description={`${activeCount} active · ${draftCount} draft · Organization-scoped products`}
        actions={
          <PermissionGuard permissions={["catalog:write"]}>
            <Button type="button" size="sm" onClick={openCreateProduct}>
              <Plus className="size-3.5" />
              New product
            </Button>
          </PermissionGuard>
        }
      />

      <FilterBar>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="w-[140px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(
              Object.keys(PRODUCT_STATUS_LABELS) as Array<
                keyof typeof PRODUCT_STATUS_LABELS
              >
            ).map((status) => (
              <SelectItem key={status} value={status}>
                {PRODUCT_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]" aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {(categoriesQuery.data ?? []).map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="ml-auto text-xs text-muted-foreground">
          {filtered.length} shown
        </p>
      </FilterBar>

      <div className="mx-page mb-4 overflow-hidden rounded-md border border-border bg-card">
        <CatalogTable
          products={filtered}
          isLoading={productsQuery.isLoading}
          isError={productsQuery.isError}
          onRetry={() => void productsQuery.refetch()}
          onArchive={requestArchive}
        />
      </div>

      <ConfirmDialog
        open={Boolean(archiveIds)}
        onOpenChange={(open) => {
          if (!open) setArchiveIds(null);
        }}
        title={
          archiveIds?.length === 1
            ? "Archive product?"
            : `Archive ${archiveIds?.length ?? 0} products?`
        }
        description="Archived products remain available for history but cannot be selected for new sales. This does not delete records."
        confirmLabel="Archive"
        variant="destructive"
        loading={archiveMutation.isPending}
        onConfirm={() => {
          if (!archiveIds) return;
          archiveMutation.mutate(archiveIds, {
            onSuccess: () => setArchiveIds(null),
          });
        }}
      />
    </div>
  );
}

export { CatalogPage };
