import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { IncomeExpenseBarChart } from "@/components/charts/IncomeExpenseBarChart";
import { WeeklyTrendChart } from "@/components/charts/WeeklyTrendChart";
import { TopMerchantsChart } from "@/components/charts/TopMerchantsChart";
import { SpendingHeatmap } from "@/components/charts/SpendingHeatmap";
import { useAnalyticsData } from "@/hooks/useAnalytics";
import { formatCurrency } from "@/utils/formatters";

export function Analytics() {
  const { analytics, isLoading } = useAnalyticsData();

  if (isLoading || !analytics) {
    return (
      <AppLayout title="Analytics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonLoader key={i} className="h-72" />)}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Analytics">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card>
            <h2 className="mb-2 text-lg font-semibold text-foreground">Category Distribution</h2>
            <CategoryPieChart data={analytics.category_breakdown} />
          </Card>
          <Card>
            <h2 className="mb-2 text-lg font-semibold text-foreground">Income vs Expenses</h2>
            <IncomeExpenseBarChart data={analytics.monthly_trend} />
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card>
            <h2 className="mb-2 text-lg font-semibold text-foreground">Weekly Spending Trend</h2>
            <WeeklyTrendChart data={analytics.weekly_trend} />
          </Card>
          <Card>
            <h2 className="mb-2 text-lg font-semibold text-foreground">Top Merchants</h2>
            <TopMerchantsChart data={analytics.top_merchants} />
          </Card>
        </div>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Spending Heatmap</h2>
          <SpendingHeatmap data={analytics.spending_heatmap} />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Recurring Subscriptions</h2>
            {analytics.recurring_subscriptions.length === 0 ? (
              <p className="text-sm text-muted">No recurring subscriptions detected.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {analytics.recurring_subscriptions.map((s) => (
                  <li key={s.merchant} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{s.merchant} <span className="text-muted">× {s.count}</span></span>
                    <span className="font-semibold text-expense">{formatCurrency(s.total)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Largest Expenses</h2>
            {analytics.largest_expenses.length === 0 ? (
              <p className="text-sm text-muted">No expenses recorded yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {analytics.largest_expenses.map((e, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{e.merchant || e.description}</span>
                    <span className="font-semibold text-expense">{formatCurrency(e.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
