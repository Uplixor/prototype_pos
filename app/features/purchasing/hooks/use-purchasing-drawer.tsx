import {
  PurchaseForm,
  ReceiptForm,
  SupplierForm,
} from "~/features/purchasing/components/purchasing-forms";
import { PurchaseDetailPanel } from "~/features/purchasing/components/purchase-detail";
import type { Purchase } from "~/features/purchasing/types";
import { useDrawer } from "~/shared/providers/drawer-provider";

export function usePurchasingDrawer() {
  const { openDrawer } = useDrawer();

  function openCreateSupplier() {
    const id = "supplier-create";
    openDrawer({
      id,
      title: "New supplier",
      size: "md",
      content: <SupplierForm drawerId={id} />,
    });
  }

  function openCreatePurchase() {
    const id = "purchase-create";
    openDrawer({
      id,
      title: "New purchase",
      description: "Intent only — does not move stock",
      size: "lg",
      content: <PurchaseForm drawerId={id} />,
    });
  }

  function openPurchase(purchase: Purchase) {
    const id = `purchase-${purchase.id}`;
    openDrawer({
      id,
      title: purchase.purchaseNumber,
      description: purchase.supplierName,
      size: "lg",
      content: (
        <PurchaseDetailPanel
          purchaseId={purchase.id}
          initial={purchase}
          drawerId={id}
        />
      ),
    });
  }

  function openReceive(purchaseId?: string) {
    const id = "receipt-create";
    openDrawer({
      id,
      title: "Goods receipt",
      description: "Creates inbound Stock Movements",
      size: "lg",
      content: <ReceiptForm drawerId={id} purchaseId={purchaseId} />,
    });
  }

  return {
    openCreateSupplier,
    openCreatePurchase,
    openPurchase,
    openReceive,
  };
}
