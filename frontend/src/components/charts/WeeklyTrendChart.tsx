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
        <CartesianGrid strokeDasharray="3 3" stroke="#22262f" vertical={false} />
        <XAxis dataKey="week_start" stroke="#8a8f9c" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#8a8f9c" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
        <Tooltip
          contentStyle={{ background: "#13161d", border: "1px solid #22262f", borderRadius: 12 }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Area type="monotone" dataKey="total" stroke="#7c5cff" fill="url(#weeklyGradient)" strokeWidth={2} animationDuration={700} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
