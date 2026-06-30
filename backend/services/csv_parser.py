import pandas as pd
import io
import re
from typing import List, Dict
from fastapi import HTTPException
from utils.date_utils import parse_flexible_date

COLUMN_ALIASES = {
    "date": ["date", "transaction date", "txn date", "value date", "posting date"],
    "description": ["description", "narration", "particulars", "details", "transaction details", "memo"],
    "debit": ["debit", "withdrawal", "debit amount", "withdrawal amt", "withdrawal amount", "dr"],
    "credit": ["credit", "deposit", "credit amount", "deposit amt", "deposit amount", "cr"],
    "balance": ["balance", "running balance", "closing balance", "available balance"],
    "amount": ["amount", "transaction amount", "amt"],
    "merchant": ["merchant", "payee", "vendor"],
    "category": ["category", "type", "transaction type"],
}


def _normalize_columns(df: pd.DataFrame) -> Dict[str, str]:
    lower_cols = {c: c.strip().lower() for c in df.columns}
    resolved = {}
    for canonical, aliases in COLUMN_ALIASES.items():
        for original, lowered in lower_cols.items():
            if lowered in aliases:
                resolved[canonical] = original
                break
    return resolved


def _extract_merchant(description: str) -> str:
    text = re.sub(r"\d{6,}", "", description)
    text = re.sub(r"(UPI|NEFT|IMPS|RTGS|POS|ATM)[\-/]?", "", text, flags=re.IGNORECASE)
    text = re.sub(r"[\-/_]+", " ", text).strip()
    tokens = [t for t in text.split() if len(t) > 1]
    return " ".join(tokens[:3]).title() if tokens else "Unknown"


def parse_bank_statement(file_content: bytes) -> List[Dict]:
    try:
        df = pd.read_csv(io.BytesIO(file_content))
    except Exception:
        try:
            df = pd.read_csv(io.BytesIO(file_content), sep=";")
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Could not parse CSV: {exc}")

    df.columns = [str(c).strip() for c in df.columns]
    col_map = _normalize_columns(df)

    if "date" not in col_map:
        raise HTTPException(status_code=400, detail="CSV is missing a recognizable date column.")
    if "description" not in col_map:
        raise HTTPException(status_code=400, detail="CSV is missing a recognizable description column.")

    records: List[Dict] = []

    for _, row in df.iterrows():
        parsed_date = parse_flexible_date(row[col_map["date"]])
        if parsed_date is None:
            continue

        description = str(row[col_map["description"]]).strip()
        if not description or description.lower() == "nan":
            continue

        debit, credit = 0.0, 0.0

        if "debit" in col_map and "credit" in col_map:
            debit = _safe_float(row[col_map["debit"]])
            credit = _safe_float(row[col_map["credit"]])
        elif "amount" in col_map:
            amount = _safe_float(row[col_map["amount"]])
            if amount < 0:
                debit = abs(amount)
            else:
                credit = amount
        else:
            raise HTTPException(
                status_code=400,
                detail="CSV must contain either Debit/Credit columns or a single signed Amount column.",
            )

        balance = _safe_float(row[col_map["balance"]]) if "balance" in col_map else None
        merchant = (
            str(row[col_map["merchant"]]).strip()
            if "merchant" in col_map and pd.notna(row[col_map["merchant"]])
            else _extract_merchant(description)
        )

        records.append({
            "date": parsed_date,
            "description": description,
            "debit": debit,
            "credit": credit,
            "balance": balance,
            "merchant": merchant,
        })

    if not records:
        raise HTTPException(status_code=400, detail="No valid transaction rows found in CSV.")

    return records


def _safe_float(value) -> float:
    if pd.isna(value):
        return 0.0
    if isinstance(value, str):
        value = re.sub(r"[^\d.\-]", "", value)
        if value in ("", "-", "."):
            return 0.0
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0
