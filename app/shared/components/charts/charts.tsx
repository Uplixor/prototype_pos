import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { colors } from "~/theme/tokens";
import { cn } from "~/shared/utils/cn";

const GRID = "var(--color-border)";
const TICK = { fontSize: 11, fill: "var(--color-muted-foreground)" } as const;
const TOOLTIP_STYLE = {
  borderRadius: 4,
  border: "1px solid var(--color-border)",
  fontSize: 12,
  background: "var(--color-card)",
  color: "var(--color-foreground)",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
} as const;

export type ChartPoint = Record<string, string | number>;

export type SeriesConfig = {
  dataKey: string;
  name?: string;
  color?: string;
};

type BaseChartProps = {
  data: ChartPoint[];
  height?: number;
  className?: string;
  xKey?: string;
};

function ChartFrame({
  height = 240,
  className,
  children,
}: {
  height?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function RevenueAreaChart({
  data,
  height = 240,
  className,
  xKey = "label",
  dataKey = "revenue",
  color = colors.chart.revenue,
}: BaseChartProps & { dataKey?: string; color?: string }) {
  return (
    <ChartFrame height={height} className={className}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={TICK}
          axisLine={false}
          tickLine={false}
          dy={6}
        />
        <YAxis
          tick={TICK}
          axisLine={false}
          tickLine={false}
          width={48}
          tickFormatter={(v) =>
            typeof v === "number" && v >= 1000
              ? `${Math.round(v / 1000)}k`
              : String(v)
          }
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value) => [
            typeof value === "number"
              ? `$${value.toLocaleString()}`
              : String(value ?? ""),
            "Revenue",
          ]}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2.5}
          fill="url(#fillRevenue)"
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ChartFrame>
  );
}

function MultiBarChart({
  data,
  series,
  height = 240,
  className,
  xKey = "label",
  stacked = false,
}: BaseChartProps & { series: SeriesConfig[]; stacked?: boolean }) {
  return (
    <ChartFrame height={height} className={className}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} tick={TICK} axisLine={false} tickLine={false} />
        <YAxis tick={TICK} axisLine={false} tickLine={false} width={40} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
        />
        {series.map((s) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.name ?? s.dataKey}
            fill={s.color ?? colors.chart.revenue}
            radius={stacked ? [0, 0, 0, 0] : [2, 2, 0, 0]}
            stackId={stacked ? "stack" : undefined}
            maxBarSize={36}
          />
        ))}
      </BarChart>
    </ChartFrame>
  );
}

/** Horizontal bars for branch / ranking charts (Stitch pattern). */
function HorizontalBarChart({
  data,
  height = 240,
  className,
  nameKey = "label",
  valueKey = "revenue",
  color = colors.chart.revenue,
}: BaseChartProps & {
  nameKey?: string;
  valueKey?: string;
  color?: string;
}) {
  const max = Math.max(
    ...data.map((d) => Number(d[valueKey] ?? 0)),
    1,
  );

  return (
    <div className={cn("flex flex-col justify-center gap-3 px-4 py-3", className)} style={{ minHeight: height }}>
      {data.map((row, index) => {
        const value = Number(row[valueKey] ?? 0);
        const pct = Math.round((value / max) * 100);
        const shade =
          colors.chart.series[index % colors.chart.series.length] ?? color;
        return (
          <div key={String(row[nameKey])} className="space-y-1">
            <div className="flex justify-between text-[12px]">
              <span className="text-body">{String(row[nameKey])}</span>
              <span className="font-money text-heading">
                {value >= 1000
                  ? `$${Math.round(value / 1000)}k`
                  : `$${value.toLocaleString()}`}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-sm bg-muted">
              <div
                className="h-full rounded-sm transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: shade,
                }}
              />
            </div>
          </div>
        );
      })}
      {data.length === 0 ? (
        <p className="text-[12px] text-muted-foreground">No branch data</p>
      ) : null}
    </div>
  );
}

function TrendLineChart({
  data,
  series,
  height = 240,
  className,
  xKey = "label",
}: BaseChartProps & { series: SeriesConfig[] }) {
  return (
    <ChartFrame height={height} className={className}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} tick={TICK} axisLine={false} tickLine={false} />
        <YAxis tick={TICK} axisLine={false} tickLine={false} width={40} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
        />
        {series.map((s) => (
          <Line
            key={s.dataKey}
            type="monotone"
            dataKey={s.dataKey}
            name={s.name ?? s.dataKey}
            stroke={s.color ?? colors.chart.revenue}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ChartFrame>
  );
}

const DONUT_COLORS = colors.chart.series;

function DonutChart({
  data,
  height = 220,
  className,
  nameKey = "label",
  valueKey = "value",
  centerLabel,
}: BaseChartProps & {
  nameKey?: string;
  valueKey?: string;
  centerLabel?: string;
}) {
  const total = data.reduce((sum, d) => sum + Number(d[valueKey] ?? 0), 0);

  return (
    <ChartFrame height={height} className={cn("relative", className)}>
      <PieChart>
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius="62%"
          outerRadius="82%"
          paddingAngle={2}
          strokeWidth={0}
          cx="50%"
          cy="50%"
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={DONUT_COLORS[index % DONUT_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend
          wrapperStyle={{ fontSize: 11 }}
          iconType="circle"
          iconSize={8}
          layout="vertical"
          align="right"
          verticalAlign="middle"
        />
        {centerLabel || total > 0 ? (
          <text
            x="38%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-heading"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            {centerLabel ?? `${total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total}`}
          </text>
        ) : null}
      </PieChart>
    </ChartFrame>
  );
}

export {
  RevenueAreaChart,
  MultiBarChart,
  HorizontalBarChart,
  TrendLineChart,
  DonutChart,
  DONUT_COLORS,
};
