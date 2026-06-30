from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db_session
from models.transaction import Transaction
from models.user import User
from schemas.analytics import SummaryResponse, AnalyticsResponse
from services.analytics_service import compute_summary, compute_full_analytics
from core.dependencies import get_current_user

router = APIRouter(tags=["analytics"])


def _get_user_transactions(db: Session, user_id: int):
    return db.query(Transaction).filter(Transaction.user_id == user_id).all()


@router.get("/summary", response_model=SummaryResponse)
def get_summary(db: Session = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    return compute_summary(_get_user_transactions(db, current_user.id))


@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    return compute_full_analytics(_get_user_transactions(db, current_user.id))
