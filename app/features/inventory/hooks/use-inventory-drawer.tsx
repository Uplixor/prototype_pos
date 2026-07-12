import { AdjustmentForm } from "~/features/inventory/components/adjustment-form";
import { StockDetailPanel } from "~/features/inventory/components/stock-detail-panel";
import type { StockBalance } from "~/features/inventory/types";
import { useDrawer } from "~/shared/providers/drawer-provider";

export function useInventoryDrawer() {
  const { openDrawer } = useDrawer();

  function openAdjustment(productId?: string) {
    const drawerId = "inventory-adjustment";
    openDrawer({
      id: drawerId,
      title: "Stock adjustment",
      description: "Record an accountable inventory correction",
      size: "md",
      content: (
        <AdjustmentForm drawerId={drawerId} defaultProductId={productId} />
      ),
    });
  }

  function openStock(balance: StockBalance) {
    const drawerId = `stock-${balance.id}`;
    openDrawer({
      id: drawerId,
      title: balance.productName,
      description: `${balance.sku} · ${balance.branchCode}`,
      size: "lg",
      content: (
        <StockDetailPanel
          balanceId={balance.id}
          initialBalance={balance}
          drawerId={drawerId}
          onAdjust={openAdjustment}
        />
      ),
    });
  }

  return { openAdjustment, openStock };
}
