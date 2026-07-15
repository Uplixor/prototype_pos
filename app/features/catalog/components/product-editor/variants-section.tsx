import { Plus, Trash2, Wand2 } from "lucide-react";
import type {
  Control,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { EditorSection } from "~/features/catalog/components/product-editor/editor-section";
import { ModifiersEditor } from "~/features/catalog/components/modifiers-editor";
import { VariantImageField } from "~/features/catalog/components/variant-image-field";
import type { ProductFormValues } from "~/features/catalog/schema";
import {
  generateVariantMatrix,
  newOptionAxis,
} from "~/features/catalog/utils/variant-matrix";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/shared/components/form/form";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { Switch } from "~/shared/components/ui/switch";

type VariantProps = {
  control: Control<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
};

/**
 * Stitch-style variants: option builder + dense spreadsheet.
 * Reuses option-axis UX from VariantManager for axes; table is inline below.
 */
export function VariantsSection({ control, watch, setValue }: VariantProps) {
  const axesArray = useFieldArray({ control, name: "optionAxes" });
  const variantsArray = useFieldArray({ control, name: "variants" });
  const axes = watch("optionAxes");
  const variants = watch("variants");
  const baseSku = watch("sku");
  const basePrice = watch("price");
  const baseCost = watch("cost");
  const primaryImage = watch("imageUrl") || watch("mediaUrls")?.[0];

  function addValues(axisIndex: number, raw: string) {
    const parts = raw
      .split(/[,|]/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const current = axes[axisIndex]?.values ?? [];
    const next = [...current];
    for (const value of parts) {
      if (!next.some((v) => v.toLowerCase() === value.toLowerCase())) {
        next.push(value);
      }
    }
    setValue(`optionAxes.${axisIndex}.values`, next, {
      shouldDirty: true,
      shouldValidate: true,
    });
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
    <EditorSection
      id="variants"
      title="Variants & attributes"
      actions={
        <>
          <button
            type="button"
            className="text-[12px] font-medium text-primary hover:underline disabled:opacity-40"
            disabled={!canGenerate}
            onClick={regenerate}
          >
            <span className="inline-flex items-center gap-1">
              <Wand2 className="size-3.5" />
              Generate
            </span>
          </button>
          <Button
            type="button"
            size="sm"
            className="h-8"
            variant="outline"
            onClick={() => axesArray.append(newOptionAxis(""))}
          >
            <Plus className="size-3.5" />
            Add option
          </Button>
        </>
      }
    >
      {/* Compact option axes */}
      {axesArray.fields.length === 0 ? (
        <p className="rounded-md border border-dashed border-border/80 px-3 py-3 text-center text-[11px] text-muted-foreground">
          Add options like Color / Size, then Generate combinations
        </p>
      ) : (
        <div className="space-y-2">
          {axesArray.fields.map((field, axisIndex) => (
            <div
              key={field.id}
              className="flex flex-wrap items-start gap-2 rounded-md border border-border/70 bg-muted/20 p-2"
            >
              <FormField
                control={control}
                name={`optionAxes.${axisIndex}.name`}
                render={({ field: nameField }) => (
                  <FormItem className="w-32 space-y-0">
                    <FormControl>
                      <Input
                        className="h-8 text-xs"
                        placeholder="Option"
                        {...nameField}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                {(axes[axisIndex]?.values ?? []).map((value, valueIndex) => (
                  <button
                    key={`${value}-${valueIndex}`}
                    type="button"
                    className="rounded border border-border bg-card px-1.5 py-0.5 text-[11px]"
                    onClick={() =>
                      setValue(
                        `optionAxes.${axisIndex}.values`,
                        (axes[axisIndex]?.values ?? []).filter(
                          (_, i) => i !== valueIndex,
                        ),
                        { shouldDirty: true },
                      )
                    }
                  >
                    {value} ×
                  </button>
                ))}
                <Input
                  className="h-8 max-w-[10rem] text-xs"
                  placeholder="Add value ↵"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                      event.preventDefault();
                      addValues(axisIndex, event.currentTarget.value);
                      event.currentTarget.value = "";
                    }
                  }}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => axesArray.remove(axisIndex)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Spreadsheet */}
      {variantsArray.fields.length === 0 ? (
        <p className="py-2 text-center text-[11px] text-muted-foreground">
          No variants yet — product sells as a single SKU
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border/80">
          <table className="w-full min-w-[42rem] text-xs">
            <thead className="bg-muted/50 text-[10px] tracking-wide text-muted-foreground uppercase">
              <tr className="border-b border-border/80">
                <th className="px-2 py-2 text-left font-medium">Image</th>
                <th className="px-2 py-2 text-left font-medium">Variant</th>
                <th className="px-2 py-2 text-left font-medium">SKU</th>
                <th className="px-2 py-2 text-left font-medium">Price</th>
                <th className="px-2 py-2 text-left font-medium">Cost</th>
                <th className="px-2 py-2 text-left font-medium">Stock</th>
                <th className="px-2 py-2 text-left font-medium">Status</th>
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {variantsArray.fields.map((field, index) => (
                <tr
                  key={field.id}
                  className="h-9 border-b border-border/60 last:border-0"
                >
                  <td className="px-2 py-1">
                    <FormField
                      control={control}
                      name={`variants.${index}.imageUrl`}
                      render={({ field: imageField }) => (
                        <FormItem>
                          <FormControl>
                            <VariantImageField
                              value={imageField.value}
                              fallbackUrl={primaryImage}
                              alt={variants[index]?.name ?? "Variant"}
                              onChange={imageField.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="px-2 py-1">
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
                  <td className="px-2 py-1">
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
                  <td className="px-2 py-1">
                    <FormField
                      control={control}
                      name={`variants.${index}.price`}
                      render={({ field: priceField }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="h-8 w-[4.5rem] text-xs"
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
                  <td className="px-2 py-1">
                    <FormField
                      control={control}
                      name={`variants.${index}.cost`}
                      render={({ field: costField }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="h-8 w-[4.5rem] text-xs"
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
                  <td className="px-2 py-1 text-[11px] text-muted-foreground">
                    Summary
                  </td>
                  <td className="px-2 py-1">
                    <FormField
                      control={control}
                      name={`variants.${index}.status`}
                      render={({ field: statusField }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Switch
                              checked={statusField.value === "active"}
                              onCheckedChange={(checked) =>
                                statusField.onChange(
                                  checked ? "active" : "draft",
                                )
                              }
                            />
                          </FormControl>
                          <span className="text-[10px] text-muted-foreground">
                            {statusField.value === "active"
                              ? "Active"
                              : "Off"}
                          </span>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="px-1 py-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
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
    </EditorSection>
  );
}

type ModifierProps = {
  control: Control<ProductFormValues>;
};

export function ModifiersSection({ control }: ModifierProps) {
  return (
    <EditorSection
      id="modifiers"
      title="Modifier groups"
      description="Optional add-ons at checkout — separate from SKU variants"
    >
      <ModifiersEditor control={control} />
    </EditorSection>
  );
}
