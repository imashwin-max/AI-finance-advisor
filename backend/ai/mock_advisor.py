import random
from typing import List
from models.transaction import Transaction
from services.analytics_service import compute_summary, compute_category_breakdown, compute_top_merchants
from services.subscription_detector import detect_recurring_subscriptions


def generate_mock_reply(transactions: List[Transaction], user_message: str) -> str:
    if not transactions:
        return ("I don't see any transactions yet. Upload a bank statement CSV and I'll be able to "
                "analyze your spending, suggest a budget, and answer questions about your finances.")

    summary = compute_summary(transactions)
    categories = compute_category_breakdown(transactions)
    recurring = detect_recurring_subscriptions(transactions)
    text = user_message.lower()

    if "wast" in text:
        top = categories[0] if categories else None
        if top:
            return (f"Based on your spending, {top['category']} is your biggest expense category at "
                     f"Rs {top['total']:.0f} ({top['pct_of_expenses']:.1f}% of total spending). "
                     f"If you're looking to cut back, that's the place to start.")
        return "I don't have enough category data yet to pinpoint where you're overspending."

    if "save" in text and ("more" in text or "how" in text):
        rate = summary["savings_rate_pct"]
        return (f"Your current savings rate is {rate:.1f}%. A healthy target is 20-30%. "
                f"Your top spending category is {summary['largest_category'] or 'uncategorized spend'} — "
                f"trimming even 10% there could meaningfully boost your savings rate.")

    if "summar" in text:
        return (f"This month you've spent Rs {summary['monthly_spending']:.0f}. "
                f"Overall: income Rs {summary['total_income']:.0f}, expenses Rs {summary['total_expenses']:.0f}, "
                f"savings Rs {summary['savings']:.0f} ({summary['savings_rate_pct']:.1f}% rate) "
                f"across {summary['transaction_count']} transactions.")

    if "subscription" in text or "recurring" in text:
        if not recurring:
            return "I didn't detect any recurring subscriptions in your transaction history."
        lines = "\n".join(f"- {r['merchant']}: Rs {r['total']:.0f} across {r['count']} payments" for r in recurring)
        return f"Here are your detected recurring subscriptions:\n{lines}"

    if "budget" in text:
        suggestions = "\n".join(
            f"- {c['category']}: cap around Rs {c['total'] * 0.85:.0f} (10-15% below current spend)"
            for c in categories[:5]
        )
        return f"Here's a starting monthly budget based on your recent spending:\n{suggestions}"

    if "food" in text:
        food = next((c for c in categories if c["category"] == "Food"), None)
        if food:
            return f"You've spent Rs {food['total']:.0f} on Food, which is {food['pct_of_expenses']:.1f}% of your total expenses."
        return "I don't see any Food spending recorded yet."

    if "10000" in text or ("save" in text and any(ch.isdigit() for ch in text)):
        months = max(1, len(set(t.date.strftime("%Y-%m") for t in transactions)))
        avg_monthly_savings = summary["savings"] / months
        return (f"Based on your average monthly savings of around Rs {avg_monthly_savings:.0f}, "
                f"saving Rs 10,000/month looks "
                f"{'achievable' if avg_monthly_savings >= 10000 else 'tight but possible with some category trims'}.")

    fallback_options = [
        f"Your top merchant by spend is {summary['top_merchant'] or 'not yet determined'}.",
        f"Your largest spending category is {summary['largest_category'] or 'not yet determined'}, "
        f"making up a notable share of your Rs {summary['total_expenses']:.0f} total expenses.",
        f"You have {summary['transaction_count']} transactions on record with a savings rate of {summary['savings_rate_pct']:.1f}%.",
    ]
    return random.choice(fallback_options) + " Ask me about specific categories, subscriptions, or budgeting and I can go deeper."
