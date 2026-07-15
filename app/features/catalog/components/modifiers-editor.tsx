import { Plus, Trash2 } from "lucide-react";
import type { Control } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { ProductFormValues } from "~/features/catalog/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/form/form";
import { Button } from "~/shared/components/ui/button";
import { Checkbox } from "~/shared/components/ui/checkbox";
import { Input } from "~/shared/components/ui/input";

type ModifiersEditorProps = {
  control: Control<ProductFormValues>;
};

function newGroupId() {
  return `mod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function ModifiersEditor({ control }: ModifiersEditorProps) {
  const groups = useFieldArray({ control, name: "modifiers" });

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-heading">Modifiers & options</h3>
          <p className="text-[11px] text-muted-foreground">
            Optional add-ons at checkout — separate from SKU variants
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            groups.append({
              id: newGroupId(),
              name: "",
              required: false,
              multiSelect: false,
              options: [{ id: `${newGroupId()}_opt`, name: "", priceDelta: 0 }],
            })
          }
        >
          <Plus className="size-3.5" />
          Add group
        </Button>
      </div>

      {groups.fields.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
          No modifiers — add groups like Warranty or Extra toppings
        </p>
      ) : (
        groups.fields.map((group, groupIndex) => (
          <ModifierGroupEditor
            key={group.id}
            control={control}
            groupIndex={groupIndex}
            onRemove={() => groups.remove(groupIndex)}
          />
        ))
      )}
    </div>
  );
}

function ModifierGroupEditor({
  control,
  groupIndex,
  onRemove,
}: {
  control: Control<ProductFormValues>;
  groupIndex: number;
  onRemove: () => void;
}) {
  const options = useFieldArray({
    control,
    name: `modifiers.${groupIndex}.options`,
  });

  return (
    <div className="space-y-3 rounded-md border border-border p-3">
      <div className="flex items-start gap-2">
        <FormField
          control={control}
          name={`modifiers.${groupIndex}.name`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Group name</FormLabel>
              <FormControl>
                <Input placeholder="Extended Warranty" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="mt-6"
          aria-label="Remove modifier group"
          onClick={onRemove}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <FormField
          control={control}
          name={`modifiers.${groupIndex}.required`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(value) => field.onChange(Boolean(value))}
                />
              </FormControl>
              <FormLabel className="font-normal">Required</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`modifiers.${groupIndex}.multiSelect`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(value) => field.onChange(Boolean(value))}
                />
              </FormControl>
              <FormLabel className="font-normal">Allow multiple</FormLabel>
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        {options.fields.map((option, optionIndex) => (
          <div key={option.id} className="flex items-start gap-2">
            <FormField
              control={control}
              name={`modifiers.${groupIndex}.options.${optionIndex}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Option name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`modifiers.${groupIndex}.options.${optionIndex}.priceDelta`}
              render={({ field }) => (
                <FormItem className="w-28">
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="+0.00"
                      {...field}
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
              aria-label="Remove option"
              disabled={options.fields.length <= 1}
              onClick={() => options.remove(optionIndex)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            options.append({
              id: `${newGroupId()}_opt`,
              name: "",
              priceDelta: 0,
            })
          }
        >
          <Plus className="size-3.5" />
          Add option
        </Button>
      </div>
    </div>
  );
}

export { ModifiersEditor };
