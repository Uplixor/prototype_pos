import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import type { Resolver } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import {
  useCreateSaleMutation,
  useSellableProductsQuery,
} from "~/features/sales/api/sales-mutations";
import {
  createSaleSchema,
  type CreateSaleValues,
} from "~/features/sales/schema";
import { formatMoney } from "~/features/sales/types";
import {
  activeVariants,
  formatProductPrice,
  type Product,
} from "~/features/catalog/types";
import { useAppForm } from "~/shared/components/form/use-app-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/form/form";
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

function unitPrice(product: Product, variantId?: string): number {
  const variants = activeVariants(product);
  if (variants.length === 0) return product.price;
  const match = variantId
    ? variants.find((v) => v.id === variantId)
    : variants[0];
  return match?.price ?? product.price;
}

export type CreateSaleFormProps = {
  drawerId: string;
};

function CreateSaleForm({ drawerId }: CreateSaleFormProps) {
  const { closeDrawer } = useDrawer();
  const { organization, branch } = useWorkspace();
  const sellableQuery = useSellableProductsQuery(branch.id);
  const createMutation = useCreateSaleMutation();

  const form = useAppForm<CreateSaleValues>({
    defaultValues: {
      customerName: "Walk-in",
      notes: "",
      items: [{ productId: "", variantId: undefined, quantity: 1 }],
    },
    resolver: zodResolver(createSaleSchema) as Resolver<CreateSaleValues>,
    draftKey: `sales.create.draft.${branch.id}`,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const products = sellableQuery.data ?? [];
  const watchedItems = form.watch("items");

  const estimate = useMemo(() => {
    return watchedItems.reduce((sum, line) => {
      const product = products.find((item) => item.id === line.productId);
      if (!product) return sum;
      return (
        sum + unitPrice(product, line.variantId) * (Number(line.quantity) || 0)
      );
    }, 0);
  }, [watchedItems, products]);

  async function onSubmit(values: CreateSaleValues) {
    await createMutation.mutateAsync({
      organizationId: organization.id,
      branchId: branch.id,
      customerName: values.customerName,
      notes: values.notes,
      items: values.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId || undefined,
        quantity: item.quantity,
      })),
    });
    closeDrawer(drawerId);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col"
      >
        <div className="flex-1 space-y-4">
          <p className="rounded-md border border-border bg-muted px-2.5 py-1.5 text-[11px] text-muted-foreground">
            Branch locked to <span className="font-medium text-foreground">{branch.name}</span> ({branch.code}).
            Prices snapshot from Catalog at add time.
          </p>

          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <FormControl>
                  <Input placeholder="Customer name" autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Line items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ productId: "", variantId: undefined, quantity: 1 })
                }
              >
                <Plus className="size-3.5" />
                Add line
              </Button>
            </div>

            {fields.map((field, index) => {
              const productId = watchedItems[index]?.productId;
              const product = products.find((p) => p.id === productId);
              const variants = product ? activeVariants(product) : [];
              return (
                <div key={field.id} className="space-y-2 rounded-md border border-border p-2">
                  <div className="grid grid-cols-[1fr_72px_32px] gap-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.productId`}
                      render={({ field: productField }) => (
                        <FormItem>
                          <Select
                            value={productField.value}
                            onValueChange={(value) => {
                              productField.onChange(value);
                              const next = products.find((p) => p.id === value);
                              const nextVariants = next
                                ? activeVariants(next)
                                : [];
                              form.setValue(
                                `items.${index}.variantId`,
                                nextVariants.length === 1
                                  ? nextVariants[0]!.id
                                  : undefined,
                              );
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name} · {formatProductPrice(item)}
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
                      name={`items.${index}.quantity`}
                      render={({ field: qtyField }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              step={1}
                              {...qtyField}
                            />
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
                      aria-label="Remove line"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  {variants.length > 1 ? (
                    <FormField
                      control={form.control}
                      name={`items.${index}.variantId`}
                      render={({ field: variantField }) => (
                        <FormItem>
                          <Select
                            value={variantField.value ?? ""}
                            onValueChange={variantField.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select variant" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {variants.map((variant) => (
                                <SelectItem key={variant.id} value={variant.id}>
                                  {variant.name} · {formatMoney(variant.price)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="Optional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
            <span className="text-muted-foreground">Estimated subtotal</span>
            <span className="font-semibold tabular-nums">
              {formatMoney(estimate)}
            </span>
          </div>
        </div>

        <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-end gap-2 border-t border-border bg-card px-4 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => closeDrawer(drawerId)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={createMutation.isPending || products.length === 0}
          >
            {createMutation.isPending ? "Creating…" : "Create sale"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { CreateSaleForm };
