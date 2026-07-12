import { useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { salesKeys } from "~/features/sales/api/query-keys";
import { useSellableProductsQuery } from "~/features/sales/api/sales-mutations";
import {
  createSale,
  recordPayment,
} from "~/features/sales/data/sales-store";
import { formatMoney, round2 } from "~/features/sales/types";
import { SearchInput } from "~/shared/components/search-input";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select";
import { useWorkspace } from "~/shared/providers/workspace-provider";
import { cn } from "~/shared/utils/cn";

type CartLine = {
  productId: string;
  name: string;
  sku: string;
  unitPrice: number;
  taxRate: number;
  quantity: number;
};

type ReceiptSummary = {
  saleNumber: string;
  total: number;
  method: string;
  itemCount: number;
};

function taxRateFromProfile(profile: string): number {
  if (profile.startsWith("Standard")) return 0.08;
  if (profile.startsWith("Reduced")) return 0.05;
  return 0;
}

function PosPage() {
  const queryClient = useQueryClient();
  const { organization, branch } = useWorkspace();
  const productsQuery = useSellableProductsQuery(branch.id);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customerName, setCustomerName] = useState("Walk-in");
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState<"cash" | "card" | "other">("card");
  const [receipt, setReceipt] = useState<ReceiptSummary | null>(null);
  const [pending, setPending] = useState(false);

  const products = useMemo(() => {
    const list = productsQuery.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    );
  }, [productsQuery.data, search]);

  const totals = useMemo(() => {
    const subtotal = round2(
      cart.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
    );
    const taxTotal = round2(
      cart.reduce((s, l) => s + l.unitPrice * l.quantity * l.taxRate, 0),
    );
    return { subtotal, taxTotal, total: round2(subtotal + taxTotal) };
  }, [cart]);

  function addProduct(productId: string) {
    const product = (productsQuery.data ?? []).find((p) => p.id === productId);
    if (!product) return;
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, quantity: l.quantity + 1 } : l,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          unitPrice: product.price,
          taxRate: taxRateFromProfile(product.taxProfile),
          quantity: 1,
        },
      ];
    });
  }

  async function completeSale() {
    if (cart.length === 0) return;
    setPending(true);
    try {
      const sale = await createSale({
        organizationId: organization.id,
        branchId: branch.id,
        customerName,
        items: cart.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
        })),
      });
      const completed = await recordPayment(sale.id, {
        method,
        amount: sale.total,
        idempotencyKey: `pos_${sale.id}`,
      });
      void queryClient.invalidateQueries({ queryKey: salesKeys.list() });
      setReceipt({
        saleNumber: completed.saleNumber,
        total: completed.total,
        method,
        itemCount: completed.items.length,
      });
      setCart([]);
      toast.success(`${completed.saleNumber} completed`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sale failed");
    } finally {
      setPending(false);
    }
  }

  if (receipt) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-page">
        <div className="w-full max-w-sm rounded-md border border-border bg-card p-6 text-center">
          <p className="text-xs text-muted-foreground">Sale completed</p>
          <h1 className="mt-1 text-lg font-semibold">{receipt.saleNumber}</h1>
          <p className="mt-3 text-2xl font-semibold tabular-nums">
            {formatMoney(receipt.total)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {receipt.itemCount} items · {receipt.method}
          </p>
          <Button
            type="button"
            className="mt-6 w-full"
            onClick={() => setReceipt(null)}
          >
            New sale
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-3rem)] min-h-0">
      <section className="flex min-w-0 flex-1 flex-col border-r border-border">
        <div className="border-b border-border bg-card px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-sm font-semibold">POS · {branch.code}</h1>
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              containerClassName="w-56"
            />
          </div>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2 overflow-auto p-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => addProduct(product.id)}
              className="flex min-h-24 flex-col items-start justify-between rounded-md border border-border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-primary-muted"
            >
              <span className="text-sm font-medium leading-tight">
                {product.name}
              </span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {formatMoney(product.price)}
              </span>
            </button>
          ))}
        </div>
      </section>

      <aside className="flex w-full max-w-md flex-col bg-card">
        <div className="border-b border-border px-3 py-2">
          <h2 className="text-sm font-semibold">Current sale</h2>
          <Input
            className="mt-2"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer"
          />
        </div>
        <ul className="flex-1 divide-y divide-border overflow-auto">
          {cart.length === 0 ? (
            <li className="px-3 py-8 text-center text-xs text-muted-foreground">
              Tap products to add lines
            </li>
          ) : (
            cart.map((line) => (
              <li
                key={line.productId}
                className="flex items-center gap-2 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{line.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatMoney(line.unitPrice)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      setCart((prev) =>
                        prev
                          .map((l) =>
                            l.productId === line.productId
                              ? { ...l, quantity: l.quantity - 1 }
                              : l,
                          )
                          .filter((l) => l.quantity > 0),
                      )
                    }
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="w-6 text-center text-sm tabular-nums">
                    {line.quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      setCart((prev) =>
                        prev.map((l) =>
                          l.productId === line.productId
                            ? { ...l, quantity: l.quantity + 1 }
                            : l,
                        ),
                      )
                    }
                  >
                    <Plus className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      setCart((prev) =>
                        prev.filter((l) => l.productId !== line.productId),
                      )
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="space-y-2 border-t border-border p-3">
          <Row label="Subtotal" value={formatMoney(totals.subtotal)} />
          <Row label="Tax" value={formatMoney(totals.taxTotal)} />
          <Row label="Total" value={formatMoney(totals.total)} strong />
          <Select
            value={method}
            onValueChange={(v) => setMethod(v as typeof method)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={cart.length === 0}
              onClick={() => setCart([])}
            >
              Clear
            </Button>
            <Button
              type="button"
              className="flex-1"
              disabled={cart.length === 0 || pending}
              onClick={() => void completeSale()}
            >
              {pending ? "Processing…" : "Charge"}
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("tabular-nums", strong && "font-semibold")}>
        {value}
      </span>
    </div>
  );
}

export { PosPage };
