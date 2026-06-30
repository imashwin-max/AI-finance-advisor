import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatters";
import { CATEGORY_COLORS } from "@/utils/constants";
import type { Budget } from "@/types/budget";

export function BudgetCard({ budget }: { budget: Budget }) {
  const barColor = budget.exceeded ? "#f87171" : budget.progress_pct > 80 ? "#facc15" : CATEGORY_COLORS[budget.category] || "#7c5cff";

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-medium text-white">{budget.category}</span>
        {budget.exceeded && <AlertTriangle className="h-4 w-4 text-expense" />}
      </div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted">Spent</span>
        <span className="font-semibold text-white">{formatCurrency(budget.spent)} / {formatCurrency(budget.limit_amount)}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-surfaceHover overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, budget.progress_pct)}%`, backgroundColor: barColor }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>{budget.progress_pct.toFixed(0)}% used</span>
        <span>{budget.exceeded ? "Over budget" : `${formatCurrency(budget.remaining)} left`}</span>
      </div>
    </Card>
  );
}
