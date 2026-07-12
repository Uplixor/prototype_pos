import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import type { Resolver } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useProductsQuery } from "~/features/catalog/hooks/use-catalog-queries";
import {
  useConfirmReceiptMutation,
  useCreatePurchaseMutation,
  useCreateSupplierMutation,
  usePurchasesQuery,
  useSuppliersQuery,
} from "~/features/purchasing/api/purchasing-mutations";
import {
  purchaseFormSchema,
  supplierFormSchema,
  type PurchaseFormValues,
  type SupplierFormValues,
} from "~/features/purchasing/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/form/form";
import { useAppForm } from "~/shared/components/form/use-app-form";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select";
import { Textarea } from "~/shared/components/ui/textarea";
import { useDrawer } from "~/shared/providers/drawer-provider";
import { useWorkspace } from "~/shared/providers/workspace-provider";

export function SupplierForm({ drawerId }: { drawerId: string }) {
  const { closeDrawer } = useDrawer();
  const mutation = useCreateSupplierMutation();
  const form = useAppForm<SupplierFormValues>({
    defaultValues: { name: "", email: "", phone: "" },
    resolver: zodResolver(supplierFormSchema) as Resolver<SupplierFormValues>,
  });

  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col gap-4"
        onSubmit={form.handleSubmit(async (values) => {
          await mutation.mutateAsync(values);
          closeDrawer(drawerId);
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-auto flex justify-end gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => closeDrawer(drawerId)}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Create supplier"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function PurchaseForm({ drawerId }: { drawerId: string }) {
  const { closeDrawer } = useDrawer();
  const { organization, branch } = useWorkspace();
  const suppliersQuery = useSuppliersQuery();
  const productsQuery = useProductsQuery();
  const createMutation = useCreatePurchaseMutation();

  const form = useAppForm<PurchaseFormValues>({
    defaultValues: {
      supplierId: "",
      notes: "",
      items: [{ productId: "", orderedQty: 1, unitCost: 0 }],
    },
    resolver: zodResolver(purchaseFormSchema) as Resolver<PurchaseFormValues>,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const activeSuppliers = useMemo(
    () => (suppliersQuery.data ?? []).filter((s) => s.status === "active"),
    [suppliersQuery.data],
  );
  const products = useMemo(
    () =>
      (productsQuery.data ?? []).filter(
        (p) => p.status === "active" && p.trackInventory,
      ),
    [productsQuery.data],
  );

  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col"
        onSubmit={form.handleSubmit(async (values) => {
          await createMutation.mutateAsync({
            organizationId: organization.id,
            branchId: branch.id,
            supplierId: values.supplierId,
            notes: values.notes,
            items: values.items,
          });
          closeDrawer(drawerId);
        })}
      >
        <div className="flex-1 space-y-4">
          <p className="rounded-md border border-border bg-muted px-2.5 py-1.5 text-[11px] text-muted-foreground">
            Creating a purchase records intent only — stock increases only after
            Goods Receipt. Branch: {branch.code}
          </p>
          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Supplier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {activeSuppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Lines</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ productId: "", orderedQty: 1, unitCost: 0 })
                }
              >
                <Plus className="size-3.5" />
                Add
              </Button>
            </div>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-[1fr_70px_80px_28px] gap-2"
              >
                <FormField
                  control={form.control}
                  name={`items.${index}.productId`}
                  render={({ field: f }) => (
                    <FormItem>
                      <Select value={f.value} onValueChange={f.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.orderedQty`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" min={1} {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.unitCost`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" min={0} step="0.01" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6 flex justify-end gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => closeDrawer(drawerId)}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating…" : "Create purchase"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ReceiptForm({
  drawerId,
  purchaseId: initialPurchaseId,
}: {
  drawerId: string;
  purchaseId?: string;
}) {
  const { closeDrawer } = useDrawer();
  const { user } = useWorkspace();
  const purchasesQuery = usePurchasesQuery();
  const confirmMutation = useConfirmReceiptMutation();
  const [purchaseId, setPurchaseId] = useState(initialPurchaseId ?? "");
  const [qtys, setQtys] = useState<Record<string, number>>({});

  const purchase = (purchasesQuery.data ?? []).find((p) => p.id === purchaseId);
  const receivable =
    purchase &&
    (purchase.status === "ordered" || purchase.status === "partially_received");

  return (
    <div className="flex h-full flex-col gap-4">
      <p className="rounded-md border border-border bg-muted px-2.5 py-1.5 text-[11px] text-muted-foreground">
        Confirming receipt creates inbound Stock Movements. Purchases alone never
        increase available stock.
      </p>
      <div className="space-y-1.5">
        <label className="text-xs font-medium">Purchase</label>
        <Select
          value={purchaseId}
          onValueChange={(id) => {
            setPurchaseId(id);
            setQtys({});
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select ordered purchase" />
          </SelectTrigger>
          <SelectContent>
            {(purchasesQuery.data ?? [])
              .filter(
                (p) =>
                  p.status === "ordered" || p.status === "partially_received",
              )
              .map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.purchaseNumber} · {p.supplierName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      {receivable ? (
        <ul className="space-y-2">
          {purchase.items.map((item) => {
            const remaining = item.orderedQty - item.receivedQty;
            return (
              <li
                key={item.id}
                className="grid grid-cols-[1fr_88px] items-center gap-2 rounded-md border border-border px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{item.productName}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Remaining {remaining} {item.unit}
                  </p>
                </div>
                <Input
                  type="number"
                  min={0}
                  max={remaining}
                  value={qtys[item.productId] ?? remaining}
                  onChange={(e) =>
                    setQtys((prev) => ({
                      ...prev,
                      [item.productId]: Math.max(
                        0,
                        Math.min(remaining, Number(e.target.value) || 0),
                      ),
                    }))
                  }
                />
              </li>
            );
          })}
        </ul>
      ) : null}
      <div className="mt-auto flex justify-end gap-2 border-t border-border pt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => closeDrawer(drawerId)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!receivable || confirmMutation.isPending}
          onClick={() => {
            if (!purchase) return;
            void confirmMutation
              .mutateAsync({
                purchaseId: purchase.id,
                actorName: user.name,
                lines: purchase.items.map((item) => ({
                  productId: item.productId,
                  quantity:
                    qtys[item.productId] ??
                    item.orderedQty - item.receivedQty,
                })),
              })
              .then(() => closeDrawer(drawerId));
          }}
        >
          {confirmMutation.isPending ? "Confirming…" : "Confirm receipt"}
        </Button>
      </div>
    </div>
  );
}
