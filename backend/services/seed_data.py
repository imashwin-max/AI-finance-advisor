import random
from datetime import date, timedelta
from sqlalchemy.orm import Session
from models.transaction import Transaction

MERCHANTS_BY_CATEGORY = {
    "Food": ["Swiggy", "Zomato", "Domino's Pizza", "Starbucks", "Local Cafe", "BigBasket"],
    "Shopping": ["Amazon", "Flipkart", "Myntra", "Ajio", "Local Mall"],
    "Travel": ["Uber", "Ola", "IRCTC", "IndiGo Airlines", "Fastag Recharge"],
    "Bills": ["Airtel Postpaid", "Jio Fiber", "Electricity Board", "Water Utility", "Gas Bill"],
    "Healthcare": ["Apollo Pharmacy", "MedPlus", "City Hospital", "Practo Consultation"],
    "Entertainment": ["Netflix", "Spotify", "BookMyShow", "Prime Video", "Hotstar"],
    "Education": ["Udemy", "Coursera", "College Fee Office"],
    "Investment": ["Zerodha", "Groww SIP", "PPF Deposit"],
    "Miscellaneous": ["UPI Payment", "ATM Withdrawal", "Local Store"],
}

RENT_MERCHANT = "Landlord Rent Transfer"
SALARY_MERCHANT = "Employer Payroll"

# (category, amount_range, weight) — weights tuned so the simulated savings rate lands
# in a believable ~25-30% band against the fixed monthly salary/rent/subscription baseline.
CATEGORY_WEIGHTED_RANGES = [
    ("Food", (100, 500), 35),
    ("Travel", (80, 600), 20),
    ("Bills", (300, 1200), 10),
    ("Healthcare", (150, 900), 8),
    ("Entertainment", (99, 499), 10),
    ("Shopping", (300, 1500), 10),
    ("Investment", (500, 2000), 4),
    ("Education", (500, 1500), 1),
    ("Miscellaneous", (80, 400), 2),
]


def has_existing_data(db: Session, user_id: int) -> bool:
    return db.query(Transaction).filter(Transaction.user_id == user_id).first() is not None


def generate_demo_transactions(db: Session, user_id: int, target_count: int = 500) -> int:
    if has_existing_data(db, user_id):
        return 0

    today = date.today()
    start = today - timedelta(days=180)
    records = []

    current = start.replace(day=1)
    while current <= today:
        records.append(Transaction(
            user_id=user_id, date=current.replace(day=1), description="Monthly Salary Credit",
            merchant=SALARY_MERCHANT, category="Salary", debit=0.0,
            credit=round(random.uniform(65000, 78000), 2), balance=None,
        ))
        records.append(Transaction(
            user_id=user_id, date=current.replace(day=min(5, 28)), description="House Rent Payment",
            merchant=RENT_MERCHANT, category="Bills", debit=round(random.uniform(13000, 16000), 2),
            credit=0.0, balance=None,
        ))
        for sub_merchant, amount in [("Netflix Subscription", 649), ("Spotify Premium", 119)]:
            day = min(random.randint(6, 20), 28)
            records.append(Transaction(
                user_id=user_id, date=current.replace(day=day), description=sub_merchant,
                merchant=sub_merchant.split(" ")[0], category="Entertainment",
                debit=float(amount), credit=0.0, balance=None,
            ))
        if current.month == 12:
            current = current.replace(year=current.year + 1, month=1)
        else:
            current = current.replace(month=current.month + 1)

    categories = [c[0] for c in CATEGORY_WEIGHTED_RANGES]
    ranges = {c[0]: c[1] for c in CATEGORY_WEIGHTED_RANGES}
    weights = [c[2] for c in CATEGORY_WEIGHTED_RANGES]

    while len(records) < target_count:
        txn_date = start + timedelta(days=random.randint(0, 180))
        category = random.choices(categories, weights=weights, k=1)[0]
        merchant = random.choice(MERCHANTS_BY_CATEGORY[category])
        lo, hi = ranges[category]
        amount = round(random.uniform(lo, hi), 2)

        records.append(Transaction(
            user_id=user_id, date=txn_date, description=f"{merchant} Purchase",
            merchant=merchant, category=category, debit=amount, credit=0.0, balance=None,
        ))

    records.sort(key=lambda r: r.date)
    running_balance = 50000.0
    for r in records:
        running_balance += r.credit - r.debit
        r.balance = round(running_balance, 2)

    db.bulk_save_objects(records)
    db.commit()
    return len(records)
