import { useMemo, useState } from "react";
import {
  usePlatformTenantsQuery,
  useSetTenantStatusMutation,
} from "~/features/platform/api/platform-mutations";
import { formatMoney } from "~/features/sales/types";
import { LoadingState, PageBody, PageHeader } from "~/shared/components/page-primitives";
import { SearchInput } from "~/shared/components/search-input";
import { StatusBadge } from "~/shared/components/status-badge";
import { Button } from "~/shared/components/ui/button";

function statusTone(status: string) {
  if (status === "active") return "active" as const;
  if (status === "trial") return "pending" as const;
  if (status === "suspended") return "cancelled" as const;
  return "inactive" as const;
}

function PlatformTenantsPage() {
  const query = usePlatformTenantsQuery();
  const setStatus = useSetTenantStatusMutation();
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = query.data ?? [];
    if (!q) return list;
    return list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.plan.includes(q),
    );
  }, [query.data, search]);

  if (query.isLoading) return <LoadingState />;

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Tenants"
        description="Organizations on the platform — suspend, restore, and inspect plan scope"
      />

      <PageBody className="space-y-3">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tenants…"
          containerClassName="max-w-sm"
        />

        <div className="overflow-x-auto overscroll-x-contain rounded-md border border-border [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[48rem] text-sm">
          <thead className="bg-muted/80 text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-medium">Organization</th>
              <th className="px-3 py-2 text-left font-medium">Plan</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-right font-medium">Branches</th>
              <th className="px-3 py-2 text-right font-medium">Users</th>
              <th className="px-3 py-2 text-right font-medium">MRR</th>
              <th className="px-3 py-2 text-left font-medium">Region</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-b border-border">
                <td className="px-3 py-2">
                  <p className="font-medium text-heading">{t.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {t.slug}
                  </p>
                </td>
                <td className="px-3 py-2 capitalize">{t.plan}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={statusTone(t.status)} />
                </td>
                <td className="px-3 py-2 text-right font-money">{t.branches}</td>
                <td className="px-3 py-2 text-right font-money">{t.users}</td>
                <td className="px-3 py-2 text-right font-money">
                  {formatMoney(t.mrr)}
                </td>
                <td className="px-3 py-2 font-mono text-[11px]">{t.region}</td>
                <td className="px-3 py-2 text-right">
                  {t.status === "active" || t.status === "trial" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={setStatus.isPending}
                      onClick={() =>
                        setStatus.mutate({ id: t.id, status: "suspended" })
                      }
                    >
                      Suspend
                    </Button>
                  ) : t.status === "suspended" ? (
                    <Button
                      type="button"
                      size="sm"
                      disabled={setStatus.isPending}
                      onClick={() =>
                        setStatus.mutate({ id: t.id, status: "active" })
                      }
                    >
                      Restore
                    </Button>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </PageBody>
    </div>
  );
}

export { PlatformTenantsPage };
