import type {
  ProductOptionAxis,
  ProductStatus,
  ProductVariant,
} from "~/features/catalog/types";

function cartesian(valuesLists: string[][]): string[][] {
  if (valuesLists.length === 0) return [[]];
  return valuesLists.reduce<string[][]>(
    (acc, values) =>
      acc.flatMap((combo) => values.map((value) => [...combo, value])),
    [[]],
  );
}

function slugify(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 12);
}

/**
 * Build the full option matrix as variants.
 * Existing variants are preserved when optionValues match; new combos are appended.
 */
export function generateVariantMatrix(input: {
  baseSku: string;
  basePrice: number;
  baseCost: number;
  axes: ProductOptionAxis[];
  existing?: ProductVariant[];
  defaultStatus?: ProductStatus;
}): ProductVariant[] {
  const { baseSku, basePrice, baseCost, axes, existing = [] } = input;
  const defaultStatus = input.defaultStatus ?? "active";
  const usableAxes = axes.filter(
    (axis) => axis.name.trim() && axis.values.some((v) => v.trim()),
  );

  if (usableAxes.length === 0) return [];

  const valueLists = usableAxes.map((axis) =>
    axis.values.map((v) => v.trim()).filter(Boolean),
  );
  const combos = cartesian(valueLists);

  return combos.map((combo, index) => {
    const optionValues: Record<string, string> = {};
    usableAxes.forEach((axis, axisIndex) => {
      optionValues[axis.id] = combo[axisIndex]!;
    });

    const existingMatch = existing.find((variant) =>
      usableAxes.every(
        (axis) => variant.optionValues[axis.id] === optionValues[axis.id],
      ),
    );

    if (existingMatch) {
      return {
        ...existingMatch,
        optionValues,
        name: combo.join(" / "),
      };
    }

    const suffix = `-${combo.map(slugify).join("-")}`;
    return {
      id: `var_${Date.now()}_${index}`,
      name: combo.join(" / "),
      skuSuffix: suffix,
      sku: `${baseSku}${suffix}`,
      optionValues,
      price: basePrice,
      cost: baseCost,
      status: defaultStatus,
      imageUrl: "",
    };
  });
}

export function newOptionAxis(name = ""): ProductOptionAxis {
  return {
    id: `axis_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    values: [],
  };
}

export function newVariantId(): string {
  return `var_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
