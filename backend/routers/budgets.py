from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.session import get_db_session
from models.budget import Budget
from models.transaction import Transaction
from models.user import User
from schemas.budget import BudgetCreate, BudgetResponse
from core.dependencies import get_current_user

router = APIRouter(prefix="/budgets", tags=["budgets"])


def _spent_for_category_month(db: Session, user_id: int, category: str, month: str) -> float:
    year, mon = int(month.split("-")[0]), int(month.split("-")[1])
    txns = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.category == category,
    ).all()
    return sum(t.debit for t in txns if t.date.year == year and t.date.month == mon)


@router.get("", response_model=List[BudgetResponse])
def list_budgets(db: Session = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    budgets = db.query(Budget).filter(Budget.user_id == current_user.id).all()
    results = []
    for b in budgets:
        spent = _spent_for_category_month(db, current_user.id, b.category, b.month)
        remaining = b.limit_amount - spent
        progress_pct = min(100.0, (spent / b.limit_amount * 100) if b.limit_amount > 0 else 0)
        results.append(BudgetResponse(
            id=b.id, category=b.category, month=b.month, limit_amount=b.limit_amount,
            spent=round(spent, 2), remaining=round(remaining, 2),
            progress_pct=round(progress_pct, 2), exceeded=spent > b.limit_amount,
        ))
    return results


@router.post("", response_model=BudgetResponse)
def create_budget(
    payload: BudgetCreate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.category == payload.category,
        Budget.month == payload.month,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Budget already exists for this category and month.")

    budget = Budget(user_id=current_user.id, category=payload.category, month=payload.month, limit_amount=payload.limit_amount)
    db.add(budget)
    db.commit()
    db.refresh(budget)

    spent = _spent_for_category_month(db, current_user.id, budget.category, budget.month)
    return BudgetResponse(
        id=budget.id, category=budget.category, month=budget.month, limit_amount=budget.limit_amount,
        spent=round(spent, 2), remaining=round(budget.limit_amount - spent, 2),
        progress_pct=round(min(100.0, spent / budget.limit_amount * 100) if budget.limit_amount > 0 else 0, 2),
        exceeded=spent > budget.limit_amount,
    )


@router.delete("/{budget_id}")
def delete_budget(budget_id: int, db: Session = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == current_user.id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found.")
    db.delete(budget)
    db.commit()
    return {"message": "Budget deleted."}
