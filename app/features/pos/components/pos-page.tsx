import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  CreditCard,
  Ellipsis,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { salesKeys } from "~/features/sales/api/query-keys";
import { useSellableProductsQuery } from "~/features/sales/api/sales-mutations";
import {
  createSale,
  recordPayment,
} from "~/features/sales/data/sales-store";
import { formatMoney, round2 } from "~/features/sales/types";
import { ProductImage } from "~/features/catalog/components/product-image";
import {
  activeVariants,
  formatProductPrice,
  type Product,
} from "~/features/catalog/types";
import { SearchInput } from "~/shared/components/search-input";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/shared/components/ui/sheet";
import { useWorkspace } from "~/shared/providers/workspace-provider";
import { cn } from "~/shared/utils/cn";

type CartLine = {
  productId: string;
  variantId?: string;
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

type PayMethod = "cash" | "card" | "other";
type MobilePane = "browse" | "cart";

const PAY_METHODS: {
  id: PayMethod;
  label: string;
  icon: typeof CreditCard;
}[] = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "other", label: "Other", icon: Ellipsis },
];

function taxRateFromProfile(profile: string): number {
  if (profile.startsWith("Standard")) return 0.08;
  if (profile.startsWith("Reduced")) return 0.05;
  return 0;
}

function lineKey(productId: string, variantId?: string) {
  return `${productId}::${variantId ?? ""}`;
}

