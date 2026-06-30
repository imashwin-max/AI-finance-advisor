from typing import Optional, Tuple

CATEGORY_KEYWORDS = {
    "Food": ["restaurant", "cafe", "coffee", "swiggy", "zomato", "dominos", "pizza", "starbucks", "mcdonald", "kfc", "food", "dining", "grocery", "bigbasket", "blinkit", "zepto"],
    "Shopping": ["amazon", "flipkart", "myntra", "ajio", "mall", "shopping", "retail", "store", "shop"],
    "Travel": ["uber", "ola", "irctc", "indigo", "airline", "flight", "train", "petrol", "fuel", "metro", "cab", "taxi", "fastag", "redbus"],
    "Bills": ["electricity", "water bill", "gas bill", "broadband", "wifi", "mobile recharge", "airtel", "jio", "vodafone", "bill payment", "dth", "rent"],
    "Healthcare": ["pharmacy", "hospital", "clinic", "medical", "doctor", "apollo", "medplus", "diagnostic", "health"],
    "Entertainment": ["netflix", "spotify", "prime video", "hotstar", "bookmyshow", "movie", "cinema", "gaming", "youtube premium"],
    "Education": ["udemy", "coursera", "tuition", "school fee", "college fee", "course", "books", "education"],
    "Investment": ["mutual fund", "zerodha", "groww", "upstox", "sip", "stocks", "investment", "nps", "ppf"],
    "Salary": ["salary", "payroll", "wages", "stipend"],
    "Transfer": ["neft", "imps", "rtgs", "upi transfer", "fund transfer", "self transfer"],
}


def categorize_transaction(description: str, merchant: Optional[str] = None) -> Tuple[str, float]:
    text = f"{description} {merchant or ''}".lower()

    best_category, best_hits = "Miscellaneous", 0
    for category, keywords in CATEGORY_KEYWORDS.items():
        hits = sum(1 for kw in keywords if kw in text)
        if hits > best_hits:
            best_category, best_hits = category, hits

    if best_hits == 0:
        return "Miscellaneous", 0.0

    confidence = min(1.0, 0.5 + 0.25 * best_hits)
    return best_category, confidence


CONFIDENCE_THRESHOLD = 0.6


def needs_ai_categorization(confidence: float) -> bool:
    return confidence < CONFIDENCE_THRESHOLD
