import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import {
  useAdjustableProductsQuery,
  useCreateAdjustmentMutation,
} from "~/features/inventory/api/inventory-mutations";
import {
  ADJUSTMENT_REASONS,
  stockAdjustmentSchema,
  type StockAdjustmentValues,
} from "~/features/inventory/schema";
import { useAppForm } from "~/shared/components/form/use-app-form";
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
import { Input } from "~/shared/components/ui/input";
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

export type AdjustmentFormProps = {
  drawerId: string;
  defaultProductId?: string;
};

function AdjustmentForm({ drawerId, defaultProductId }: AdjustmentFormProps) {
  const { closeDrawer } = useDrawer();
  const { organization, branch, user } = useWorkspace();
  const productsQuery = useAdjustableProductsQuery(branch.id);
  const createMutation = useCreateAdjustmentMutation();

  const form = useAppForm<StockAdjustmentValues>({
    defaultValues: {
      productId: defaultProductId ?? "",
      quantity: -1,
      reason: "Count correction",
      notes: "",
    },
    resolver: zodResolver(
      stockAdjustmentSchema,
    ) as Resolver<StockAdjustmentValues>,
    draftKey: `inventory.adjustment.draft.${branch.id}`,
  });

  const products = productsQuery.data ?? [];

  async function onSubmit(values: StockAdjustmentValues) {
    await createMutation.mutateAsync({
      organizationId: organization.id,
      branchId: branch.id,
      productId: values.productId,
      quantity: values.quantity,
      reason: values.reason,
      notes: values.notes,
      actorName: user.name,
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
            Adjustments create an immutable Stock Movement. Balances are
            projections — never edited directly. Branch:{" "}
            <span className="font-medium text-foreground">
              {branch.name} ({branch.code})
            </span>
          </p>

          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} · {product.sku}
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity delta</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    placeholder="-1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Use negative for shrink/damage, positive for found stock
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Reason" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ADJUSTMENT_REASONS.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
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
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Optional detail (required for Other)"
                    {...field}
                  />
                </FormControl>
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
            onClick={() => closeDrawer(drawerId)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={createMutation.isPending || products.length === 0}
          >
            {createMutation.isPending ? "Recording…" : "Record adjustment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { AdjustmentForm };
