import {
  useOrderPurchaseMutation,
  usePurchaseQuery,
} from "~/features/purchasing/api/purchasing-mutations";
import { ReceiptForm } from "~/features/purchasing/components/purchasing-forms";
import {
  PURCHASE_STATUS_LABELS,
  type Purchase,
} from "~/features/purchasing/types";
import { LoadingState } from "~/shared/components/page-primitives";
import { PermissionGuard } from "~/shared/components/permission-guard";
import { StatusBadge, type StatusKey } from "~/shared/components/status-badge";
import { Button } from "~/shared/components/ui/button";
import { useDrawer } from "~/shared/providers/drawer-provider";

function toBadge(status: Purchase["status"]): StatusKey {
  switch (status) {
    case "draft":
      return "draft";
    case "ordered":
      return "pending";
    case "partially_received":
      return "unpaid";
    case "received":
      return "completed";
    case "cancelled":
      return "cancelled";
  }
}

export function PurchaseDetailPanel({
  purchaseId,
  initial,
  drawerId,
}: {
  purchaseId: string;
  initial?: Purchase;
  drawerId: string;
}) {
  const { closeDrawer, openDrawer } = useDrawer();
  const query = usePurchaseQuery(purchaseId);
  const orderMutation = useOrderPurchaseMutation();
  const purchase = query.data ?? initial;

  if (!purchase) return <LoadingState label="Loading purchase…" />;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4">
        <StatusBadge
          status={toBadge(purchase.status)}
          label={PURCHASE_STATUS_LABELS[purchase.status]}
        />
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">Supplier</p>
            <p className="font-medium">{purchase.supplierName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Branch</p>
            <p className="font-medium">{purchase.branchCode}</p>
          </div>
        </div>
        <ul className="divide-y divide-border rounded-md border border-border">
          {purchase.items.map((item) => (
            <li key={item.id} className="flex justify-between px-3 py-2 text-sm">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-[11px] text-muted-foreground">
                  Ordered {item.orderedQty} · Received {item.receivedQty}{" "}
                  {item.unit}
                </p>
              </div>
              <span className="tabular-nums text-muted-foreground">
                ${item.unitCost.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-border pt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => closeDrawer(drawerId)}
        >
          Close
        </Button>
        <PermissionGuard permissions={["purchasing:write"]}>
          {purchase.status === "draft" ? (
            <Button
              type="button"
              size="sm"
              disabled={orderMutation.isPending}
              onClick={() => orderMutation.mutate(purchase.id)}
            >
              Mark ordered
            </Button>
          ) : null}
          {purchase.status === "ordered" ||
          purchase.status === "partially_received" ? (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                closeDrawer(drawerId);
                const id = "receipt-create";
                openDrawer({
                  id,
                  title: "Goods receipt",
                  description: "Creates inbound Stock Movements",
                  size: "lg",
                  content: (
                    <ReceiptForm drawerId={id} purchaseId={purchase.id} />
                  ),
                });
              }}
            >
              Receive goods
            </Button>
          ) : null}
        </PermissionGuard>
      </div>
    </div>
  );
}
