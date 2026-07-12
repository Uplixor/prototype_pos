import { CreateSaleForm } from "~/features/sales/components/create-sale-form";
import { SaleDetailPanel } from "~/features/sales/components/sale-detail-panel";
import type { Sale } from "~/features/sales/types";
import { useDrawer } from "~/shared/providers/drawer-provider";

export function useSaleDrawer() {
  const { openDrawer } = useDrawer();

  function openCreateSale() {
    const drawerId = "sale-create";
    openDrawer({
      id: drawerId,
      title: "New sale",
      description: "Open a sale for the current branch",
      size: "lg",
      content: <CreateSaleForm drawerId={drawerId} />,
    });
  }

  function openSale(sale: Sale) {
    const drawerId = `sale-${sale.id}`;
    openDrawer({
      id: drawerId,
      title: sale.saleNumber,
      description: `${sale.customerName} · ${sale.branchCode}`,
      size: "lg",
      content: (
        <SaleDetailPanel
          saleId={sale.id}
          initialSale={sale}
          drawerId={drawerId}
        />
      ),
    });
  }

  return { openCreateSale, openSale };
}
