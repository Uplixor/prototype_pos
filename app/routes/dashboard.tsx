import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Download,
  HeartPulse,
  Package,
  Percent,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";
import {
  buildDashboardMetrics,
  moneyDeltaLabel,
} from "~/features/dashboard/build-metrics";
import { roleLabel } from "~/features/auth/role-presets";
import {
  useMovementsQuery,
  useStockBalancesQuery,
} from "~/features/inventory/api/inventory-mutations";
import { useSaleDrawer } from "~/features/sales/hooks/use-sale-drawer";
import { useSalesQuery } from "~/features/sales/api/sales-mutations";
import {
  formatMoney,
  saleStatusToBadge,
  type Sale,
} from "~/features/sales/types";
import {
  DonutChart,
  HorizontalBarChart,
  RevenueAreaChart,
} from "~/shared/components/charts/charts";
import { DataTable } from "~/shared/components/data-table/data-table";
import { exportToCsv } from "~/shared/components/data-table/export-csv";
import { Panel } from "~/shared/components/panel";
import { PageHeader, StatCard } from "~/shared/components/page-primitives";
import { StatusBadge } from "~/shared/components/status-badge";
import { Button } from "~/shared/components/ui/button";
import { useWorkspace } from "~/shared/providers/workspace-provider";

export function meta() {
  return [
    { title: "Dashboard · Commerce OS" },
    {
      name: "description",
      content: "Real-time performance metrics and insights",
    },
  ];
}

