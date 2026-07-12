import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "~/features/catalog/api/catalog-mutations";
import {
  BRANCH_OPTIONS,
  CATALOG_CATEGORIES,
  TAX_PROFILES,
  UNITS,
} from "~/features/catalog/data/catalog-store";
import {
  PRODUCT_STATUS_LABELS,
  PRODUCT_TYPE_LABELS,
  productFormSchema,
  type ProductFormValues,
} from "~/features/catalog/schema";
import type { Product } from "~/features/catalog/types";
import {
  clearFormDraft,
  useAppForm,
} from "~/shared/components/form/use-app-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/form/form";
import { Button } from "~/shared/components/ui/button";
import { Checkbox } from "~/shared/components/ui/checkbox";
import { Input } from "~/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select";
import { Switch } from "~/shared/components/ui/switch";
import { Textarea } from "~/shared/components/ui/textarea";
import { useDrawer } from "~/shared/providers/drawer-provider";

function toFormValues(product?: Product | null): ProductFormValues {
  if (!product) {
    return {
      name: "",
      sku: "",
      description: "",
      categoryId: CATALOG_CATEGORIES[0]?.id ?? "",
      productType: "physical",
      status: "draft",
      baseUnit: "each",
      price: 0,
      cost: 0,
      taxProfile: TAX_PROFILES[0],
      trackInventory: true,
      branchIds: ["br_hq"],
    };
  }

  return {
    name: product.name,
    sku: product.sku,
    description: product.description,
    categoryId: product.categoryId,
    productType: product.productType,
    status: product.status,
    baseUnit: product.baseUnit,
    price: product.price,
    cost: product.cost,
    taxProfile: product.taxProfile,
    trackInventory: product.trackInventory,
    branchIds: product.branchIds,
  };
}

export type ProductFormProps = {
  product?: Product | null;
  drawerId: string;
};

function ProductForm({ product, drawerId }: ProductFormProps) {
  const { closeDrawer } = useDrawer();
  const isEdit = Boolean(product);
  const draftKey = isEdit
    ? `catalog.product.draft.${product!.id}`
    : "catalog.product.draft.new";

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation(product?.id ?? "");

  const form = useAppForm<ProductFormValues>({
    defaultValues: toFormValues(product),
    resolver: zodResolver(productFormSchema) as Resolver<ProductFormValues>,
    draftKey,
  });

  const pending = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: ProductFormValues) {
    if (isEdit && product) {
      await updateMutation.mutateAsync(values);
    } else {
      await createMutation.mutateAsync(values);
    }
    clearFormDraft(draftKey);
    closeDrawer(drawerId);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col"
      >
        <div className="flex-1 space-y-4">
          {(form.isDraft || form.isDirty) && (
            <p className="rounded-md border border-border bg-muted px-2.5 py-1.5 text-[11px] text-muted-foreground">
              {form.isDirty
                ? "Unsaved changes — draft autosaves locally"
                : "Restored local draft"}
            </p>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="SKU-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Optional description"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATALOG_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(
                        Object.keys(PRODUCT_TYPE_LABELS) as Array<
                          keyof typeof PRODUCT_TYPE_LABELS
                        >
                      ).map((type) => (
                        <SelectItem key={type} value={type}>
                          {PRODUCT_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="baseUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base unit</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="taxProfile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax profile</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tax profile" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TAX_PROFILES.map((profile) => (
                      <SelectItem key={profile} value={profile}>
                        {profile}
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
            name="trackInventory"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Track inventory</FormLabel>
                  <FormDescription>
                    Catalog identity only — balances live in Inventory
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="branchIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch availability</FormLabel>
                <FormDescription>
                  Product remains organization-owned; availability is per branch
                </FormDescription>
                <div className="space-y-2 rounded-md border border-border p-3">
                  {BRANCH_OPTIONS.map((branch) => {
                    const checked = field.value.includes(branch.id);
                    return (
                      <label
                        key={branch.id}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) => {
                            if (value) {
                              field.onChange([...field.value, branch.id]);
                            } else {
                              field.onChange(
                                field.value.filter((id) => id !== branch.id),
                              );
                            }
                          }}
                        />
                        <span>
                          {branch.name}{" "}
                          <span className="text-muted-foreground">
                            ({branch.code})
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-end gap-2 border-t border-border bg-card px-4 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => closeDrawer(drawerId)}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={pending}>
            {pending
              ? "Saving…"
              : isEdit
                ? "Save product"
                : "Create product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { ProductForm };
