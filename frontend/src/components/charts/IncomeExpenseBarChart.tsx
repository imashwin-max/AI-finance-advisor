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
        <CartesianGrid strokeDasharray="3 3" stroke="#22262f" vertical={false} />
        <XAxis dataKey="month" stroke="#8a8f9c" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#8a8f9c" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
        <Tooltip
          contentStyle={{ background: "#13161d", border: "1px solid #22262f", borderRadius: 12 }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#8a8f9c" }} />
        <Bar dataKey="income" fill="#34d399" radius={[6, 6, 0, 0]} animationDuration={700} />
        <Bar dataKey="expenses" fill="#f87171" radius={[6, 6, 0, 0]} animationDuration={700} />
      </BarChart>
    </ResponsiveContainer>
  );
}
