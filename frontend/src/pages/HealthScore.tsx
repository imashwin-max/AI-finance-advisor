import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { HealthGauge } from "@/components/charts/HealthGauge";
import { useHealthScore } from "@/hooks/useAnalytics";
import { formatPercent } from "@/utils/formatters";

const FACTOR_LABELS: Record<string, string> = {
  savings_rate_pct: "Savings Rate",
  food_pct: "Food Spending",
  shopping_pct: "Shopping Spending",
  recurring_pct: "Recurring Expenses",
};

export function HealthScorePage() {
  const { healthScore, isLoading } = useHealthScore();

  if (isLoading || !healthScore) {
    return (
      <AppLayout title="Financial Health Score">
        <SkeletonLoader className="h-96" />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Financial Health Score">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="flex items-center justify-center py-10">
          <HealthGauge score={healthScore.score} level={healthScore.level} />
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-white">Score Factors</h2>
          <div className="flex flex-col gap-4">
            {Object.entries(healthScore.factors).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted">{FACTOR_LABELS[key] || key}</span>
                  <span className="text-white font-medium">{formatPercent(value)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-surfaceHover overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-primary transition-all duration-700" style={{ width: `${Math.min(100, value)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-white">Suggestions</h2>
          <ul className="flex flex-col gap-2">
            {healthScore.suggestions.map((s, i) => (
              <li key={i} className="rounded-xl bg-surfaceHover/50 px-4 py-3 text-sm text-white/90">{s}</li>
            ))}
          </ul>
        </Card>
      </div>
    </AppLayout>
  );
}
