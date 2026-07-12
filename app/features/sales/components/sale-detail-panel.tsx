import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Plus, Trash2 } from "lucide-react";
import type { Resolver } from "react-hook-form";
import {
  useAddSaleItemMutation,
  useCancelSaleMutation,
  useRecordPaymentMutation,
  useRefundSaleMutation,
  useRemoveSaleItemMutation,
  useRequestPaymentMutation,
  useSaleQuery,
  useSellableProductsQuery,
} from "~/features/sales/api/sales-mutations";
import {
  recordPaymentSchema,
  refundSaleSchema,
  type RecordPaymentValues,
  type RefundSaleValues,
} from "~/features/sales/schema";
import {
  formatMoney,
  isSaleMutable,
  round2,
  saleRefundableAmount,
  saleStatusToBadge,
  SALE_STATUS_LABELS,
  type Sale,
} from "~/features/sales/types";
import { ConfirmDialog } from "~/shared/components/confirm-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/form/form";
import { useAppForm } from "~/shared/components/form/use-app-form";
import { LoadingState } from "~/shared/components/page-primitives";
import { PermissionGuard } from "~/shared/components/permission-guard";
import { StatusBadge } from "~/shared/components/status-badge";
import { ActivityFeed, type TimelineItem } from "~/shared/components/timeline";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select";
import { Separator } from "~/shared/components/ui/separator";
import { Textarea } from "~/shared/components/ui/textarea";
import { useDrawer } from "~/shared/providers/drawer-provider";

export type SaleDetailPanelProps = {
  saleId: string;
  initialSale?: Sale;
  drawerId: string;
};

