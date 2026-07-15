import { useState } from "react";
import { Plus, Trash2, Wand2 } from "lucide-react";
import type {
  Control,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { VariantImageField } from "~/features/catalog/components/variant-image-field";
import type { ProductFormValues } from "~/features/catalog/schema";
import { PRODUCT_STATUS_LABELS } from "~/features/catalog/schema";
import {
  generateVariantMatrix,
  newOptionAxis,
} from "~/features/catalog/utils/variant-matrix";
import {
  FormControl,
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

type VariantManagerProps = {
  control: Control<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
};

function OptionAxisCard({
  axisIndex,
  control,
  values,
  onAddValues,
  onRemoveValue,
  onRemoveAxis,
}: {
  axisIndex: number;
  control: Control<ProductFormValues>;
  values: string[];
  onAddValues: (raw: string) => boolean;
  onRemoveValue: (valueIndex: number) => void;
  onRemoveAxis: () => void;
}) {
  const [draft, setDraft] = useState("");

  function commitDraft() {
    if (!draft.trim()) return;
    const added = onAddValues(draft);
    if (added) setDraft("");
  }

  return (
    <div className="space-y-3 rounded-md border border-border p-3">
      <div className="flex items-start gap-2">
        <FormField
          control={control}
          name={`optionAxes.${axisIndex}.name`}
          render={({ field: nameField }) => (
            <FormItem className="flex-1">
              <FormLabel>Option name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Color (not each color)"
                  {...nameField}
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
          className="mt-6"
          aria-label="Remove option"
          onClick={onRemoveAxis}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium">Values</p>
        <p className="text-[11px] text-muted-foreground">
          Add every value under this option — e.g. Black, Blue, Red
        </p>

        {values.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {values.map((value, valueIndex) => (
              <button
                key={`${value}-${valueIndex}`}
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-xs"
                onClick={() => onRemoveValue(valueIndex)}
                title="Remove value"
              >
                {value}
                <span className="text-muted-foreground">×</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-md border border-dashed border-border px-2 py-2 text-[11px] text-muted-foreground">
            No values yet — type below and click Add
          </p>
        )}

        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Black, Blue…"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                commitDraft();
              }
            }}
            onBlur={commitDraft}
          />
          <Button type="button" size="sm" variant="outline" onClick={commitDraft}>
            Add
          </Button>
        </div>
        <FormField
          control={control}
          name={`optionAxes.${axisIndex}.values`}
          render={() => <FormMessage />}
        />
      </div>
    </div>
  );
}

function VariantManager({ control, watch, setValue }: VariantManagerProps) {
  const axesArray = useFieldArray({ control, name: "optionAxes" });
  const variantsArray = useFieldArray({ control, name: "variants" });

  const baseSku = watch("sku");
  const basePrice = watch("price");
  const baseCost = watch("cost");
  const axes = watch("optionAxes");
  const variants = watch("variants");

  function addValues(axisIndex: number, raw: string): boolean {
    const parts = raw
      .split(/[,|]/)
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length === 0) return false;

    const current = axes[axisIndex]?.values ?? [];
    const next = [...current];
    let added = false;
    for (const value of parts) {
      if (next.some((v) => v.toLowerCase() === value.toLowerCase())) continue;
      next.push(value);
      added = true;
    }
    if (!added) return false;
    setValue(`optionAxes.${axisIndex}.values`, next, {
      shouldDirty: true,
      shouldValidate: true,
    });
    return true;
  }

  function removeValue(axisIndex: number, valueIndex: number) {
    const current = axes[axisIndex]?.values ?? [];
    setValue(
      `optionAxes.${axisIndex}.values`,
      current.filter((_, i) => i !== valueIndex),
      { shouldDirty: true, shouldValidate: true },
    );
  }

  function regenerate() {
    const next = generateVariantMatrix({
      baseSku: baseSku || "SKU",
      basePrice: Number(basePrice) || 0,
      baseCost: Number(baseCost) || 0,
      axes: axes ?? [],
      existing: variants ?? [],
    });
    setValue("variants", next, { shouldDirty: true, shouldValidate: true });
  }

  const canGenerate = (axes ?? []).some(
    (axis) => axis.name.trim() && axis.values.length > 0,
  );

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium text-heading">Option axes</h3>
            <p className="text-[11px] text-muted-foreground">
              One row per attribute (Color, Size). Put all colors on the Color
              option — then generate combinations.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => axesArray.append(newOptionAxis(""))}
          >
            <Plus className="size-3.5" />
            Add option
          </Button>
        </div>

        {axesArray.fields.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
            No options yet — products without options sell as a single SKU
          </p>
        ) : (
          <div className="space-y-3">
            {axesArray.fields.map((field, axisIndex) => (
              <OptionAxisCard
                key={field.id}
                axisIndex={axisIndex}
                control={control}
                values={axes[axisIndex]?.values ?? []}
                onAddValues={(raw) => addValues(axisIndex, raw)}
                onRemoveValue={(valueIndex) =>
                  removeValue(axisIndex, valueIndex)
                }
                onRemoveAxis={() => axesArray.remove(axisIndex)}
              />
            ))}
          </div>
        )}

        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={!canGenerate}
          onClick={regenerate}
        >
          <Wand2 className="size-3.5" />
          Generate variant matrix
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-heading">
              Variants ({variantsArray.fields.length})
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Hover a thumbnail to set a per-variant image URL
            </p>
          </div>
        </div>

        {variantsArray.fields.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
            Generate options to create SKUs, or leave empty for a single-SKU
            product
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[40rem] text-xs">
              <thead className="bg-muted/80 text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-2 py-1.5 text-left font-medium">Image</th>
                  <th className="px-2 py-1.5 text-left font-medium">Suffix</th>
                  <th className="px-2 py-1.5 text-left font-medium">Name</th>
                  <th className="px-2 py-1.5 text-left font-medium">SKU</th>
                  <th className="px-2 py-1.5 text-left font-medium">Price</th>
                  <th className="px-2 py-1.5 text-left font-medium">Cost</th>
                  <th className="px-2 py-1.5 text-left font-medium">Status</th>
                  <th className="px-2 py-1.5 text-right font-medium" />
                </tr>
              </thead>
              <tbody>
                {variantsArray.fields.map((field, index) => (
                  <tr key={field.id} className="border-b border-border">
                    <td className="px-2 py-1.5">
                      <FormField
                        control={control}
                        name={`variants.${index}.imageUrl`}
                        render={({ field: imageField }) => (
                          <FormItem>
                            <FormControl>
                              <VariantImageField
                                value={imageField.value}
                                fallbackUrl={watch("imageUrl")}
                                alt={variants[index]?.name ?? "Variant"}
                                onChange={imageField.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="px-2 py-1.5 font-mono text-muted-foreground">
                      {variants[index]?.skuSuffix}
                    </td>
                    <td className="px-2 py-1.5">
                      <FormField
                        control={control}
                        name={`variants.${index}.name`}
                        render={({ field: nameField }) => (
                          <FormItem>
                            <FormControl>
                              <Input className="h-8 text-xs" {...nameField} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <FormField
                        control={control}
                        name={`variants.${index}.sku`}
                        render={({ field: skuField }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="h-8 font-mono text-xs"
                                {...skuField}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <FormField
                        control={control}
                        name={`variants.${index}.price`}
                        render={({ field: priceField }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="h-8 text-xs"
                                type="number"
                                step="0.01"
                                min="0"
                                {...priceField}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <FormField
                        control={control}
                        name={`variants.${index}.cost`}
                        render={({ field: costField }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="h-8 text-xs"
                                type="number"
                                step="0.01"
                                min="0"
                                {...costField}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <FormField
                        control={control}
                        name={`variants.${index}.status`}
                        render={({ field: statusField }) => (
                          <FormItem>
                            <Select
                              value={statusField.value}
                              onValueChange={statusField.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
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
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Remove variant"
                        onClick={() => variantsArray.remove(index)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <FormField
          control={control}
          name="variants"
          render={() => <FormMessage />}
        />
      </div>
    </div>
  );
}

export { VariantManager };
