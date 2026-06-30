import { Wallet, TrendingUp, TrendingDown, PiggyBank, Tag, Store, CalendarDays } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { Dropzone } from "@/components/upload/Dropzone";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ExportButtons } from "@/components/dashboard/ExportButtons";
import { useSummary } from "@/hooks/useAnalytics";
import { useTransactions } from "@/hooks/useTransactions";
import { formatCurrency, formatPercent } from "@/utils/formatters";

export function Dashboard() {
  const { summary, isLoading: summaryLoading } = useSummary();
  const { transactions, isLoading: txnsLoading, refetch } = useTransactions();

  const hasData = !summaryLoading && !!summary && summary.transaction_count > 0;

  return (
    <AppLayout title="Dashboard">
      <div className="flex flex-col gap-6">
        {!txnsLoading && transactions.length === 0 && (
          <Dropzone onUploadComplete={refetch} />
        )}

        {hasData && (
          <div className="flex justify-end">
            <ExportButtons />
          </div>
        )}

        {summaryLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonLoader key={i} className="h-28" />)}
          </div>
        ) : hasData && summary ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Income" value={formatCurrency(summary.total_income)} icon={TrendingUp} delay={0.0} />
            <StatCard label="Total Expenses" value={formatCurrency(summary.total_expenses)} icon={TrendingDown} delay={0.05} />
            <StatCard
              label="Savings"
              value={formatCurrency(summary.savings)}
              icon={PiggyBank}
              trend={formatPercent(summary.savings_rate_pct) + " savings rate"}
              trendPositive={summary.savings_rate_pct >= 0}
              delay={0.1}
            />
            <StatCard label="Monthly Spending" value={formatCurrency(summary.monthly_spending)} icon={Wallet} delay={0.15} />
            <StatCard label="Largest Category" value={summary.largest_category || "—"} icon={Tag} delay={0.2} />
            <StatCard label="Top Merchant" value={summary.top_merchant || "—"} icon={Store} delay={0.25} />
            <StatCard label="Avg Daily Spend" value={formatCurrency(summary.average_daily_spend)} icon={CalendarDays} delay={0.3} />
            <StatCard label="Transactions" value={String(summary.transaction_count)} icon={Wallet} delay={0.35} />
          </div>
        ) : null}

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-white">Recent Transactions</h2>
          {txnsLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonLoader key={i} className="h-14" />)}
            </div>
          ) : (
            <RecentTransactions transactions={transactions} />
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
