from pydantic import BaseModel
from typing import Dict, List, Optional


class SummaryResponse(BaseModel):
    total_income: float
    total_expenses: float
    savings: float
    savings_rate_pct: float
    monthly_spending: float
    largest_category: Optional[str]
    top_merchant: Optional[str]
    average_daily_spend: float
    transaction_count: int


class CategoryBreakdown(BaseModel):
    category: str
    total: float
    pct_of_expenses: float


class MerchantSpend(BaseModel):
    merchant: str
    total: float
    count: int


class MonthlyTrendPoint(BaseModel):
    month: str
    income: float
    expenses: float


class WeeklyTrendPoint(BaseModel):
    week_start: str
    total: float


class AnalyticsResponse(BaseModel):
    category_breakdown: List[CategoryBreakdown]
    top_merchants: List[MerchantSpend]
    monthly_trend: List[MonthlyTrendPoint]
    weekly_trend: List[WeeklyTrendPoint]
    recurring_subscriptions: List[MerchantSpend]
    largest_expenses: List[Dict]
    spending_heatmap: List[Dict]
