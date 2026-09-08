import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { compact, currency, projectWealth, type Account } from "@/lib/finance";
import { cn } from "@/lib/utils";

const horizons = [10, 20, 30, 40];
const scenarios = [
  { key: "conservative", label: "Conservative", adj: -0.02 },
  { key: "base", label: "Base", adj: 0 },
  { key: "optimistic", label: "Optimistic", adj: 0.02 },
] as const;

type Props = {
  selected: Account[];
  years: number;
  onYears: (y: number) => void;
  scenario: (typeof scenarios)[number]["key"];
  onScenario: (s: (typeof scenarios)[number]["key"]) => void;
};

export function ProjectionChart({ selected, years, onYears, scenario, onScenario }: Props) {
  const adj = scenarios.find((s) => s.key === scenario)!.adj;
  const data = useMemo(() => projectWealth(selected, years, adj), [selected, years, adj]);
  const last = data[data.length - 1]!;
  const first = data[0]!;
  const growth = first.total > 0 ? last.total / first.total : 0;

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card p-5 shadow-panel">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Projected net worth · {last.year}
          </p>
          <p className="mt-1 font-mono text-[34px] leading-none tracking-tight">
            {currency(last.total)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {growth.toFixed(1)}× today's {currency(first.total)} over {years} years
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Segmented
            options={horizons.map((h) => ({ value: String(h), label: `${h}y` }))}
            value={String(years)}
            onChange={(v) => onYears(Number(v))}
          />
          <Segmented
            options={scenarios.map((s) => ({ value: s.key, label: s.label }))}
            value={scenario}
            onChange={(v) => onScenario(v as typeof scenario)}
          />
        </div>
      </header>

      <div className="mt-6 min-h-[260px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              {["retirement", "investment", "savings", "checking"].map((k, i) => (
                <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`var(--chart-${i + 1})`} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={`var(--chart-${i + 1})`} stopOpacity={0.04} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={40}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={54}
              tickFormatter={compact}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <Tooltip content={<ChartTooltip />} />
            {(["retirement", "investment", "savings", "checking"] as const).map((k, i) => (
              <Area
                key={k}
                type="monotone"
                dataKey={k}
                stackId="1"
                stroke={`var(--chart-${i + 1})`}
                strokeWidth={1.5}
                fill={`url(#g-${k})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: any) => s + (p.value ?? 0), 0);
  return (
    <div className="rounded-xl border border-border bg-popover p-3 shadow-panel">
      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-base">{currency(total)}</p>
      <div className="mt-2 space-y-1">
        {[...payload].reverse().map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-[11px]">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: p.stroke as string }}
            />
            <span className="capitalize text-muted-foreground">{p.dataKey}</span>
            <span className="ml-auto font-mono">{currency(p.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-full bg-muted p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
            value === o.value
              ? "bg-card text-foreground shadow-panel"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
