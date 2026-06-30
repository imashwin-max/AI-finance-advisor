export interface Summary {
  total_income: number;
  total_expenses: number;
  savings: number;
  savings_rate_pct: number;
  monthly_spending: number;
  largest_category: string | null;
  top_merchant: string | null;
  average_daily_spend: number;
  transaction_count: number;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  pct_of_expenses: number;
}

export interface MerchantSpend {
  merchant: string;
  total: number;
  count: number;
}

export interface MonthlyTrendPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface WeeklyTrendPoint {
  week_start: string;
  total: number;
}

export interface Analytics {
  category_breakdown: CategoryBreakdown[];
  top_merchants: MerchantSpend[];
  monthly_trend: MonthlyTrendPoint[];
  weekly_trend: WeeklyTrendPoint[];
  recurring_subscriptions: MerchantSpend[];
  largest_expenses: Array<{ date: string; description: string; merchant: string | null; amount: number }>;
  spending_heatmap: Array<{ date: string; amount: number }>;
}

export interface HealthScore {
  score: number;
  level: string;
  factors: Record<string, number>;
  suggestions: string[];
}