export default function DashboardRoute() {
  const { branch, organization, user, hasPermission } = useWorkspace();
  const { openCreateSale } = useSaleDrawer();
  const salesQuery = useSalesQuery();
  const balancesQuery = useStockBalancesQuery();
  const movementsQuery = useMovementsQuery();

  const canSell = hasPermission("sales:write");
  const inventoryFocus =
    user.role === "inventory" ||
    (!canSell && hasPermission("inventory:write"));
  const cashierFocus = user.role === "cashier";

  const metrics = useMemo(
    () =>
      buildDashboardMetrics(
        salesQuery.data ?? [],
        balancesQuery.data ?? [],
        movementsQuery.data ?? [],
        cashierFocus ? branch.id : undefined,
      ),
    [
      salesQuery.data,
      balancesQuery.data,
      movementsQuery.data,
      cashierFocus,
      branch.id,
    ],
  );

  const columns = useMemo<ColumnDef<Sale>[]>(
    () => [
      {
        accessorKey: "saleNumber",
        header: "Sale",
        cell: ({ row }) => (
          <span className="font-medium text-primary">
            {row.original.saleNumber}
          </span>
        ),
      },
      { accessorKey: "customerName", header: "Customer" },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => (
          <span className="font-money">{formatMoney(row.original.total)}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={saleStatusToBadge(row.original.status)} />
        ),
      },
      { accessorKey: "branchCode", header: "Branch" },
      {
        id: "when",
        header: "When",
        cell: ({ row }) => (
          <span className="text-[12px] text-muted-foreground">
            {new Date(row.original.updatedAt).toLocaleString()}
          </span>
        ),
      },
    ],
    [],
  );

  const title = inventoryFocus
    ? "Inventory overview"
    : cashierFocus
      ? "Shift overview"
      : "Executive Overview";

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title={title}
        description={
          inventoryFocus
            ? `${organization.name} · ${branch.name} · stock health`
            : "Real-time performance metrics and insights."
        }
        actions={
          <>
            <Button type="button" variant="outline" size="sm" className="text-[12px]">
              Oct 1 – Oct 31
            </Button>
            {hasPermission("reports:export") ? (
              <Button type="button" variant="outline" size="sm" asChild>
                <Link to="/reports/sales">
                  <Download className="size-3.5" />
                  Export
                </Link>
              </Button>
            ) : null}
            {canSell ? (
              <Button type="button" size="sm" onClick={openCreateSale}>
                New sale
              </Button>
            ) : null}
            {canSell ? (
              <Button type="button" size="sm" variant="secondary" asChild>
                <Link to="/pos">Open POS</Link>
              </Button>
            ) : null}
            {inventoryFocus ? (
              <Button type="button" size="sm" asChild>
                <Link to="/purchasing/receipts">Receive goods</Link>
              </Button>
            ) : null}
          </>
        }
      />

      <div className="space-y-4 px-page py-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {inventoryFocus ? (
            <>
              <StatCard
                label="Tracked SKUs"
                value={String(balancesQuery.data?.length ?? 0)}
                delta={`${metrics.movementCount} movements`}
                icon={Package}
              />
              <StatCard
                label="Low stock"
                value={String(metrics.lowStock)}
                delta={`${metrics.outOfStock} out of stock`}
                deltaTone={metrics.lowStock > 0 ? "negative" : "positive"}
                icon={Package}
              />
              <StatCard
                label="Open orders"
                value={String(metrics.openOrders)}
                delta="Read-only sales context"
                icon={ShoppingBag}
              />
              <StatCard
                label="Completed today"
                value={String(metrics.completedToday)}
                delta="Demand signal"
                icon={TrendingUp}
              />
            </>
          ) : (
            <>
              <StatCard
                label={cashierFocus ? "Branch revenue" : "Net Sales"}
                value={formatMoney(metrics.revenueToday)}
                delta={moneyDeltaLabel(metrics.revenueDeltaPct)}
                deltaTone={
                  (metrics.revenueDeltaPct ?? 0) >= 0 ? "positive" : "negative"
                }
                icon={TrendingUp}
              />
              <StatCard
                label="Completed"
                value={String(metrics.completedToday)}
                delta={`${metrics.openOrders} still open`}
                icon={Percent}
              />
              <StatCard
                label="Open / unpaid"
                value={String(metrics.openOrders)}
                delta={`${metrics.awaitingPayment} awaiting payment`}
                deltaTone={
                  metrics.awaitingPayment > 0 ? "negative" : "neutral"
                }
                icon={ShoppingBag}
              />
              <StatCard
                label="Low stock SKUs"
                value={String(metrics.lowStock + metrics.outOfStock)}
                delta={`${metrics.outOfStock} critical`}
                deltaTone={metrics.outOfStock > 0 ? "negative" : "neutral"}
                icon={HeartPulse}
              />
            </>
          )}
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          <Panel
            title={inventoryFocus ? "Stock health" : "Sales by status mix"}
            description={
              inventoryFocus
                ? "Availability projection by health band"
                : "Payment method mix · live ledger"
            }
          >
            <div className="px-2 py-2">
              {inventoryFocus ? (
                <DonutChart
                  data={metrics.stockHealth}
                  height={260}
                  centerLabel={`${balancesQuery.data?.length ?? 0}`}
                />
              ) : (
                <DonutChart
                  data={metrics.paymentMix}
                  height={260}
                  centerLabel={`${metrics.completedToday || metrics.paymentMix.length}`}
                />
              )}
            </div>
          </Panel>

          <Panel
            title={
              inventoryFocus || cashierFocus
                ? "Revenue trend"
                : "Branch Performance"
            }
            description={
              inventoryFocus || cashierFocus
                ? "Last 7 days"
                : "Completed sales revenue by branch"
            }
          >
            {inventoryFocus || cashierFocus ? (
              <div className="px-2 py-2">
                <RevenueAreaChart data={metrics.revenueSeries} height={260} />
              </div>
            ) : (
              <HorizontalBarChart
                data={metrics.branchRevenue}
                height={260}
                nameKey="label"
                valueKey="revenue"
              />
            )}
          </Panel>
        </div>

        <Panel
          title="Recent sales"
          description={`${roleLabel(user.role)} · ${branch.code} context`}
        >
          <DataTable
            columns={columns}
            data={metrics.recentSales}
            searchKey="saleNumber"
            searchPlaceholder="Filter products…"
            getRowId={(row) => row.id}
            onExportCsv={
              hasPermission("reports:export")
                ? (rows) =>
                    exportToCsv(
                      rows.map((row) => ({
                        saleNumber: row.saleNumber,
                        customer: row.customerName,
                        total: row.total,
                        status: row.status,
                        branch: row.branchCode,
                        updatedAt: row.updatedAt,
                      })),
                      "recent-sales",
                    )
                : undefined
            }
          />
        </Panel>
      </div>
    </div>
  );
}
