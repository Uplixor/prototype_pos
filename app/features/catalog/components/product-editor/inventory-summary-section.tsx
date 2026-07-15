import { MapPin } from "lucide-react";
import type { UseFormWatch } from "react-hook-form";
import { EditorSection } from "~/features/catalog/components/product-editor/editor-section";
import { BRANCH_OPTIONS } from "~/features/catalog/data/catalog-store";
import type { ProductFormValues } from "~/features/catalog/schema";
import { Link } from "react-router";

type Props = {
  watch: UseFormWatch<ProductFormValues>;
};

/** Stable demo projection — product page is summary only. */
function demoStock(branchId: string, sku: string) {
  let hash = 0;
  const key = `${branchId}:${sku}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * (i + 3)) % 400;
  }
  const onHand = 20 + (hash % 180);
  const reserved = hash % 25;
  return { onHand, reserved, available: Math.max(onHand - reserved, 0) };
}

export function InventorySummarySection({ watch }: Props) {
  const track = watch("trackInventory");
  const branchIds = watch("branchIds");
  const sku = watch("sku") || "SKU";
  const locations = BRANCH_OPTIONS.filter((b) => branchIds.includes(b.id));

  return (
    <EditorSection
      id="inventory"
      title="Inventory summary"
      description="Read-only availability — adjust stock in Inventory"
      actions={
        <Link
          to="/inventory"
          className="text-[12px] font-medium text-primary hover:underline"
        >
          Open inventory
        </Link>
      }
    >
      {!track ? (
        <p className="py-2 text-xs text-muted-foreground">
          Inventory tracking is off for this product.
        </p>
      ) : locations.length === 0 ? (
        <p className="py-2 text-xs text-muted-foreground">
          Select branch availability to project stock by location.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border/80">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 text-[10px] tracking-wide text-muted-foreground uppercase">
              <tr className="border-b border-border/80">
                <th className="px-3 py-2 text-left font-medium">Location</th>
                <th className="px-3 py-2 text-right font-medium">On hand</th>
                <th className="px-3 py-2 text-right font-medium">Reserved</th>
                <th className="px-3 py-2 text-right font-medium">Available</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((branch) => {
                const stock = demoStock(branch.id, sku);
                return (
                  <tr
                    key={branch.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <MapPin className="size-3.5" />
                        </span>
                        <span>
                          <span className="block font-medium text-heading">
                            {branch.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {branch.code}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {stock.onHand}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                      {stock.reserved}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-primary">
                      {stock.available}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </EditorSection>
  );
}
