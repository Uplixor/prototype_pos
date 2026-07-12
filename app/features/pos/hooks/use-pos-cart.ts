import { useCallback, useMemo, useState } from "react";
import type { Product } from "~/features/catalog/types";
import { computeSaleTotals, round2, type SaleItem } from "~/features/sales/types";

export type CartLine = SaleItem;

/** Mirrors the tax-profile heuristic used by the sales store for live cart estimates. */
function estimateTaxRate(taxProfile: string): number {
  if (taxProfile.startsWith("Standard")) return 0.08;
  if (taxProfile.startsWith("Reduced")) return 0.05;
  return 0;
}

function lineTotalFor(unitPrice: number, quantity: number, taxRate: number): number {
  return round2(unitPrice * quantity * (1 + taxRate));
}

function buildLine(product: Product, quantity: number): CartLine {
  const taxRate = estimateTaxRate(product.taxProfile);
  return {
    id: product.id,
    productId: product.id,
    sku: product.sku,
    name: product.name,
    unitPrice: product.price,
    quantity,
    taxRate,
    lineTotal: lineTotalFor(product.price, quantity, taxRate),
  };
}

export type UsePosCartResult = {
  lines: CartLine[];
  totals: { subtotal: number; taxTotal: number; total: number };
  quantityByProduct: Map<string, number>;
  addProduct: (product: Product) => void;
  incrementLine: (productId: string) => void;
  decrementLine: (productId: string) => void;
  removeLine: (productId: string) => void;
  clear: () => void;
};

export function usePosCart(): UsePosCartResult {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addProduct = useCallback((product: Product) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.productId === product.id);
      if (!existing) {
        return [...prev, buildLine(product, 1)];
      }
      const quantity = existing.quantity + 1;
      return prev.map((line) =>
        line.productId === product.id
          ? {
              ...line,
              quantity,
              lineTotal: lineTotalFor(line.unitPrice, quantity, line.taxRate),
            }
          : line,
      );
    });
  }, []);

  const incrementLine = useCallback((productId: string) => {
    setLines((prev) =>
      prev.map((line) => {
        if (line.productId !== productId) return line;
        const quantity = line.quantity + 1;
        return {
          ...line,
          quantity,
          lineTotal: lineTotalFor(line.unitPrice, quantity, line.taxRate),
        };
      }),
    );
  }, []);

  const decrementLine = useCallback((productId: string) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.productId === productId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((line) => line.productId !== productId);
      }
      const quantity = existing.quantity - 1;
      return prev.map((line) =>
        line.productId === productId
          ? {
              ...line,
              quantity,
              lineTotal: lineTotalFor(line.unitPrice, quantity, line.taxRate),
            }
          : line,
      );
    });
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => prev.filter((line) => line.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const totals = useMemo(() => computeSaleTotals(lines), [lines]);

  const quantityByProduct = useMemo(() => {
    const map = new Map<string, number>();
    for (const line of lines) {
      map.set(line.productId, line.quantity);
    }
    return map;
  }, [lines]);

  return {
    lines,
    totals,
    quantityByProduct,
    addProduct,
    incrementLine,
    decrementLine,
    removeLine,
    clear,
  };
}
