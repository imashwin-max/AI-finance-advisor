import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { WeeklyTrendPoint } from "@/types/analytics";
import { formatCurrency } from "@/utils/formatters";
import { EmptyChartState } from "./CategoryPieChart";

export function WeeklyTrendChart({ data }: { data: WeeklyTrendPoint[] }) {
  if (data.length === 0) {
    return <EmptyChartState message="No weekly trend yet." />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c5cff" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#7c5cff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border))" vertical={false} />
        <XAxis dataKey="week_start" stroke="rgb(var(--color-muted))" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="rgb(var(--color-muted))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgb(var(--color-surface))",
            borderColor: "rgb(var(--color-border))",
            borderRadius: 12,
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
          }}
          itemStyle={{ color: "rgb(var(--color-foreground))" }}
          labelStyle={{ color: "rgb(var(--color-foreground))", fontWeight: 600 }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Area type="monotone" dataKey="total" stroke="#7c5cff" fill="url(#weeklyGradient)" strokeWidth={2} animationDuration={700} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
