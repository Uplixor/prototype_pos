import { usePlatformAuditQuery } from "~/features/platform/api/platform-mutations";
import { LoadingState, PageBody, PageHeader } from "~/shared/components/page-primitives";

function PlatformAuditPage() {
  const query = usePlatformAuditQuery();

  if (query.isLoading) return <LoadingState />;

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Platform audit"
        description="Operator actions across tenants — separate from Organization audit trails"
      />

      <PageBody className="overflow-x-auto overscroll-x-contain rounded-md border border-border p-0 [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-muted/80 text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-medium">When</th>
              <th className="px-3 py-2 text-left font-medium">Actor</th>
              <th className="px-3 py-2 text-left font-medium">Action</th>
              <th className="px-3 py-2 text-left font-medium">Target</th>
              <th className="px-3 py-2 text-left font-medium">Detail</th>
            </tr>
          </thead>
          <tbody>
            {(query.data ?? []).map((a) => (
              <tr key={a.id} className="border-b border-border">
                <td className="px-3 py-2 font-mono text-[11px] whitespace-nowrap">
                  {new Date(a.at).toLocaleString()}
                </td>
                <td className="px-3 py-2">{a.actor}</td>
                <td className="px-3 py-2 font-mono text-[12px]">{a.action}</td>
                <td className="px-3 py-2 font-medium">{a.target}</td>
                <td className="px-3 py-2 text-muted-foreground">{a.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageBody>
    </div>
  );
}

export { PlatformAuditPage };
