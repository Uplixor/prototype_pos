import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ProductImage } from "~/features/catalog/components/product-image";
import {
  formatMoney,
  productStatusToBadge,
  resolveVariantImage,
  type Product,
  type ProductVariant,
} from "~/features/catalog/types";
import { PermissionGuard } from "~/shared/components/permission-guard";
import { StatusBadge } from "~/shared/components/status-badge";
import { Button } from "~/shared/components/ui/button";
import { useDrawer } from "~/shared/providers/drawer-provider";
import { cn } from "~/shared/utils/cn";

/** Demo stock projection — catalog view only until Inventory is variant-aware. */
const DEMO_STOCK: Record<string, number> = {
  "var_watch_blk_42": 145,
  "var_watch_blk_46": 12,
  "var_watch_slv_42": 0,
  "var_watch_slv_46": 38,
  "var_latte_8": 62,
  "var_latte_12": 41,
  "var_latte_16": 18,
};

function stockFor(variant: ProductVariant): number {
  if (variant.id in DEMO_STOCK) return DEMO_STOCK[variant.id]!;
  // Stable demo fallback from id hash
  let hash = 0;
  for (let i = 0; i < variant.id.length; i++) {
    hash = (hash + variant.id.charCodeAt(i) * (i + 1)) % 200;
  }
  return hash;
}

function colorSwatch(label: string): string {
  const key = label.toLowerCase();
  if (key.includes("midnight") || key.includes("black")) return "#111827";
  if (key.includes("silver") || key.includes("grey") || key.includes("gray"))
    return "#9ca3af";
  if (key.includes("blue")) return "#2563eb";
  if (key.includes("red")) return "#dc2626";
  if (key.includes("green")) return "#16a34a";
  if (key.includes("gold")) return "#d4a017";
  return "#64748b";
}

function axisValue(
  product: Product,
  variant: ProductVariant,
  axisName: string,
): string | undefined {
  const axis = product.optionAxes.find(
    (a) => a.name.toLowerCase() === axisName.toLowerCase(),
  );
  if (!axis) return undefined;
  return variant.optionValues[axis.id];
}

export type ProductViewPanelProps = {
  product: Product;
  drawerId: string;
};

