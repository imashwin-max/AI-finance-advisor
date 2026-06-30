from collections import defaultdict
from datetime import date, timedelta
from typing import List, Dict
from models.transaction import Transaction
from services.subscription_detector import detect_recurring_subscriptions


def compute_summary(transactions: List[Transaction]) -> Dict:
    if not transactions:
        return {
            "total_income": 0, "total_expenses": 0, "savings": 0, "savings_rate_pct": 0,
            "monthly_spending": 0, "largest_category": None, "top_merchant": None,
            "average_daily_spend": 0, "transaction_count": 0,
        }

    total_income = sum(t.credit for t in transactions)
    total_expenses = sum(t.debit for t in transactions)
    savings = total_income - total_expenses
    savings_rate = (savings / total_income * 100) if total_income > 0 else 0.0

    category_totals: Dict[str, float] = defaultdict(float)
    merchant_totals: Dict[str, float] = defaultdict(float)
    for t in transactions:
        if t.debit > 0:
            category_totals[t.category] += t.debit
            if t.merchant:
                merchant_totals[t.merchant] += t.debit

    largest_category = max(category_totals, key=category_totals.get) if category_totals else None
    top_merchant = max(merchant_totals, key=merchant_totals.get) if merchant_totals else None

    dates = [t.date for t in transactions]
    day_span = max((max(dates) - min(dates)).days, 1)
    avg_daily_spend = total_expenses / day_span

    most_recent_month = max(dates).strftime("%Y-%m")
    monthly_spending = sum(t.debit for t in transactions if t.date.strftime("%Y-%m") == most_recent_month)

    return {
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "savings": round(savings, 2),
        "savings_rate_pct": round(savings_rate, 2),
        "monthly_spending": round(monthly_spending, 2),
        "largest_category": largest_category,
        "top_merchant": top_merchant,
        "average_daily_spend": round(avg_daily_spend, 2),
        "transaction_count": len(transactions),
    }


def compute_category_breakdown(transactions: List[Transaction]) -> List[Dict]:
    totals: Dict[str, float] = defaultdict(float)
    for t in transactions:
        if t.debit > 0:
            totals[t.category] += t.debit
    total_expenses = sum(totals.values()) or 1

    return sorted(
        [{"category": c, "total": round(v, 2), "pct_of_expenses": round(v / total_expenses * 100, 2)}
         for c, v in totals.items()],
        key=lambda x: x["total"], reverse=True,
    )


def compute_top_merchants(transactions: List[Transaction], limit: int = 10) -> List[Dict]:
    totals: Dict[str, Dict] = defaultdict(lambda: {"total": 0.0, "count": 0})
    for t in transactions:
        if t.debit > 0 and t.merchant:
            totals[t.merchant]["total"] += t.debit
            totals[t.merchant]["count"] += 1

    merged = [{"merchant": m, "total": round(v["total"], 2), "count": v["count"]} for m, v in totals.items()]
    return sorted(merged, key=lambda x: x["total"], reverse=True)[:limit]


def compute_monthly_trend(transactions: List[Transaction]) -> List[Dict]:
    totals: Dict[str, Dict] = defaultdict(lambda: {"income": 0.0, "expenses": 0.0})
    for t in transactions:
        key = t.date.strftime("%Y-%m")
        totals[key]["income"] += t.credit
        totals[key]["expenses"] += t.debit

    return [{"month": k, "income": round(v["income"], 2), "expenses": round(v["expenses"], 2)}
            for k, v in sorted(totals.items())]


def compute_weekly_trend(transactions: List[Transaction]) -> List[Dict]:
    totals: Dict[str, float] = defaultdict(float)
    for t in transactions:
        if t.debit > 0:
            week_start = t.date - timedelta(days=t.date.weekday())
            totals[week_start.isoformat()] += t.debit

    return [{"week_start": k, "total": round(v, 2)} for k, v in sorted(totals.items())]


def compute_largest_expenses(transactions: List[Transaction], limit: int = 5) -> List[Dict]:
    expenses = [t for t in transactions if t.debit > 0]
    top = sorted(expenses, key=lambda t: t.debit, reverse=True)[:limit]
    return [{"date": t.date.isoformat(), "description": t.description, "merchant": t.merchant, "amount": t.debit} for t in top]


def compute_spending_heatmap(transactions: List[Transaction]) -> List[Dict]:
    totals: Dict[str, float] = defaultdict(float)
    for t in transactions:
        if t.debit > 0:
            totals[t.date.isoformat()] += t.debit
    return [{"date": k, "amount": round(v, 2)} for k, v in sorted(totals.items())]


def compute_full_analytics(transactions: List[Transaction]) -> Dict:
    return {
        "category_breakdown": compute_category_breakdown(transactions),
        "top_merchants": compute_top_merchants(transactions),
        "monthly_trend": compute_monthly_trend(transactions),
        "weekly_trend": compute_weekly_trend(transactions),
        "recurring_subscriptions": detect_recurring_subscriptions(transactions),
        "largest_expenses": compute_largest_expenses(transactions),
        "spending_heatmap": compute_spending_heatmap(transactions),
    }
