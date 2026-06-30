from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db_session
from models.transaction import Transaction
from models.user import User
from services.health_score_service import compute_health_score
from core.dependencies import get_current_user

router = APIRouter(prefix="/health-score", tags=["health-score"])


@router.get("")
def get_health_score(db: Session = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    return compute_health_score(transactions)
