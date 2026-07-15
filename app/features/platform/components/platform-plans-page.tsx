import { usePlatformPlansQuery } from "~/features/platform/api/platform-mutations";
import { formatMoney } from "~/features/sales/types";
import { LoadingState, PageBody, PageHeader } from "~/shared/components/page-primitives";

function PlatformPlansPage() {
  const query = usePlatformPlansQuery();

  if (query.isLoading) return <LoadingState />;

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Plans & Capabilities"
        description="Commercial packs entitled to Organizations — capabilities gate tenant features"
      />

      <PageBody className="grid gap-4 md:grid-cols-3">
        {(query.data ?? []).map((plan) => (
          <section
            key={plan.id}
            className="rounded border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-[15px] font-semibold text-heading">
                  {plan.label}
                </h2>
                <p className="mt-1 font-money text-[18px] font-semibold text-heading">
                  {plan.monthlyPrice > 0
                    ? `${formatMoney(plan.monthlyPrice)}/mo`
                    : "Custom"}
                </p>
              </div>
              <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {plan.tenants} tenants
              </span>
            </div>
            <p className="mt-3 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Capabilities
            </p>
            <ul className="mt-1.5 space-y-1">
              {plan.capabilities.map((cap) => (
                <li
                  key={cap}
                  className="rounded bg-muted/60 px-2 py-1 font-mono text-[11px] text-body"
                >
                  {cap}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </PageBody>
    </div>
  );
}

export { PlatformPlansPage };
