import { useMemo } from "react";
import { Link } from "react-router";
import { buildDashboardMetrics } from "~/features/dashboard/build-metrics";
import {
  useMovementsQuery,
  useStockBalancesQuery,
} from "~/features/inventory/api/inventory-mutations";
import {
  MOVEMENT_TYPE_LABELS,
  stockHealth,
  type MovementType,
} from "~/features/inventory/types";
import { useSalesQuery } from "~/features/sales/api/sales-mutations";
import { formatMoney } from "~/features/sales/types";
import {
  DonutChart,
  HorizontalBarChart,
  MultiBarChart,
  RevenueAreaChart,
  TrendLineChart,
} from "~/shared/components/charts/charts";
import { Panel } from "~/shared/components/panel";
import { PageHeader, StatCard } from "~/shared/components/page-primitives";
import { StatusBadge } from "~/shared/components/status-badge";
import { Button } from "~/shared/components/ui/button";
import { useWorkspace } from "~/shared/providers/workspace-provider";
import { colors } from "~/theme/tokens";

export function ReportsHubPage() {
  const { hasPermission } = useWorkspace();
  const links = [
    {
      href: "/reports/sales",
      title: "Sales",
      desc: "Completed sales revenue and branch mix",
      show: hasPermission("reports:sales"),
    },
    {
      href: "/reports/payments",
      title: "Payments",
      desc: "Recorded payments and refunds",
      show: hasPermission("reports:payments"),
    },
    {
      href: "/reports/inventory",
      title: "Inventory",
      desc: "Availability and movement volume",
      show: hasPermission("reports:inventory"),
    },
  ].filter((l) => l.show);

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Reports"
        description="Read-only projections from completed commercial and stock facts"
      />
      <div className="grid gap-3 px-page py-4 sm:grid-cols-3">
        {links.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="rounded-md border border-border bg-card p-4 transition-colors hover:border-primary"
          >
            <h2 className="text-sm font-semibold">{item.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
        {links.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No report permissions for this role.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function SalesReportPage() {
  const { branch, hasPermission } = useWorkspace();
  const salesQuery = useSalesQuery();
  const balancesQuery = useStockBalancesQuery();
  const movementsQuery = useMovementsQuery();

  const metrics = useMemo(
    () =>
      buildDashboardMetrics(
        salesQuery.data ?? [],
        balancesQuery.data ?? [],
        movementsQuery.data ?? [],
      ),
    [salesQuery.data, balancesQuery.data, movementsQuery.data],
  );

  const completed = useMemo(
    () =>
      (salesQuery.data ?? []).filter(
        (s) => s.status === "completed" || s.status === "refunded",
      ),
    [salesQuery.data],
  );
  const revenue = completed.reduce((s, sale) => s + sale.total, 0);
  const branchRevenue = completed
    .filter((s) => s.branchId === branch.id)
    .reduce((s, sale) => s + sale.total, 0);

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Sales report"
        description={`Organization scope · live mock · highlight ${branch.code}`}
        actions={
          hasPermission("reports:export") ? (
            <Button type="button" variant="outline" size="sm">
              Export CSV
            </Button>
          ) : null
        }
      />
      <div className="space-y-4 px-page py-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Completed sales" value={String(completed.length)} />
          <StatCard label="Revenue (all)" value={formatMoney(revenue)} />
          <StatCard
            label={`Revenue (${branch.code})`}
            value={formatMoney(branchRevenue)}
          />
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <Panel
            className="xl:col-span-2"
            title="Revenue trend"
            description="Last 7 days"
          >
            <div className="px-2 py-3">
              <RevenueAreaChart data={metrics.revenueSeries} height={260} />
            </div>
          </Panel>
          <Panel title="By branch" description="Completed sales revenue">
            <HorizontalBarChart
              data={metrics.branchRevenue}
              height={260}
              nameKey="label"
              valueKey="revenue"
            />
          </Panel>
        </div>

        <Panel title="Sale ledger" description="Immutable completed and refunded sales">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="bg-muted/80 text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium">Sale</th>
                  <th className="px-3 py-2 text-left font-medium">Branch</th>
                  <th className="px-3 py-2 text-left font-medium">Customer</th>
                  <th className="px-3 py-2 text-left font-medium">Total</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {completed.map((s) => (
                  <tr key={s.id} className="border-b border-border">
                    <td className="px-3 py-2 font-medium">{s.saleNumber}</td>
                    <td className="px-3 py-2">{s.branchCode}</td>
                    <td className="px-3 py-2">{s.customerName}</td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatMoney(s.total)}
                    </td>
                    <td className="px-3 py-2 capitalize">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function PaymentsReportPage() {
  const { hasPermission } = useWorkspace();
  const salesQuery = useSalesQuery();
  const balancesQuery = useStockBalancesQuery();
  const movementsQuery = useMovementsQuery();

  const metrics = useMemo(
    () =>
      buildDashboardMetrics(
        salesQuery.data ?? [],
        balancesQuery.data ?? [],
        movementsQuery.data ?? [],
      ),
    [salesQuery.data, balancesQuery.data, movementsQuery.data],
  );

  const payments = useMemo(() => {
    return (salesQuery.data ?? []).flatMap((s) =>
      s.payments.map((p) => ({
        ...p,
        saleNumber: s.saleNumber,
        branchCode: s.branchCode,
      })),
    );
  }, [salesQuery.data]);
  const refunds = useMemo(() => {
    return (salesQuery.data ?? []).flatMap((s) =>
      s.refunds.map((r) => ({
        ...r,
        saleNumber: s.saleNumber,
      })),
    );
  }, [salesQuery.data]);
  const paid = payments.reduce((s, p) => s + p.amount, 0);
  const refunded = refunds.reduce((s, r) => s + r.amount, 0);

  const compareSeries = metrics.revenueSeries.map((d) => ({
    label: d.label,
    collected: d.revenue,
    refunds: Math.round(d.revenue * 0.04),
  }));

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Payments report"
        description="Immutable payment and refund facts"
        actions={
          hasPermission("reports:export") ? (
            <Button type="button" variant="outline" size="sm">
              Export CSV
            </Button>
          ) : null
        }
      />
      <div className="space-y-4 px-page py-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Payments recorded" value={String(payments.length)} />
          <StatCard label="Amount collected" value={formatMoney(paid)} />
          <StatCard label="Refunds" value={formatMoney(refunded)} />
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <Panel
            className="xl:col-span-2"
            title="Collected vs refund estimate"
            description="Daily collected volume with illustrative refund band"
          >
            <div className="px-2 py-3">
              <TrendLineChart
                data={compareSeries}
                height={260}
                series={[
                  {
                    dataKey: "collected",
                    name: "Collected",
                    color: colors.chart.profit,
                  },
                  {
                    dataKey: "refunds",
                    name: "Refunds",
                    color: colors.chart.returns,
                  },
                ]}
              />
            </div>
          </Panel>
          <Panel title="Method mix" description="Recorded payment methods">
            <div className="px-2 py-3">
              <DonutChart data={metrics.paymentMix} height={260} />
            </div>
          </Panel>
        </div>

        <Panel title="Payment ledger">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="bg-muted/80 text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium">Sale</th>
                  <th className="px-3 py-2 text-left font-medium">Method</th>
                  <th className="px-3 py-2 text-left font-medium">Amount</th>
                  <th className="px-3 py-2 text-left font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-border">
                    <td className="px-3 py-2 font-medium">{p.saleNumber}</td>
                    <td className="px-3 py-2 capitalize">{p.method}</td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatMoney(p.amount)}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {new Date(p.recordedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function InventoryReportPage() {
  const { hasPermission } = useWorkspace();
  const balancesQuery = useStockBalancesQuery();
  const movementsQuery = useMovementsQuery();
  const salesQuery = useSalesQuery();

  const balances = balancesQuery.data ?? [];
  const low = balances.filter((b) => stockHealth(b) === "low").length;
  const out = balances.filter((b) => stockHealth(b) === "out").length;

  const metrics = useMemo(
    () =>
      buildDashboardMetrics(
        salesQuery.data ?? [],
        balances,
        movementsQuery.data ?? [],
      ),
    [salesQuery.data, balances, movementsQuery.data],
  );

  const movementBars = useMemo(() => {
    const list = movementsQuery.data ?? [];
    const buckets = new Map<MovementType, number>();
    for (const m of list) {
      buckets.set(m.type, (buckets.get(m.type) ?? 0) + 1);
    }
    return [...buckets.entries()].map(([type, value]) => ({
      label: MOVEMENT_TYPE_LABELS[type],
      value,
    }));
  }, [movementsQuery.data]);

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Inventory report"
        description="Availability projections and movement volume"
        actions={
          hasPermission("reports:export") ? (
            <Button type="button" variant="outline" size="sm">
              Export CSV
            </Button>
          ) : null
        }
      />
      <div className="space-y-4 px-page py-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Tracked SKUs" value={String(balances.length)} />
          <StatCard label="Low stock" value={String(low)} />
          <StatCard
            label="Movements"
            value={String(movementsQuery.data?.length ?? 0)}
          />
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <Panel title="Stock health" description="Projection bands">
            <div className="px-2 py-3">
              <DonutChart data={metrics.stockHealth} height={240} />
            </div>
          </Panel>
          <Panel
            className="xl:col-span-2"
            title="Movement reasons"
            description="Volume by reason / type"
          >
            <div className="px-2 py-3">
              <MultiBarChart
                data={movementBars}
                height={240}
                series={[
                  {
                    dataKey: "value",
                    name: "Movements",
                    color: colors.chart.inventory,
                  },
                ]}
              />
            </div>
          </Panel>
        </div>

        <Panel title="Attention SKUs" description="Low and out-of-stock first">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="bg-muted/80 text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium">Product</th>
                  <th className="px-3 py-2 text-left font-medium">Branch</th>
                  <th className="px-3 py-2 text-left font-medium">On hand</th>
                  <th className="px-3 py-2 text-left font-medium">Health</th>
                </tr>
              </thead>
              <tbody>
                {balances
                  .filter((b) => {
                    const h = stockHealth(b);
                    return h === "low" || h === "out" || out + low === 0;
                  })
                  .slice(0, 25)
                  .map((b) => {
                    const health = stockHealth(b);
                    return (
                      <tr key={b.id} className="border-b border-border">
                        <td className="px-3 py-2 font-medium">{b.productName}</td>
                        <td className="px-3 py-2">{b.branchCode}</td>
                        <td className="px-3 py-2 tabular-nums">{b.onHand}</td>
                        <td className="px-3 py-2">
                          <StatusBadge
                            status={
                              health === "out"
                                ? "cancelled"
                                : health === "low"
                                  ? "pending"
                                  : "completed"
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
