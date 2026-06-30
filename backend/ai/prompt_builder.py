from typing import List, Dict
from models.transaction import Transaction
from services.analytics_service import (
    compute_summary, compute_category_breakdown, compute_top_merchants,
    compute_largest_expenses,
)
from services.subscription_detector import detect_recurring_subscriptions

SYSTEM_INSTRUCTIONS = """You are an expert personal finance advisor embedded in a finance dashboard app.
You give clear, practical, encouraging advice grounded strictly in the user's real transaction data provided below.

Rules:
- Always reference specific numbers from the data when relevant (amounts, percentages, merchant names).
- Keep responses concise and scannable.
- Never invent transactions or numbers that aren't in the provided data.
- Use Rs (INR) for all amounts since the data is in Indian Rupees.
"""


def build_financial_context(transactions: List[Transaction]) -> str:
    if not transactions:
        return "The user has not uploaded any transactions yet. Encourage them to upload a bank statement CSV first."

    summary = compute_summary(transactions)
    categories = compute_category_breakdown(transactions)
    merchants = compute_top_merchants(transactions, limit=8)
    largest_expenses = compute_largest_expenses(transactions, limit=5)
    recurring = detect_recurring_subscriptions(transactions)

    category_lines = "\n".join(f"  - {c['category']}: Rs {c['total']:.0f} ({c['pct_of_expenses']:.1f}%)" for c in categories)
    merchant_lines = "\n".join(f"  - {m['merchant']}: Rs {m['total']:.0f} across {m['count']} transactions" for m in merchants)
    expense_lines = "\n".join(f"  - {e['date']}: {e['description']} — Rs {e['amount']:.0f}" for e in largest_expenses)
    recurring_lines = "\n".join(f"  - {r['merchant']}: Rs {r['total']:.0f} ({r['count']}x)" for r in recurring) or "  - None detected"

    return f"""USER'S FINANCIAL SUMMARY:
- Total Income: Rs {summary['total_income']:.0f}
- Total Expenses: Rs {summary['total_expenses']:.0f}
- Net Savings: Rs {summary['savings']:.0f}
- Savings Rate: {summary['savings_rate_pct']:.1f}%
- Average Daily Spend: Rs {summary['average_daily_spend']:.0f}
- Total Transactions: {summary['transaction_count']}
- Largest Spending Category: {summary['largest_category']}
- Top Merchant: {summary['top_merchant']}

SPENDING BY CATEGORY:
{category_lines}

TOP MERCHANTS:
{merchant_lines}

LARGEST INDIVIDUAL EXPENSES:
{expense_lines}

DETECTED RECURRING SUBSCRIPTIONS:
{recurring_lines}
"""


def build_chat_prompt(transactions: List[Transaction], user_message: str, conversation_history: List[Dict[str, str]]) -> List[Dict]:
    context = build_financial_context(transactions)
    history_text = "\n".join(f"{turn.get('role', 'user').upper()}: {turn.get('content', '')}" for turn in conversation_history[-6:])

    full_prompt = f"{SYSTEM_INSTRUCTIONS}\n\n{context}\n\nCONVERSATION HISTORY:\n{history_text}\n\nUSER: {user_message}"
    return [{"role": "user", "parts": [full_prompt]}]
