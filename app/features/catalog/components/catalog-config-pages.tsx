import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { catalogKeys } from "~/features/catalog/api/query-keys";
import {
  addUnit,
  createCategory,
  listCategoriesMutable,
  listUnitsMutable,
  updateProduct,
} from "~/features/catalog/data/catalog-store";
import { useProductsQuery } from "~/features/catalog/hooks/use-catalog-queries";
import { TAX_PROFILES } from "~/features/catalog/data/catalog-store";
import { formatMoney } from "~/features/catalog/types";
import { PageHeader } from "~/shared/components/page-primitives";
import { PermissionGuard } from "~/shared/components/permission-guard";
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

export function CategoriesPage() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: [...catalogKeys.all, "categories-mutable"],
    queryFn: listCategoriesMutable,
  });
  const [name, setName] = useState("");
  const create = useMutation({
    mutationFn: () => createCategory(name),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: catalogKeys.all });
      setName("");
      toast.success("Category created");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Categories"
        description="Organization-scoped product classification"
      />
      <div className="mx-page mb-4 flex max-w-md gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
        />
        <PermissionGuard permissions={["catalog:write"]}>
          <Button
            type="button"
            size="sm"
            disabled={!name.trim() || create.isPending}
            onClick={() => create.mutate()}
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        </PermissionGuard>
      </div>
      <div className="mx-page mb-4 overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-muted/80 text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-medium">Name</th>
              <th className="px-3 py-2 text-left font-medium">ID</th>
            </tr>
          </thead>
          <tbody>
            {(query.data ?? []).map((c) => (
              <tr key={c.id} className="border-b border-border">
                <td className="px-3 py-2 font-medium">{c.name}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {c.id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
      <div className="mx-page mb-4 flex max-w-md gap-2">
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
      <div className="mx-page mb-4 flex flex-wrap gap-2">
        {(query.data ?? []).map((u) => (
          <span
            key={u}
            className="rounded-md border border-border bg-card px-2.5 py-1 text-sm"
          >
            {u}
          </span>
        ))}
      </div>
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
      <div className="mx-page mb-4 overflow-x-auto rounded-md border border-border">
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
                  {formatMoney(p.price)}
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
      </div>

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
