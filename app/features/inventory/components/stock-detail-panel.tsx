import { useMemo } from "react";
import {
  useMovementsQuery,
  useStockBalanceQuery,
} from "~/features/inventory/api/inventory-mutations";
import {
  MOVEMENT_TYPE_LABELS,
  STOCK_HEALTH_LABELS,
  stockHealth,
  stockHealthToBadge,
  type StockBalance,
  type StockMovement,
} from "~/features/inventory/types";
import { LoadingState } from "~/shared/components/page-primitives";
import { PermissionGuard } from "~/shared/components/permission-guard";
import { StatusBadge } from "~/shared/components/status-badge";
import { ActivityFeed, type TimelineItem } from "~/shared/components/timeline";
import { Button } from "~/shared/components/ui/button";
import { Separator } from "~/shared/components/ui/separator";
import { useDrawer } from "~/shared/providers/drawer-provider";

export type StockDetailPanelProps = {
  balanceId: string;
  initialBalance?: StockBalance;
  drawerId: string;
  onAdjust: (productId: string) => void;
};

function StockDetailPanel({
  balanceId,
  initialBalance,
  drawerId,
  onAdjust,
}: StockDetailPanelProps) {
  const { closeDrawer } = useDrawer();
  const balanceQuery = useStockBalanceQuery(balanceId);
  const balance = balanceQuery.data ?? initialBalance;

  const movementsQuery = useMovementsQuery(
    balance
      ? { productId: balance.productId, branchId: balance.branchId }
      : undefined,
    Boolean(balance),
  );

  const timeline = useMemo(
    () => toTimeline(movementsQuery.data ?? []),
    [movementsQuery.data],
  );

  if (!balance) {
    return <LoadingState label="Loading stock…" />;
  }

  const health = stockHealth(balance);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            status={stockHealthToBadge(health)}
            label={STOCK_HEALTH_LABELS[health]}
          />
          <span className="text-[11px] text-muted-foreground">
            Projection from append-only movements
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <Meta label="Product" value={balance.productName} />
          <Meta label="SKU" value={balance.sku} />
          <Meta label="Branch" value={balance.branchCode} />
          <Meta label="Unit" value={balance.unit} />
          <Meta
            label="On hand"
            value={`${balance.onHand} ${balance.unit}`}
          />
          <Meta
            label="Reorder point"
            value={`${balance.reorderPoint} ${balance.unit}`}
          />
        </div>

        <Separator />

        <div>
          <h3 className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Movement history
          </h3>
          {movementsQuery.isLoading ? (
            <LoadingState label="Loading movements…" className="py-8" />
          ) : timeline.length === 0 ? (
            <p className="text-xs text-muted-foreground">No movements yet.</p>
          ) : (
            <ActivityFeed items={timeline} />
          )}
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-border bg-card px-4 py-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => closeDrawer(drawerId)}
        >
          Close
        </Button>
        <PermissionGuard permissions={["inventory:write"]}>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              closeDrawer(drawerId);
              onAdjust(balance.productId);
            }}
          >
            Adjust stock
          </Button>
        </PermissionGuard>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium tabular-nums">{value}</p>
    </div>
  );
}

function toTimeline(movements: StockMovement[]): TimelineItem[] {
  return movements.map((m) => ({
    id: m.id,
    title: `${MOVEMENT_TYPE_LABELS[m.type]} · ${m.quantity > 0 ? "+" : ""}${m.quantity} ${m.unit}`,
    description: `${m.reason}${m.referenceId ? ` · ${m.referenceId}` : ""} · ${m.actorName}`,
    timestamp: formatWhen(m.createdAt),
    tone:
      m.quantity < 0
        ? m.type === "adjustment"
          ? "warning"
          : "danger"
        : "success",
  }));
}

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export { StockDetailPanel };
