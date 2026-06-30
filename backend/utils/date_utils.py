from datetime import date, datetime
from typing import Optional
import pandas as pd

DATE_FORMATS = [
    "%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y", "%d/%m/%Y",
    "%Y/%m/%d", "%b %d, %Y", "%d %b %Y", "%m-%d-%Y",
]


def parse_flexible_date(value) -> Optional[date]:
    if pd.isna(value):
        return None
    if isinstance(value, (date, datetime)):
        return value.date() if isinstance(value, datetime) else value

    text = str(value).strip()
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            continue

    parsed = pd.to_datetime(text, errors="coerce")
    return parsed.date() if not pd.isna(parsed) else None
