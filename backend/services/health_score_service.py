from typing import List, Dict
from models.transaction import Transaction
from services.analytics_service import compute_summary, compute_category_breakdown
from services.subscription_detector import detect_recurring_subscriptions


def compute_health_score(transactions: List[Transaction]) -> Dict:
    if not transactions:
        return {"score": 0, "level": "No Data", "factors": {}, "suggestions": ["Upload a bank statement to get started."]}

    summary = compute_summary(transactions)
    breakdown = {b["category"]: b["pct_of_expenses"] for b in compute_category_breakdown(transactions)}
    recurring = detect_recurring_subscriptions(transactions)

    savings_rate = summary["savings_rate_pct"]
    food_pct = breakdown.get("Food", 0)
    shopping_pct = breakdown.get("Shopping", 0)
    recurring_total = sum(r["total"] for r in recurring)
    recurring_pct = (recurring_total / summary["total_expenses"] * 100) if summary["total_expenses"] > 0 else 0

    savings_score = max(0, min(25, savings_rate / 2))
    food_score = max(0, 25 - max(0, food_pct - 15))
    shopping_score = max(0, 25 - max(0, shopping_pct - 10) * 1.5)
    recurring_score = max(0, 25 - recurring_pct)

    total_score = round(savings_score + food_score + shopping_score + recurring_score)
    total_score = max(0, min(100, total_score))

    if total_score >= 80:
        level = "Excellent"
    elif total_score >= 60:
        level = "Good"
    elif total_score >= 40:
        level = "Fair"
    else:
        level = "Needs Attention"

    suggestions = []
    if savings_rate < 20:
        suggestions.append("Try to save at least 20% of your income each month.")
    if food_pct > 15:
        suggestions.append("Food spending is above 15% of expenses — consider meal planning.")
    if shopping_pct > 10:
        suggestions.append("Shopping spend is on the higher side — set a monthly shopping cap.")
    if recurring_pct > 15:
        suggestions.append("Recurring subscriptions are eating a large share of spending — review and cancel unused ones.")
    if not suggestions:
        suggestions.append("Your finances look healthy — keep up the consistent habits.")

    return {
        "score": total_score,
        "level": level,
        "factors": {
            "savings_rate_pct": round(savings_rate, 1),
            "food_pct": round(food_pct, 1),
            "shopping_pct": round(shopping_pct, 1),
            "recurring_pct": round(recurring_pct, 1),
        },
        "suggestions": suggestions,
    }
