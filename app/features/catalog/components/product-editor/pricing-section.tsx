import type { Control, UseFormWatch } from "react-hook-form";
import { EditorSection } from "~/features/catalog/components/product-editor/editor-section";
import { TAX_PROFILES } from "~/features/catalog/data/catalog-store";
import type { ProductFormValues } from "~/features/catalog/schema";
import { formatMoney } from "~/features/catalog/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/shared/components/form/form";
import { Input } from "~/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select";

type Props = {
  control: Control<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
};

export function PricingSection({ control, watch }: Props) {
  const price = Number(watch("price")) || 0;
  const cost = Number(watch("cost")) || 0;
  const margin =
    price > 0 ? Math.round(((price - cost) / price) * 1000) / 10 : null;

  return (
    <EditorSection id="pricing" title="Pricing">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Base price
              </label>
              <FormControl>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                    $
                  </span>
                  <Input
                    className="h-9 pl-6"
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="compareAtPrice"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Compare-at
              </label>
              <FormControl>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                    $
                  </span>
                  <Input
                    className="h-9 pl-6"
                    type="number"
                    step="0.01"
                    min="0"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="cost"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Cost
              </label>
              <FormControl>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                    $
                  </span>
                  <Input
                    className="h-9 pl-6"
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">
            Margin
          </label>
          <div className="flex h-9 items-center rounded-md border border-border bg-muted/50 px-3 text-sm tabular-nums">
            {margin === null ? "—" : `${margin}%`}
          </div>
        </div>
        <FormField
          control={control}
          name="taxProfile"
          render={({ field }) => (
            <FormItem className="col-span-2 space-y-1 lg:col-span-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Tax class
              </label>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-9">
                    <SelectValue />
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
      </div>

      <p className="text-[11px] text-muted-foreground">
        Base {formatMoney(price)} · Cost {formatMoney(cost)} — variant prices
        can override per SKU
      </p>
    </EditorSection>
  );
}
