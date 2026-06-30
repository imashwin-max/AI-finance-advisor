from pydantic import BaseModel


class BudgetCreate(BaseModel):
    category: str
    month: str
    limit_amount: float


class BudgetResponse(BaseModel):
    id: int
    category: str
    month: str
    limit_amount: float
    spent: float = 0.0
    remaining: float = 0.0
    progress_pct: float = 0.0
    exceeded: bool = False
