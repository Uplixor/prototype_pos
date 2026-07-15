import { Link } from "react-router";
import {
  usePlatformAuditQuery,
  usePlatformMetricsQuery,
  usePlatformTenantsQuery,
} from "~/features/platform/api/platform-mutations";
import { formatMoney } from "~/features/sales/types";
import { LoadingState, MetricCard, PageBody, PageHeader } from "~/shared/components/page-primitives";
import { StatusBadge } from "~/shared/components/status-badge";
import { Button } from "~/shared/components/ui/button";

function PlatformDashboardPage() {
  const metrics = usePlatformMetricsQuery();
  const tenants = usePlatformTenantsQuery();
  const audit = usePlatformAuditQuery();

  if (metrics.isLoading) return <LoadingState />;

  const m = metrics.data;

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Platform overview"
        description="SaaS owner console — organizations, plans, and operational health"
        actions={
          <Button asChild size="sm">
            <Link to="/platform/tenants">Manage tenants</Link>
          </Button>
        }
      />

      <PageBody className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Tenants" value={String(m?.tenants ?? 0)} />
          <MetricCard label="Active" value={String(m?.active ?? 0)} />
          <MetricCard label="Trials" value={String(m?.trial ?? 0)} />
          <MetricCard
            label="Platform MRR"
            value={formatMoney(m?.mrr ?? 0)}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-[14px] font-semibold text-heading">
              Recent tenants
            </h2>
            <Link
              to="/platform/tenants"
              className="text-[12px] font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {(tenants.data ?? []).slice(0, 5).map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-heading">
                    {t.name}
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {t.slug} · {t.plan}
                  </p>
                </div>
                <StatusBadge
                  status={
                    t.status === "active"
                      ? "active"
                      : t.status === "trial"
                        ? "pending"
                        : t.status === "suspended"
                          ? "cancelled"
                          : "inactive"
                  }
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-[14px] font-semibold text-heading">
              Platform audit
            </h2>
            <Link
              to="/platform/audit"
              className="text-[12px] font-medium text-primary hover:underline"
            >
              Full log
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {(audit.data ?? []).slice(0, 5).map((a) => (
              <li key={a.id} className="px-4 py-2.5">
                <p className="text-[13px] font-medium text-heading">
                  {a.action}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {a.target} · {a.actor}
                </p>
              </li>
            ))}
          </ul>
        </section>
        </div>
      </PageBody>
    </div>
  );
}

export { PlatformDashboardPage };
