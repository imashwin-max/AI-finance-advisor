from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional


class TransactionBase(BaseModel):
    date: date
    description: str
    merchant: Optional[str] = None
    category: str = "Miscellaneous"
    debit: float = 0.0
    credit: float = 0.0
    balance: Optional[float] = None


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    is_recurring: bool = False


class TransactionFilter(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    category: Optional[str] = None
    merchant: Optional[str] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    transaction_type: Optional[str] = None
    keyword: Optional[str] = None
