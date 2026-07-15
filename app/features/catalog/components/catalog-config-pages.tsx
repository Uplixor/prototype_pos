import { Fragment, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { catalogKeys } from "~/features/catalog/api/query-keys";
import {
  addUnit,
  archiveCategory,
  createCategory,
  listCategoriesMutable,
  listUnitsMutable,
  updateCategory,
  updateProduct,
} from "~/features/catalog/data/catalog-store";
import { useProductsQuery } from "~/features/catalog/hooks/use-catalog-queries";
import { TAX_PROFILES } from "~/features/catalog/data/catalog-store";
import {
  formatProductPrice,
  type Category,
} from "~/features/catalog/types";
import {
  buildCategoryTree,
  flattenCategoryOptions,
  type CategoryTreeNode,
} from "~/features/catalog/utils/category-tree";
import { PageBody, PageHeader } from "~/shared/components/page-primitives";
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

function CategoryTreeRows({
  nodes,
  depth,
  onEdit,
  onAddChild,
  onArchive,
}: {
  nodes: CategoryTreeNode[];
  depth: number;
  onEdit: (category: Category) => void;
  onAddChild: (parentId: string) => void;
  onArchive: (id: string) => void;
}) {
  return (
    <>
      {nodes.map((node) => (
        <Fragment key={node.id}>
          <tr className="border-b border-border last:border-0 hover:bg-muted/40">
            <td className="px-3 py-2">
              <div
                className="flex min-w-0 items-center gap-1.5"
                style={{ paddingLeft: `${depth * 1.125}rem` }}
              >
                {depth > 0 ? (
                  <span
                    className="text-muted-foreground/70 select-none"
                    aria-hidden
                  >
                    └
                  </span>
                ) : null}
                <span className="truncate font-medium text-heading">
                  {node.name}
                </span>
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">
              {node.parentId ? "Child" : "Root"}
            </td>
            <td className="whitespace-nowrap px-3 py-2">
              <StatusBadge
                status={node.status === "active" ? "active" : "inactive"}
              />
            </td>
            <td className="px-3 py-2">
              <PermissionGuard permissions={["catalog:write"]}>
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => onAddChild(node.id)}
                  >
                    <Plus className="size-3.5" />
                    Child
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => onEdit(node)}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-muted-foreground"
                    disabled={node.status === "archived"}
                    onClick={() => onArchive(node.id)}
                  >
                    Archive
                  </Button>
                </div>
              </PermissionGuard>
            </td>
          </tr>
          <CategoryTreeRows
            nodes={node.children}
            depth={depth + 1}
            onEdit={onEdit}
            onAddChild={onAddChild}
            onArchive={onArchive}
          />
        </Fragment>
      ))}
    </>
  );
}

