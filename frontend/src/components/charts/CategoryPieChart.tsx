import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { CategoryBreakdown } from "@/types/analytics";
import { CATEGORY_COLORS } from "@/utils/constants";
import { formatCurrency } from "@/utils/formatters";

export function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center">
      <span className="text-sm text-muted">{message}</span>
    </div>
  );
}

export function CategoryPieChart({ data }: { data: CategoryBreakdown[] }) {
  if (data.length === 0) {
    return <EmptyChartState message="No category data yet — upload a statement to see your spending breakdown." />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={3}
          animationDuration={700}
        >
          {data.map((entry) => (
            <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || "#8a8f9c"} stroke="none" />
          ))}
        </Pie>
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
      </PieChart>
    </ResponsiveContainer>
  );
}
