from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List
from datetime import date
from database.session import get_db_session
from models.transaction import Transaction
from models.user import User
from schemas.transaction import TransactionResponse
from core.dependencies import get_current_user

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=List[TransactionResponse])
def list_transactions(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category: Optional[str] = None,
    merchant: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    transaction_type: Optional[str] = Query(None, pattern="^(income|expense)$"),
    keyword: Optional[str] = None,
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    if category:
        query = query.filter(Transaction.category == category)
    if merchant:
        query = query.filter(Transaction.merchant.ilike(f"%{merchant}%"))
    if transaction_type == "income":
        query = query.filter(Transaction.credit > 0)
    elif transaction_type == "expense":
        query = query.filter(Transaction.debit > 0)
    if min_amount is not None:
        query = query.filter((Transaction.debit >= min_amount) | (Transaction.credit >= min_amount))
    if max_amount is not None:
        query = query.filter((Transaction.debit <= max_amount) | (Transaction.credit <= max_amount))
    if keyword:
        like = f"%{keyword}%"
        query = query.filter(
            (Transaction.description.ilike(like)) | (Transaction.merchant.ilike(like))
        )

    results = query.order_by(Transaction.date.desc()).all()
    return [
        TransactionResponse(
            id=t.id, date=t.date, description=t.description, merchant=t.merchant,
            category=t.category, debit=t.debit, credit=t.credit, balance=t.balance,
            is_recurring=bool(t.is_recurring),
        ) for t in results
    ]


@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    txn = db.query(Transaction).filter(
        and_(Transaction.id == transaction_id, Transaction.user_id == current_user.id)
    ).first()
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found.")
    db.delete(txn)
    db.commit()
    return {"message": "Transaction deleted."}
