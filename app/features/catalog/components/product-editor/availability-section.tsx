import type { Control } from "react-hook-form";
import { EditorSection } from "~/features/catalog/components/product-editor/editor-section";
import { BRANCH_OPTIONS, UNITS } from "~/features/catalog/data/catalog-store";
import type { ProductFormValues } from "~/features/catalog/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/shared/components/form/form";
import { Checkbox } from "~/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select";
import { Switch } from "~/shared/components/ui/switch";

type Props = {
  control: Control<ProductFormValues>;
};

export function AvailabilitySection({ control }: Props) {
  return (
    <EditorSection
      id="availability"
      title="Availability"
      description="Where this product can be sold"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          control={control}
          name="baseUnit"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Base unit
              </label>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-9">
                    <SelectValue />
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
          control={control}
          name="trackInventory"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-md border border-border/80 px-3 py-2">
              <div>
                <p className="text-[12px] font-medium">Track inventory</p>
                <p className="text-[10px] text-muted-foreground">
                  Policy only — balances live in Inventory
                </p>
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
      </div>

      <FormField
        control={control}
        name="branchIds"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground">
              Branches
            </label>
            <div className="flex flex-wrap gap-1.5">
              {BRANCH_OPTIONS.map((branch) => {
                const checked = field.value.includes(branch.id);
                return (
                  <label
                    key={branch.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-border/80 px-2.5 py-2 text-xs"
                  >
                    <FormControl>
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
                    </FormControl>
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
    </EditorSection>
  );
}
