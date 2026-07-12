import { useMemo } from "react";
import { Link } from "react-router";
import { useStockBalancesQuery } from "~/features/inventory/api/inventory-mutations";
import { useMovementsQuery } from "~/features/inventory/api/inventory-mutations";
import { stockHealth } from "~/features/inventory/types";
import { useSalesQuery } from "~/features/sales/api/sales-mutations";
import { formatMoney } from "~/features/sales/types";
import { PageHeader, StatCard } from "~/shared/components/page-primitives";
import { useWorkspace } from "~/shared/providers/workspace-provider";

export function ReportsHubPage() {
  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Reports"
        description="Read-only projections from completed commercial and stock facts"
      />
      <div className="mx-page grid gap-3 py-4 sm:grid-cols-3">
        {[
          { href: "/reports/sales", title: "Sales", desc: "Completed sales revenue" },
          { href: "/reports/payments", title: "Payments", desc: "Recorded payments & refunds" },
          { href: "/reports/inventory", title: "Inventory", desc: "Availability & movements" },
        ].map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="rounded-md border border-border bg-card p-4 transition-colors hover:border-primary"
          >
            <h2 className="text-sm font-semibold">{item.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SalesReportPage() {
  const { branch } = useWorkspace();
  const salesQuery = useSalesQuery();
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
        description={`Scope: Organization · Freshness: live mock · Branch highlight ${branch.code}`}
      />
      <div className="grid gap-3 px-page py-3 sm:grid-cols-3">
        <StatCard label="Completed sales" value={String(completed.length)} />
        <StatCard label="Revenue (all)" value={formatMoney(revenue)} />
        <StatCard
          label={`Revenue (${branch.code})`}
          value={formatMoney(branchRevenue)}
        />
      </div>
      <div className="mx-page mb-4 overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
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
    </div>
  );
}

export function PaymentsReportPage() {
  const salesQuery = useSalesQuery();
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

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Payments report"
        description="Immutable payment and refund facts"
      />
      <div className="grid gap-3 px-page py-3 sm:grid-cols-3">
        <StatCard label="Payments recorded" value={String(payments.length)} />
        <StatCard label="Amount collected" value={formatMoney(paid)} />
        <StatCard label="Refunds" value={formatMoney(refunded)} />
      </div>
      <div className="mx-page mb-4 overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
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
    </div>
  );
}

export function InventoryReportPage() {
  const balancesQuery = useStockBalancesQuery();
  const movementsQuery = useMovementsQuery();
  const balances = balancesQuery.data ?? [];
  const low = balances.filter((b) => stockHealth(b) === "low").length;
  const out = balances.filter((b) => stockHealth(b) === "out").length;

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Inventory report"
        description="Availability projections and movement volume"
      />
      <div className="grid gap-3 px-page py-3 sm:grid-cols-3">
        <StatCard label="Tracked SKUs" value={String(balances.length)} />
        <StatCard label="Low stock" value={String(low)} />
        <StatCard
          label="Movements"
          value={String(movementsQuery.data?.length ?? 0)}
        />
      </div>
      <div className="mx-page mb-4 overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
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
              .map((b) => (
                <tr key={b.id} className="border-b border-border">
                  <td className="px-3 py-2 font-medium">{b.productName}</td>
                  <td className="px-3 py-2">{b.branchCode}</td>
                  <td className="px-3 py-2 tabular-nums">{b.onHand}</td>
                  <td className="px-3 py-2 capitalize">{stockHealth(b)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