function PosPage() {
  const queryClient = useQueryClient();
  const { organization, branch } = useWorkspace();
  const productsQuery = useSellableProductsQuery(branch.id);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customerName, setCustomerName] = useState("Walk-in");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [method, setMethod] = useState<PayMethod>("card");
  const [receipt, setReceipt] = useState<ReceiptSummary | null>(null);
  const [pending, setPending] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>("browse");
  const [variantPicker, setVariantPicker] = useState<Product | null>(null);

  const categories = useMemo(() => {
    const names = new Set<string>();
    for (const p of productsQuery.data ?? []) {
      if (p.categoryName) names.add(p.categoryName);
    }
    return ["all", ...Array.from(names).sort()];
  }, [productsQuery.data]);

  const products = useMemo(() => {
    let list = productsQuery.data ?? [];
    if (category !== "all") {
      list = list.filter((p) => p.categoryName === category);
    }
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => {
      if (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode?.toLowerCase().includes(q)
      ) {
        return true;
      }
      return p.variants.some(
        (v) =>
          v.sku.toLowerCase().includes(q) ||
          v.barcode?.toLowerCase().includes(q) ||
          v.name.toLowerCase().includes(q),
      );
    });
  }, [productsQuery.data, search, category]);

  const totals = useMemo(() => {
    const subtotal = round2(
      cart.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
    );
    const taxTotal = round2(
      cart.reduce((s, l) => s + l.unitPrice * l.quantity * l.taxRate, 0),
    );
    return { subtotal, taxTotal, total: round2(subtotal + taxTotal) };
  }, [cart]);

  const itemCount = cart.reduce((s, l) => s + l.quantity, 0);

  function pushLine(product: Product, variantId?: string) {
    const variants = activeVariants(product);
    const variant =
      variantId != null
        ? variants.find((v) => v.id === variantId)
        : variants.length === 1
          ? variants[0]
          : undefined;
    if (variants.length > 0 && !variant) return;

    const sku = variant?.sku ?? product.sku;
    const name = variant ? `${product.name} · ${variant.name}` : product.name;
    const unitPrice = variant?.price ?? product.price;
    const key = lineKey(product.id, variant?.id);

    setCart((prev) => {
      const existing = prev.find(
        (l) => lineKey(l.productId, l.variantId) === key,
      );
      if (existing) {
        return prev.map((l) =>
          lineKey(l.productId, l.variantId) === key
            ? { ...l, quantity: l.quantity + 1 }
            : l,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant?.id,
          name,
          sku,
          unitPrice,
          taxRate: taxRateFromProfile(product.taxProfile),
          quantity: 1,
        },
      ];
    });
    setVariantPicker(null);
    setMobilePane("cart");
  }

  function addProduct(productId: string) {
    const product = (productsQuery.data ?? []).find((p) => p.id === productId);
    if (!product) return;
    const variants = activeVariants(product);
    if (variants.length > 1) {
      setVariantPicker(product);
      return;
    }
    pushLine(product, variants[0]?.id);
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
          variantId: l.variantId,
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
      setMobilePane("browse");
      toast.success(`${completed.saleNumber} completed`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sale failed");
    } finally {
      setPending(false);
    }
  }

  if (receipt) {
    return (
      <div className="flex h-[calc(100dvh-3rem)] flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_top,var(--color-success-muted),transparent_55%)] px-4">
        <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 text-center shadow-sm">
          <p className="text-[12px] font-medium text-success">Payment recorded</p>
          <h1 className="mt-1 text-[18px] font-semibold text-heading">
            {receipt.saleNumber}
          </h1>
          <p className="mt-3 font-money text-2xl font-semibold text-heading">
            {formatMoney(receipt.total)}
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {receipt.itemCount} items · {receipt.method} · {branch.code}
          </p>
          <Button
            type="button"
            className="mt-6 w-full"
            onClick={() => setReceipt(null)}
          >
            New Order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-3rem)] min-h-0 bg-background">
      <section
        className={cn(
          "min-w-0 flex-1 flex-col",
          mobilePane === "browse" ? "flex" : "hidden md:flex",
        )}
      >
        <header className="flex flex-col gap-2.5 border-b border-border bg-card p-3 sm:p-4">
          <div>
            <h1 className="text-[16px] font-semibold text-heading">
              POS · {branch.code}
            </h1>
            <p className="text-[11px] text-muted-foreground">
              {organization.name} · scan or search to add
            </p>
          </div>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Scan barcode or search SKU"
            containerClassName="w-full"
            className="h-10"
            autoFocus
          />
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "shrink-0 rounded border px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors",
                  category === cat
                    ? "border-primary bg-primary-muted text-primary"
                    : "border-border-strong bg-card text-body hover:bg-muted",
                )}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        </header>

        <div className="grid flex-1 auto-rows-max grid-cols-2 gap-2 overflow-auto p-3 pb-24 sm:grid-cols-3 sm:gap-3 sm:p-4 md:pb-4 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => addProduct(product.id)}
              className="group overflow-hidden rounded border border-border bg-card text-left transition-colors hover:border-primary active:bg-muted"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  size="fill"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="space-y-1 p-2">
                <span className="line-clamp-2 text-[12px] font-medium leading-snug text-heading">
                  {product.name}
                </span>
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate font-mono text-[10px] text-muted-foreground">
                    {product.variants.length > 0
                      ? `${product.variants.length} variants`
                      : product.sku}
                  </span>
                  <span className="shrink-0 font-money text-[12px] font-semibold text-heading">
                    {formatProductPrice(product)}
                  </span>
                </div>
              </div>
            </button>
          ))}
          {products.length === 0 ? (
            <p className="col-span-full py-12 text-center text-[12px] text-muted-foreground">
              No sellable products match this filter
            </p>
          ) : null}
        </div>
      </section>

      <aside
        className={cn(
          "min-h-0 w-full flex-col border-border bg-card md:w-[22rem] md:border-l lg:w-96",
          mobilePane === "cart" ? "flex" : "hidden md:flex",
        )}
      >
        <div className="flex items-center gap-2 border-b border-border px-3 py-2.5 md:hidden">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 px-2"
            onClick={() => setMobilePane("browse")}
          >
            <ArrowLeft className="size-3.5" />
            Products
          </Button>
          <h2 className="text-[14px] font-semibold text-heading">
            Current Order
          </h2>
        </div>

        <div className="hidden border-b border-border px-4 py-3 md:block">
          <h2 className="text-[14px] font-semibold text-heading">
            Current Order
          </h2>
          <Input
            className="mt-2 h-8"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer"
          />
        </div>

        <div className="border-b border-border px-3 py-2 md:hidden">
          <Input
            className="h-8"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer"
          />
        </div>

        <ul className="flex-1 divide-y divide-border overflow-auto">
          {cart.length === 0 ? (
            <li className="px-4 py-10 text-center text-[12px] text-muted-foreground">
              Tap products to add lines
            </li>
          ) : (
            cart.map((line) => {
              const key = lineKey(line.productId, line.variantId);
              return (
              <li
                key={key}
                className="flex items-center gap-2 px-3 py-2.5 sm:px-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-heading">
                    {line.name}
                  </p>
                  <p className="font-money text-[11px] text-muted-foreground">
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
                            lineKey(l.productId, l.variantId) === key
                              ? { ...l, quantity: l.quantity - 1 }
                              : l,
                          )
                          .filter((l) => l.quantity > 0),
                      )
                    }
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="w-6 text-center font-money text-[13px]">
                    {line.quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      setCart((prev) =>
                        prev.map((l) =>
                          lineKey(l.productId, l.variantId) === key
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
                        prev.filter(
                          (l) => lineKey(l.productId, l.variantId) !== key,
                        ),
                      )
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </li>
              );
            })
          )}
        </ul>

        <div className="space-y-3 border-t border-border p-3 sm:p-4">
          <div className="space-y-1.5">
            <Row label="Subtotal" value={formatMoney(totals.subtotal)} />
            <Row label="Tax" value={formatMoney(totals.taxTotal)} />
            <Row label="Total" value={formatMoney(totals.total)} strong />
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
              Payment
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {PAY_METHODS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMethod(id)}
                  className={cn(
                    "flex h-11 flex-col items-center justify-center gap-0.5 rounded border text-[11px] font-semibold transition-colors",
                    method === id
                      ? "border-primary bg-primary-muted text-primary"
                      : "border-border-strong bg-card text-body hover:bg-muted",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1.4fr] gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11"
              disabled={cart.length === 0}
              onClick={() => setCart([])}
            >
              Clear
            </Button>
            <Button
              type="button"
              className="h-11 text-[13px] font-semibold"
              disabled={cart.length === 0 || pending}
              onClick={() => void completeSale()}
            >
              {pending ? "Processing…" : `Charge ${formatMoney(totals.total)}`}
            </Button>
          </div>
        </div>
      </aside>

      {mobilePane === "browse" ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card p-3 md:hidden">
          <Button
            type="button"
            className="h-12 w-full justify-between px-4 text-[13px] font-semibold"
            onClick={() => setMobilePane("cart")}
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="size-4" />
              Cart · {itemCount}
            </span>
            <span className="font-money">{formatMoney(totals.total)}</span>
          </Button>
        </div>
      ) : null}

      <Sheet
        open={Boolean(variantPicker)}
        onOpenChange={(open) => {
          if (!open) setVariantPicker(null);
        }}
      >
        <SheetContent side="bottom" size="md" className="sm:max-w-lg sm:mx-auto">
          <SheetHeader>
            <SheetTitle>{variantPicker?.name ?? "Select variant"}</SheetTitle>
          </SheetHeader>
          <SheetBody className="space-y-2">
            {variantPicker
              ? activeVariants(variantPicker).map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2.5 text-left hover:border-primary hover:bg-muted"
                    onClick={() => pushLine(variantPicker, variant.id)}
                  >
                    <span>
                      <span className="block text-sm font-medium">
                        {variant.name}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {variant.sku}
                      </span>
                    </span>
                    <span className="font-money text-sm font-semibold">
                      {formatMoney(variant.price)}
                    </span>
                  </button>
                ))
              : null}
          </SheetBody>
        </SheetContent>
      </Sheet>
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
    <div className="flex justify-between text-[13px]">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-money", strong && "font-semibold text-heading")}>
        {value}
      </span>
    </div>
  );
}

export { PosPage };
