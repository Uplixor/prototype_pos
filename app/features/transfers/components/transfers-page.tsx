import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useProductsQuery } from "~/features/catalog/hooks/use-catalog-queries";
import {
  useCompleteTransferMutation,
  useCreateTransferMutation,
  useTransfersQuery,
} from "~/features/transfers/api/transfers-mutations";
import { BRANCH_OPTIONS } from "~/features/catalog/data/catalog-store";
import { FilterBar, PageBody, PageHeader } from "~/shared/components/page-primitives";
import { PermissionGuard } from "~/shared/components/permission-guard";
import { StatusBadge } from "~/shared/components/status-badge";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/shared/components/ui/sheet";
import { useWorkspace } from "~/shared/providers/workspace-provider";

function TransfersPage() {
  const { organization, user } = useWorkspace();
  const transfersQuery = useTransfersQuery();
  const createMutation = useCreateTransferMutation();
  const completeMutation = useCompleteTransferMutation();
  const productsQuery = useProductsQuery();
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState("br_hq");
  const [destination, setDestination] = useState("br_dt");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState(1);

  const tracked = useMemo(
    () =>
      (productsQuery.data ?? []).filter(
        (p) => p.status === "active" && p.trackInventory,
      ),
    [productsQuery.data],
  );

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Transfers"
        description="Paired outbound and inbound Stock Movements across branches"
        actions={
          <PermissionGuard permissions={["inventory:write"]}>
            <Button type="button" size="sm" onClick={() => setOpen(true)}>
              <Plus className="size-3.5" />
              New transfer
            </Button>
          </PermissionGuard>
        }
      />
      <FilterBar>
        <p className="text-xs text-muted-foreground">
          {(transfersQuery.data ?? []).length} transfers
        </p>
      </FilterBar>
      <PageBody className="overflow-x-auto rounded-md border border-border p-0">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-muted/80 text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-medium">Transfer</th>
              <th className="px-3 py-2 text-left font-medium">Route</th>
              <th className="px-3 py-2 text-left font-medium">Items</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(transfersQuery.data ?? []).map((t) => (
              <tr key={t.id} className="border-b border-border">
                <td className="px-3 py-2 font-medium">{t.transferNumber}</td>
                <td className="px-3 py-2">
                  {t.originCode} → {t.destinationCode}
                </td>
                <td className="px-3 py-2 tabular-nums">{t.items.length}</td>
                <td className="px-3 py-2">
                  <StatusBadge
                    status={
                      t.status === "completed"
                        ? "completed"
                        : t.status === "cancelled"
                          ? "cancelled"
                          : "pending"
                    }
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  {t.status === "pending" ? (
                    <PermissionGuard permissions={["inventory:write"]}>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={completeMutation.isPending}
                        onClick={() =>
                          completeMutation.mutate({
                            id: t.id,
                            actorName: user.name,
                          })
                        }
                      >
                        Complete
                      </Button>
                    </PermissionGuard>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageBody>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent size="md">
          <SheetHeader>
            <SheetTitle>New transfer</SheetTitle>
          </SheetHeader>
          <SheetBody className="space-y-3">
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger>
                <SelectValue placeholder="Origin" />
              </SelectTrigger>
              <SelectContent>
                {BRANCH_OPTIONS.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue placeholder="Destination" />
              </SelectTrigger>
              <SelectContent>
                {BRANCH_OPTIONS.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                {tracked.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            />
          </SheetBody>
          <SheetFooter>
            <Button
              type="button"
              size="sm"
              disabled={!productId || createMutation.isPending}
              onClick={() => {
                void createMutation
                  .mutateAsync({
                    organizationId: organization.id,
                    originBranchId: origin,
                    destinationBranchId: destination,
                    items: [{ productId, quantity: qty }],
                    actorName: user.name,
                  })
                  .then(() => setOpen(false));
              }}
            >
              Create transfer
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export { TransfersPage };
