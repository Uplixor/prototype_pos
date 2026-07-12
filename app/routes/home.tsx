import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DollarSign,
  Package,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataTable } from "~/shared/components/data-table/data-table";
import { exportToCsv } from "~/shared/components/data-table/export-csv";
import {
  PageHeader,
  StatCard,
} from "~/shared/components/page-primitives";
import { StatusBadge, type StatusKey } from "~/shared/components/status-badge";
import { Button } from "~/shared/components/ui/button";
import { useSaleDrawer } from "~/features/sales/hooks/use-sale-drawer";
import { useDrawer } from "~/shared/providers/drawer-provider";
import { useWorkspace } from "~/shared/providers/workspace-provider";
import { colors } from "~/theme/tokens";

type RecentSale = {
  id: string;
  orderNumber: string;
  customer: string;
  total: string;
  status: StatusKey;
  branch: string;
  createdAt: string;
};

const REVENUE_SERIES = [
  { day: "Mon", revenue: 12400 },
  { day: "Tue", revenue: 15800 },
  { day: "Wed", revenue: 14200 },
  { day: "Thu", revenue: 18900 },
  { day: "Fri", revenue: 22100 },
  { day: "Sat", revenue: 19800 },
  { day: "Sun", revenue: 16500 },
];

const RECENT_SALES: RecentSale[] = [
  {
    id: "1",
    orderNumber: "SO-10482",
    customer: "Walk-in",
    total: "$128.40",
    status: "completed",
    branch: "HQ",
    createdAt: "Today 14:22",
  },
  {
    id: "2",
    orderNumber: "SO-10481",
    customer: "Acme Cafe",
    total: "$86.00",
    status: "paid",
    branch: "DT",
    createdAt: "Today 14:05",
  },
  {
    id: "3",
    orderNumber: "SO-10480",
    customer: "Jordan Lee",
    total: "$42.15",
    status: "pending",
    branch: "HQ",
    createdAt: "Today 13:48",
  },
  {
    id: "4",
    orderNumber: "SO-10479",
    customer: "Walk-in",
    total: "$19.99",
    status: "refunded",
    branch: "ML",
    createdAt: "Today 13:12",
  },
  {
    id: "5",
    orderNumber: "SO-10478",
    customer: "Northwind Staff",
    total: "$254.00",
    status: "completed",
    branch: "HQ",
    createdAt: "Today 12:55",
  },
];

export function meta() {
  return [
    { title: "Dashboard · Commerce OS" },
    {
      name: "description",
      content: "Operations overview for your commerce organization",
    },
  ];
}

export default function DashboardRoute() {
  const { branch, organization } = useWorkspace();
  const { openDrawer } = useDrawer();
  const { openCreateSale } = useSaleDrawer();

  const columns = useMemo<ColumnDef<RecentSale>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Sale",
        cell: ({ row }) => (
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() =>
              openDrawer({
                id: `sale-${row.original.id}`,
                title: row.original.orderNumber,
                description: row.original.customer,
                size: "md",
                content: (
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Customer</p>
                        <p className="font-medium">{row.original.customer}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-medium tabular-nums">
                          {row.original.total}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Branch</p>
                        <p className="font-medium">{row.original.branch}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">When</p>
                        <p className="font-medium">{row.original.createdAt}</p>
                      </div>
                    </div>
                    <StatusBadge status={row.original.status} />
                  </div>
                ),
              })
            }
          >
            {row.original.orderNumber}
          </button>
        ),
      },
      { accessorKey: "customer", header: "Customer" },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.total}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      { accessorKey: "branch", header: "Branch" },
      { accessorKey: "createdAt", header: "When" },
    ],
    [openDrawer],
  );

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Dashboard"
        description={`${organization.name} · ${branch.name}`}
        actions={
          <>
            <Button type="button" variant="outline" size="sm">
              Export
            </Button>
            <Button type="button" size="sm" onClick={openCreateSale}>
              New sale
            </Button>
          </>
        }
      />

      <div className="space-y-4 px-page py-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Revenue today"
            value="$18,420"
            delta="+12.4% vs yesterday"
            deltaTone="positive"
            icon={DollarSign}
          />
          <StatCard
            label="Gross profit"
            value="$6,812"
            delta="+3.1% margin"
            deltaTone="positive"
            icon={TrendingUp}
          />
          <StatCard
            label="Open orders"
            value="47"
            delta="12 awaiting payment"
            deltaTone="neutral"
            icon={ShoppingCart}
          />
          <StatCard
            label="Low stock SKUs"
            value="23"
            delta="4 critical"
            deltaTone="negative"
            icon={Package}
          />
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <div className="rounded-md border border-border bg-card xl:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Revenue</h2>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
            </div>
            <div className="h-56 px-2 py-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_SERIES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={colors.chart.revenue}
                    fill={colors.chart.revenue}
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-md border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold">Attention</h2>
              <p className="text-xs text-muted-foreground">Needs operator action</p>
            </div>
            <ul className="divide-y divide-border">
              <li className="flex items-start gap-3 px-4 py-3">
                <RotateCcw className="mt-0.5 size-4 text-danger" aria-hidden />
                <div>
                  <p className="text-sm font-medium">3 refunds pending review</p>
                  <p className="text-xs text-muted-foreground">Sales · last 2 hours</p>
                </div>
              </li>
              <li className="flex items-start gap-3 px-4 py-3">
                <Package className="mt-0.5 size-4 text-warning" aria-hidden />
                <div>
                  <p className="text-sm font-medium">4 SKUs below reorder point</p>
                  <p className="text-xs text-muted-foreground">Inventory · HQ warehouse</p>
                </div>
              </li>
              <li className="flex items-start gap-3 px-4 py-3">
                <ShoppingCart className="mt-0.5 size-4 text-info" aria-hidden />
                <div>
                  <p className="text-sm font-medium">12 unpaid draft sales</p>
                  <p className="text-xs text-muted-foreground">POS · Downtown</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Recent sales</h2>
            <p className="text-xs text-muted-foreground">
              Click a sale to open the details drawer
            </p>
          </div>
          <DataTable
            columns={columns}
            data={RECENT_SALES}
            searchKey="orderNumber"
            searchPlaceholder="Search sales…"
            getRowId={(row) => row.id}
            onExportCsv={(rows) =>
              exportToCsv(
                rows.map((row) => ({
                  orderNumber: row.orderNumber,
                  customer: row.customer,
                  total: row.total,
                  status: row.status,
                  branch: row.branch,
                  createdAt: row.createdAt,
                })),
                "recent-sales",
              )
            }
            bulkActions={
              <Button type="button" variant="outline" size="sm">
                Export selected
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
