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
        <CartesianGrid strokeDasharray="3 3" stroke="#22262f" horizontal={false} />
        <XAxis type="number" stroke="#8a8f9c" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
        <YAxis dataKey="merchant" type="category" stroke="#8a8f9c" fontSize={12} tickLine={false} axisLine={false} width={110} />
        <Tooltip
          contentStyle={{ background: "#13161d", border: "1px solid #22262f", borderRadius: 12 }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Bar dataKey="total" fill="#22d3ee" radius={[0, 6, 6, 0]} animationDuration={700} />
      </BarChart>
    </ResponsiveContainer>
  );
}
