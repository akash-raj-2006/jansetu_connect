import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CATEGORY_COLOR, type Category } from "@/lib/jansetu";

const AXIS = { stroke: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" };

const tooltipStyle = {
  contentStyle: {
    background: "var(--surface)",
    border: "1px solid var(--border-strong)",
    borderRadius: 4,
    fontSize: 12,
    fontFamily: "var(--font-sans)",
    color: "var(--foreground)",
  },
  labelStyle: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted-foreground)" },
} as const;

export function Panel({
  title,
  hint,
  children,
  className = "",
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`sheet-ruled rounded-md p-4 ${className}`}>
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-sm font-semibold tracking-tight">{title}</h2>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </header>
      {children}
    </section>
  );
}

/** Fig. 1 — horizontal ranking of hotspot priority scores. */
export function PriorityBars({
  data,
  onSelect,
  activeKey,
  rowHeight = 34,
}: {
  data: { key: string; label: string; score: number; category: Category }[];
  onSelect?: (key: string) => void;
  activeKey?: string | null;
  rowHeight?: number;
}) {
  if (data.length === 0) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * rowHeight + 30)}>
      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 24, top: 4, bottom: 4 }} barCategoryGap="22%">
        <XAxis type="number" {...AXIS} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
        <YAxis
          type="category"
          dataKey="label"
          width={168}
          {...AXIS}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
        />

        <Tooltip {...tooltipStyle} formatter={(value: number) => [value, "priority score"]} />
        <Bar
          dataKey="score"
          radius={[0, 2, 2, 0]}
          onClick={(entry: { key?: string }) => entry?.key && onSelect?.(entry.key)}
          cursor={onSelect ? "pointer" : undefined}
        >
          {data.map((row) => (
            <Cell
              key={row.key}
              fill={CATEGORY_COLOR[row.category]}
              opacity={!activeKey || activeKey === row.key ? 1 : 0.35}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Fig. 2 — share of reports by infrastructure category. */
export function CategoryDonut({ data }: { data: { category: Category; label: string; value: number }[] }) {
  const rows = data.filter((row) => row.value > 0);
  if (rows.length === 0) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={rows} dataKey="value" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {rows.map((row) => (
            <Cell key={row.category} fill={CATEGORY_COLOR[row.category]} stroke="var(--surface)" />
          ))}
        </Pie>
        <Legend
          verticalAlign="bottom"
          iconType="square"
          formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
        />
        <Tooltip {...tooltipStyle} formatter={(value: number) => [`${value} reports`, ""]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/** Fig. 3 — weekly report volume with cumulative load. */
export function TrendArea({ data }: { data: { week: string; reports: number; cumulative: number }[] }) {
  if (data.length === 0) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="jsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis dataKey="week" {...AXIS} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
        <YAxis {...AXIS} tickLine={false} axisLine={false} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="cumulative"
          stroke="var(--border-strong)"
          strokeDasharray="4 4"
          fill="none"
          name="cumulative"
        />
        <Area
          type="monotone"
          dataKey="reports"
          stroke="var(--accent)"
          strokeWidth={2}
          fill="url(#jsFill)"
          name="reports"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Fig. 4 — numeric ward × category matrix (replaces the old 3D map). */
export function HeatGrid({
  wards,
  categories,
  values,
  max,
  onSelect,
  activeKey,
}: {
  wards: { id: string; name: string }[];
  categories: { id: Category; label: string }[];
  values: Map<string, number>;
  max: number;
  onSelect?: (key: string) => void;
  activeKey?: string | null;
}) {
  if (wards.length === 0) return <Empty />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="label-mono border-b border-border px-2 py-2 text-left">Ward</th>
            {categories.map((category) => (
              <th key={category.id} className="label-mono border-b border-border px-2 py-2 text-center">
                {category.label}
              </th>
            ))}
            <th className="label-mono border-b border-border px-2 py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {wards.map((ward) => {
            const total = categories.reduce(
              (sum, category) => sum + (values.get(`${ward.id}::${category.id}`) ?? 0),
              0,
            );
            return (
              <tr key={ward.id} className="border-b border-border/70 last:border-0">
                <th scope="row" className="px-2 py-1.5 text-left text-sm font-medium whitespace-nowrap">
                  {ward.name}
                </th>
                {categories.map((category) => {
                  const key = `${ward.id}::${category.id}`;
                  const value = values.get(key) ?? 0;
                  const intensity = max > 0 ? value / max : 0;
                  const active = activeKey === key;
                  return (
                    <td key={category.id} className="p-0.5 text-center">
                      <button
                        type="button"
                        disabled={value === 0}
                        onClick={() => onSelect?.(key)}
                        className={`font-mono w-full rounded-sm px-2 py-1.5 text-xs transition-all disabled:cursor-default ${
                          active ? "ring-2 ring-foreground" : ""
                        }`}
                        style={{
                          backgroundColor:
                            value === 0
                              ? "transparent"
                              : `color-mix(in oklab, ${CATEGORY_COLOR[category.id]} ${Math.round(12 + intensity * 78)}%, var(--surface))`,
                          color:
                            value === 0
                              ? "var(--muted-foreground)"
                              : intensity > 0.45
                                ? "var(--primary-foreground)"
                                : "var(--foreground)",
                        }}
                      >
                        {value === 0 ? "·" : value.toFixed(1)}
                      </button>
                    </td>
                  );
                })}
                <td className="font-mono px-2 py-1.5 text-right text-xs font-semibold">
                  {total.toFixed(1)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  index,
}: {
  label: string;
  value: string;
  hint?: string;
  index?: string;
}) {
  return (
    <div className="sheet rounded-md p-4">
      <div className="flex items-baseline justify-between">
        <p className="label-mono">{label}</p>
        {index && <span className="font-mono text-[10px] text-muted-foreground">{index}</span>}
      </div>
      <p className="font-display mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Empty() {
  return (
    <div className="grid-lines flex h-40 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
      No data in this selection yet.
    </div>
  );
}
