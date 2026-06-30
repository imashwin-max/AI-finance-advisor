from collections import defaultdict
from typing import List, Dict
from models.transaction import Transaction


def detect_recurring_subscriptions(transactions: List[Transaction]) -> List[Dict]:
    by_merchant: Dict[str, List[Transaction]] = defaultdict(list)
    for txn in transactions:
        if txn.debit > 0 and txn.merchant:
            by_merchant[txn.merchant].append(txn)

    recurring = []
    for merchant, txns in by_merchant.items():
        if len(txns) < 2:
            continue
        amounts = [t.debit for t in txns]
        avg = sum(amounts) / len(amounts)
        variance = sum((a - avg) ** 2 for a in amounts) / len(amounts)
        std_dev = variance ** 0.5

        if avg > 0 and (std_dev / avg) < 0.15:
            recurring.append({"merchant": merchant, "total": round(sum(amounts), 2), "count": len(txns)})

    return sorted(recurring, key=lambda x: x["total"], reverse=True)
