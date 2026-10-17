import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import type { MonthlyTrendPoint } from "@/types/analytics";
import { formatCurrency } from "@/utils/formatters";
import { EmptyChartState } from "./CategoryPieChart";

export function IncomeExpenseBarChart({ data }: { data: MonthlyTrendPoint[] }) {
  if (data.length === 0) {
    return <EmptyChartState message="No monthly trend yet — upload a statement to see income vs expenses." />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border))" vertical={false} />
        <XAxis dataKey="month" stroke="rgb(var(--color-muted))" fontSize={12} tickLine={false} axisLine={false} />
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
        <Legend wrapperStyle={{ fontSize: 12, color: "rgb(var(--color-muted))" }} />
        <Bar dataKey="income" fill="#34d399" radius={[6, 6, 0, 0]} animationDuration={700} />
        <Bar dataKey="expenses" fill="#f87171" radius={[6, 6, 0, 0]} animationDuration={700} />
      </BarChart>
    </ResponsiveContainer>
  );
}