function SaleDetailPanel({
  saleId,
  initialSale,
  drawerId,
}: SaleDetailPanelProps) {
  const { closeDrawer } = useDrawer();
  const saleQuery = useSaleQuery(saleId);
  const sale = saleQuery.data ?? initialSale;

  const [cancelOpen, setCancelOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [refundFormOpen, setRefundFormOpen] = useState(false);
  const [pendingRefund, setPendingRefund] = useState<RefundSaleValues | null>(
    null,
  );

  const branchId = sale?.branchId ?? "";
  const sellableQuery = useSellableProductsQuery(branchId);
  const addItem = useAddSaleItemMutation(saleId);
  const removeItem = useRemoveSaleItemMutation(saleId);
  const requestPay = useRequestPaymentMutation();
  const recordPay = useRecordPaymentMutation(saleId);
  const cancelMutation = useCancelSaleMutation();
  const refundMutation = useRefundSaleMutation(saleId);

  const amountDue = sale
    ? round2(Math.max(sale.total - sale.amountPaid, 0))
    : 0;
  const refundable = sale ? saleRefundableAmount(sale) : 0;

  const paymentForm = useAppForm<RecordPaymentValues>({
    defaultValues: {
      method: "card",
      amount: amountDue || 0,
    },
    resolver: zodResolver(recordPaymentSchema) as Resolver<RecordPaymentValues>,
  });

  const { setValue: setPaymentAmount } = paymentForm;

  useEffect(() => {
    setPaymentAmount("amount", amountDue);
  }, [amountDue, setPaymentAmount]);

  const refundForm = useAppForm<RefundSaleValues>({
    defaultValues: {
      amount: refundable || 0,
      reason: "",
    },
    resolver: zodResolver(refundSaleSchema) as Resolver<RefundSaleValues>,
  });

  const { setValue: setRefundAmount } = refundForm;

  useEffect(() => {
    setRefundAmount("amount", refundable);
  }, [refundable, setRefundAmount]);

  const timeline = useMemo(() => {
    if (!sale) return [] as TimelineItem[];
    const items: TimelineItem[] = [
      {
        id: "created",
        title: "Sale created",
        description: `${sale.saleNumber} at ${sale.branchCode}`,
        timestamp: formatWhen(sale.createdAt),
      },
      ...sale.payments.map((payment) => ({
        id: payment.id,
        title: `Payment · ${payment.method}`,
        description: formatMoney(payment.amount),
        timestamp: formatWhen(payment.recordedAt),
        tone: "success" as const,
      })),
    ];
    if (sale.completedAt) {
      items.push({
        id: "completed",
        title: "Sale completed",
        description: "Commercial snapshot frozen",
        timestamp: formatWhen(sale.completedAt),
        tone: "success",
      });
    }
    if (sale.cancelledAt) {
      items.push({
        id: "cancelled",
        title: "Sale cancelled",
        description: "History retained",
        timestamp: formatWhen(sale.cancelledAt),
        tone: "danger",
      });
    }
    items.push(
      ...sale.refunds.map((refund) => ({
        id: refund.id,
        title: "Refund recorded",
        description: `${formatMoney(refund.amount)} · ${refund.reason}`,
        timestamp: formatWhen(refund.recordedAt),
        tone: "warning" as const,
      })),
    );
    return items;
  }, [sale]);

  if (!sale) {
    return <LoadingState label="Loading sale…" />;
  }

  const mutable = isSaleMutable(sale.status);
  const canAmend = sale.status === "open";
  const canRefund = sale.status === "completed" && refundable > 0;

  async function onRecordPayment(values: RecordPaymentValues) {
    await recordPay.mutateAsync({
      method: values.method,
      amount: values.amount,
      idempotencyKey: `idem_${saleId}_${Date.now()}`,
    });
  }

  function onRefundSubmit(values: RefundSaleValues) {
    setPendingRefund(values);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            status={saleStatusToBadge(sale.status)}
            label={SALE_STATUS_LABELS[sale.status]}
          />
          {!mutable ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Lock className="size-3" aria-hidden />
              Immutable commercial snapshot
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <Meta label="Customer" value={sale.customerName} />
          <Meta label="Branch" value={sale.branchCode} />
          <Meta label="Subtotal" value={formatMoney(sale.subtotal)} />
          <Meta label="Tax" value={formatMoney(sale.taxTotal)} />
          <Meta label="Total" value={formatMoney(sale.total)} />
          <Meta label="Paid" value={formatMoney(sale.amountPaid)} />
        </div>

        {sale.notes ? (
          <p className="rounded-md border border-border bg-muted px-2.5 py-2 text-xs text-muted-foreground">
            {sale.notes}
          </p>
        ) : null}

        <div>
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Line items
          </h3>
          <ul className="divide-y divide-border rounded-md border border-border">
            {sale.items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-2 px-3 py-2 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.sku} · {item.quantity} × {formatMoney(item.unitPrice)}
                    {item.taxRate > 0
                      ? ` + ${(item.taxRate * 100).toFixed(0)}% tax`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium tabular-nums">
                    {formatMoney(item.lineTotal)}
                  </span>
                  {canAmend ? (
                    <PermissionGuard permissions={["sales:write"]}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${item.name}`}
                        disabled={
                          removeItem.isPending || sale.items.length <= 1
                        }
                        onClick={() => removeItem.mutate(item.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </PermissionGuard>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {canAmend ? (
          <PermissionGuard permissions={["sales:write"]}>
            <div className="space-y-2 rounded-md border border-border p-3">
              <p className="text-xs font-medium">Add product</p>
              <div className="grid grid-cols-[1fr_72px_auto] gap-2">
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sellable product" />
                  </SelectTrigger>
                  <SelectContent>
                    {(sellableQuery.data ?? []).map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(Math.max(1, Number(event.target.value) || 1))
                  }
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={!productId || addItem.isPending}
                  onClick={() => {
                    addItem.mutate(
                      { productId, quantity },
                      {
                        onSuccess: () => {
                          setProductId("");
                          setQuantity(1);
                        },
                      },
                    );
                  }}
                >
                  <Plus className="size-3.5" />
                  Add
                </Button>
              </div>
            </div>
          </PermissionGuard>
        ) : null}

        {mutable && amountDue > 0 ? (
          <PermissionGuard permissions={["sales:write"]}>
            <div className="space-y-3 rounded-md border border-border p-3">
              <p className="text-xs font-medium">
                Record payment · due {formatMoney(amountDue)}
              </p>
              <Form {...paymentForm}>
                <form
                  className="space-y-3"
                  onSubmit={paymentForm.handleSubmit(onRecordPayment)}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={paymentForm.control}
                      name="method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Method</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="card">Card</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={paymentForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              max={amountDue}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full"
                    disabled={recordPay.isPending}
                  >
                    {recordPay.isPending ? "Recording…" : "Record payment"}
                  </Button>
                </form>
              </Form>
            </div>
          </PermissionGuard>
        ) : null}

        {refundFormOpen && canRefund ? (
          <PermissionGuard permissions={["sales:refund"]}>
            <div className="space-y-3 rounded-md border border-warning bg-warning-muted/40 p-3">
              <p className="text-xs font-medium">
                Refund · up to {formatMoney(refundable)}
              </p>
              <Form {...refundForm}>
                <form
                  className="space-y-3"
                  onSubmit={refundForm.handleSubmit(onRefundSubmit)}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={refundForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              max={refundable}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={refundForm.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={2}
                            placeholder="Why is this sale being refunded?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setRefundFormOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                    >
                      Review refund
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </PermissionGuard>
        ) : null}

        <Separator />

        <div>
          <h3 className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Timeline
          </h3>
          <ActivityFeed items={timeline} />
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
        {sale.status === "open" ? (
          <PermissionGuard permissions={["sales:write"]}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={requestPay.isPending}
              onClick={() => requestPay.mutate(sale.id)}
            >
              Request payment
            </Button>
          </PermissionGuard>
        ) : null}
        {mutable ? (
          <PermissionGuard permissions={["sales:write"]}>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setCancelOpen(true)}
            >
              Cancel sale
            </Button>
          </PermissionGuard>
        ) : null}
        {canRefund ? (
          <PermissionGuard permissions={["sales:refund"]}>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setRefundFormOpen((prev) => !prev)}
            >
              Refund
            </Button>
          </PermissionGuard>
        ) : null}
      </div>

      <ConfirmDialog
        open={Boolean(pendingRefund)}
        onOpenChange={(open) => {
          if (!open) setPendingRefund(null);
        }}
        title={`Refund ${pendingRefund ? formatMoney(pendingRefund.amount) : ""}?`}
        description={`This will refund ${sale.saleNumber} for ${
          pendingRefund ? formatMoney(pendingRefund.amount) : ""
        }. Reason: "${pendingRefund?.reason ?? ""}". This retains audit history and cannot be undone.`}
        confirmLabel="Confirm refund"
        variant="destructive"
        loading={refundMutation.isPending}
        onConfirm={() => {
          if (!pendingRefund) return;
          refundMutation.mutate(pendingRefund, {
            onSuccess: () => {
              setPendingRefund(null);
              setRefundFormOpen(false);
              refundForm.reset({ amount: 0, reason: "" });
            },
          });
        }}
      />

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title={`Cancel ${sale.saleNumber}?`}
        description="Cancellation retains audit history and never deletes the sale. Completed sales cannot be cancelled."
        confirmLabel="Cancel sale"
        variant="destructive"
        loading={cancelMutation.isPending}
        onConfirm={() => {
          cancelMutation.mutate(sale.id, {
            onSuccess: () => {
              setCancelOpen(false);
              closeDrawer(drawerId);
            },
          });
        }}
      />
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

export { SaleDetailPanel };