function ProductViewPanel({ product, drawerId }: ProductViewPanelProps) {
  const navigate = useNavigate();
  const { closeDrawer } = useDrawer();
  const [showAllVariants, setShowAllVariants] = useState(false);

  const variants = product.variants;
  const previewLimit = 3;
  const visibleVariants = showAllVariants
    ? variants
    : variants.slice(0, previewLimit);
  const hiddenCount = Math.max(variants.length - previewLimit, 0);

  const totalUnits = useMemo(
    () => variants.reduce((sum, v) => sum + stockFor(v), 0),
    [variants],
  );

  const colorAxis = product.optionAxes.find((a) =>
    a.name.toLowerCase().includes("color"),
  );
  const sizeAxis = product.optionAxes.find((a) =>
    a.name.toLowerCase().includes("size"),
  );

  function goEdit() {
    closeDrawer(drawerId);
    void navigate(`/catalog/products/${product.id}`);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-5">
        <div className="flex gap-4">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            size="lg"
            className="size-20 shrink-0 rounded-md"
          />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                {product.sku}
              </span>
              <StatusBadge status={productStatusToBadge(product.status)} />
            </div>
            <h2 className="text-[18px] font-semibold leading-tight text-heading">
              {product.name}
            </h2>
            {product.brand ? (
              <p className="text-xs text-muted-foreground">{product.brand}</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-md border border-border bg-muted/40 p-3 text-xs sm:grid-cols-4">
          <Meta label="Category" value={product.categoryName || "—"} />
          <Meta label="Base price" value={formatMoney(product.price)} />
          <Meta label="Brand" value={product.brand || "—"} />
          <Meta
            label="Total inventory"
            value={
              product.trackInventory
                ? `${totalUnits.toLocaleString()} units`
                : "Not tracked"
            }
          />
        </div>

        {product.description ? (
          <div
            className="prose prose-sm max-w-none text-sm text-muted-foreground [&_a]:text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        ) : null}

        <section className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-heading">
              Variants ({variants.length})
            </h3>
            <PermissionGuard permissions={["catalog:write"]}>
              <button
                type="button"
                className="text-xs font-medium text-primary hover:underline"
                onClick={goEdit}
              >
                Manage
              </button>
            </PermissionGuard>
          </div>

          {variants.length === 0 ? (
            <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
              Single-SKU product — no variants
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[28rem] text-xs">
                <thead className="bg-muted/80 text-[10px] tracking-wide text-muted-foreground uppercase">
                  <tr className="border-b border-border">
                    <th className="px-2 py-2 text-left font-medium">Image</th>
                    <th className="px-2 py-2 text-left font-medium">
                      SKU suffix
                    </th>
                    {colorAxis ? (
                      <th className="px-2 py-2 text-left font-medium">Color</th>
                    ) : null}
                    {sizeAxis ? (
                      <th className="px-2 py-2 text-left font-medium">Size</th>
                    ) : null}
                    {!colorAxis && !sizeAxis ? (
                      <th className="px-2 py-2 text-left font-medium">Name</th>
                    ) : null}
                    <th className="px-2 py-2 text-right font-medium">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleVariants.map((variant) => {
                    const stock = stockFor(variant);
                    const color = colorAxis
                      ? axisValue(product, variant, colorAxis.name)
                      : undefined;
                    const size = sizeAxis
                      ? axisValue(product, variant, sizeAxis.name)
                      : undefined;
                    return (
                      <tr
                        key={variant.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-2 py-2">
                          <ProductImage
                            src={resolveVariantImage(product, variant)}
                            alt={variant.name}
                            size="sm"
                            className="rounded"
                          />
                        </td>
                        <td className="px-2 py-2 font-mono text-muted-foreground">
                          {variant.skuSuffix}
                        </td>
                        {colorAxis ? (
                          <td className="px-2 py-2">
                            <span className="inline-flex items-center gap-1.5">
                              <span
                                className="size-2.5 rounded-full border border-border"
                                style={{
                                  backgroundColor: colorSwatch(color ?? ""),
                                }}
                              />
                              {color ?? "—"}
                            </span>
                          </td>
                        ) : null}
                        {sizeAxis ? (
                          <td className="px-2 py-2">{size ?? "—"}</td>
                        ) : null}
                        {!colorAxis && !sizeAxis ? (
                          <td className="px-2 py-2">{variant.name}</td>
                        ) : null}
                        <td
                          className={cn(
                            "px-2 py-2 text-right tabular-nums font-medium",
                            stock === 0 && "text-destructive",
                            stock > 0 && stock <= 15 && "text-warning",
                          )}
                        >
                          {stock}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!showAllVariants && hiddenCount > 0 ? (
                <button
                  type="button"
                  className="w-full border-t border-border px-3 py-2 text-left text-xs font-medium text-primary hover:bg-muted"
                  onClick={() => setShowAllVariants(true)}
                >
                  View {hiddenCount} more variants…
                </button>
              ) : null}
            </div>
          )}
        </section>

        {product.modifiers.length > 0 ? (
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-heading">
              Modifiers & options
            </h3>
            <div className="space-y-2">
              {product.modifiers.map((group) => (
                <div
                  key={group.id}
                  className="rounded-md border border-border p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{group.name}</p>
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                      {group.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {group.options.map((option) => (
                      <li
                        key={option.id}
                        className="flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="text-muted-foreground">
                          {option.name}
                        </span>
                        <span className="tabular-nums font-medium">
                          {option.priceDelta >= 0 ? "+" : ""}
                          {formatMoney(option.priceDelta)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-end gap-2 border-t border-border bg-card px-4 py-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => closeDrawer(drawerId)}
        >
          Close
        </Button>
        <PermissionGuard permissions={["catalog:write"]}>
          <Button type="button" size="sm" onClick={goEdit}>
            Edit product
          </Button>
        </PermissionGuard>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-0.5 truncate font-medium text-heading">{value}</p>
    </div>
  );
}

export { ProductViewPanel };
