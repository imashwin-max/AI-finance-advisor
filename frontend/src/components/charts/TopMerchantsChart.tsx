import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { MerchantSpend } from "@/types/analytics";
import { formatCurrency } from "@/utils/formatters";
import { EmptyChartState } from "./CategoryPieChart";

export function TopMerchantsChart({ data }: { data: MerchantSpend[] }) {
  if (data.length === 0) {
    return <EmptyChartState message="No merchant data yet." />;
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border))" horizontal={false} />
        <XAxis type="number" stroke="rgb(var(--color-muted))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
        <YAxis dataKey="merchant" type="category" stroke="rgb(var(--color-foreground))" fontSize={12} tickLine={false} axisLine={false} width={110} />
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
        <Bar dataKey="total" fill="#22d3ee" radius={[0, 6, 6, 0]} animationDuration={700} />
      </BarChart>
    </ResponsiveContainer>
  );
}