export function CategoriesPage() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: catalogKeys.categories(),
    queryFn: listCategoriesMutable,
  });
  const categories = query.data ?? [];
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const parentOptions = useMemo(
    () => flattenCategoryOptions(categories, { includeArchived: false }),
    [categories],
  );

  const [draft, setDraft] = useState<{
    id?: string;
    name: string;
    parentId: string | null;
  } | null>(null);

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: catalogKeys.all });
  };

  const create = useMutation({
    mutationFn: () =>
      createCategory({
        name: draft!.name,
        parentId: draft!.parentId,
      }),
    onSuccess: () => {
      invalidate();
      setDraft(null);
      toast.success("Category created");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: () =>
      updateCategory(draft!.id!, {
        name: draft!.name,
        parentId: draft!.parentId,
      }),
    onSuccess: () => {
      invalidate();
      setDraft(null);
      toast.success("Category updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const archive = useMutation({
    mutationFn: (id: string) => archiveCategory(id),
    onSuccess: () => {
      invalidate();
      toast.success("Category archived");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saving = create.isPending || update.isPending;

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Hierarchical product classification — path shown on catalog as Parent > Child"
        className="pb-3"
        actions={
          <PermissionGuard permissions={["catalog:write"]}>
            <Button
              type="button"
              size="sm"
              onClick={() => setDraft({ name: "", parentId: null })}
            >
              <Plus className="size-3.5" />
              New category
            </Button>
          </PermissionGuard>
        }
      />
      <PageBody className="overflow-x-auto rounded-md border border-border bg-card p-0">
        <table className="w-full min-w-[36rem] table-fixed text-sm">
          <colgroup>
            <col />
            <col className="w-24" />
            <col className="w-28" />
            <col className="w-56" />
          </colgroup>
          <thead className="bg-muted/60 text-[11px] tracking-wide text-muted-foreground uppercase">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-medium normal-case tracking-normal">
                Name
              </th>
              <th className="px-3 py-2 text-left font-medium normal-case tracking-normal">
                Level
              </th>
              <th className="px-3 py-2 text-left font-medium normal-case tracking-normal">
                Status
              </th>
              <th className="px-3 py-2 text-right font-medium normal-case tracking-normal">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tree.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-10 text-center text-sm text-muted-foreground"
                >
                  No categories yet
                </td>
              </tr>
            ) : (
              <CategoryTreeRows
                nodes={tree}
                depth={0}
                onEdit={(category) =>
                  setDraft({
                    id: category.id,
                    name: category.name,
                    parentId: category.parentId,
                  })
                }
                onAddChild={(parentId) => setDraft({ name: "", parentId })}
                onArchive={(id) => archive.mutate(id)}
              />
            )}
          </tbody>
        </table>
      </PageBody>

      <Sheet
        open={Boolean(draft)}
        onOpenChange={(open) => {
          if (!open) setDraft(null);
        }}
      >
        <SheetContent size="md">
          <SheetHeader>
            <SheetTitle>
              {draft?.id ? "Edit category" : "New category"}
            </SheetTitle>
          </SheetHeader>
          <SheetBody className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Name</label>
              <Input
                value={draft?.name ?? ""}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev,
                  )
                }
                placeholder="e.g. Wearables"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Parent</label>
              <Select
                value={draft?.parentId ?? "root"}
                onValueChange={(value) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          parentId: value === "root" ? null : value,
                        }
                      : prev,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Root category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">None (root)</SelectItem>
                  {parentOptions
                    .filter((option) => option.id !== draft?.id)
                    .map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </SheetBody>
          <SheetFooter>
            <Button
              type="button"
              size="sm"
              disabled={!draft?.name.trim() || saving}
              onClick={() => {
                if (draft?.id) update.mutate();
                else create.mutate();
              }}
            >
              {draft?.id ? "Save" : "Create"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function UnitsPage() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: [...catalogKeys.all, "units"],
    queryFn: listUnitsMutable,
  });
  const [unit, setUnit] = useState("");
  const create = useMutation({
    mutationFn: () => addUnit(unit),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...catalogKeys.all, "units"] });
      setUnit("");
      toast.success("Unit added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Units"
        description="Every Product requires an explicit base unit"
      />
      <PageBody className="space-y-3">
        <div className="flex max-w-md gap-2">
          <Input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="e.g. case"
          />
          <PermissionGuard permissions={["catalog:write"]}>
            <Button
              type="button"
              size="sm"
              disabled={!unit.trim() || create.isPending}
              onClick={() => create.mutate()}
            >
              Add
            </Button>
          </PermissionGuard>
        </div>
        <div className="flex flex-wrap gap-2">
          {(query.data ?? []).map((u) => (
            <span
              key={u}
              className="rounded-md border border-border bg-card px-2.5 py-1 text-sm"
            >
              {u}
            </span>
          ))}
        </div>
      </PageBody>
    </div>
  );
}

export function PricingPage() {
  const productsQuery = useProductsQuery();
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const product = (productsQuery.data ?? []).find((p) => p.id === editingId);
  const [price, setPrice] = useState(0);
  const [taxProfile, setTaxProfile] = useState<string>(TAX_PROFILES[0]);

  const save = useMutation({
    mutationFn: () =>
      updateProduct(editingId!, { price, taxProfile }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.products() });
      setEditingId(null);
      toast.success("Price updated — applies to future sales only");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Prices & Taxes"
        description="Price and tax changes apply to future sales only — completed Sale snapshots never change"
      />
      <PageBody className="overflow-x-auto rounded-md border border-border p-0">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-muted/80 text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-medium">Product</th>
              <th className="px-3 py-2 text-left font-medium">Price</th>
              <th className="px-3 py-2 text-left font-medium">Tax profile</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(productsQuery.data ?? []).map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="px-3 py-2">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.sku}</p>
                </td>
                <td className="px-3 py-2 tabular-nums">
                  {formatProductPrice(p)}
                </td>
                <td className="px-3 py-2 text-xs">{p.taxProfile}</td>
                <td className="px-3 py-2 text-right">
                  <PermissionGuard permissions={["catalog:write"]}>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(p.id);
                        setPrice(p.price);
                        setTaxProfile(p.taxProfile);
                      }}
                    >
                      Edit
                    </Button>
                  </PermissionGuard>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageBody>

      <Sheet
        open={Boolean(editingId)}
        onOpenChange={(open) => {
          if (!open) setEditingId(null);
        }}
      >
        <SheetContent size="md">
          <SheetHeader>
            <SheetTitle>Edit price · {product?.name}</SheetTitle>
          </SheetHeader>
          <SheetBody className="space-y-3">
            <Input
              type="number"
              step="0.01"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value) || 0)}
            />
            <Select value={taxProfile} onValueChange={setTaxProfile}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TAX_PROFILES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SheetBody>
          <SheetFooter>
            <Button
              type="button"
              size="sm"
              disabled={save.isPending}
              onClick={() => save.mutate()}
            >
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
