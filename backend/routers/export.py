from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from datetime import date
from database.session import get_db_session
from models.transaction import Transaction
from models.user import User
from services.report_service import generate_csv_export, generate_pdf_export
from core.dependencies import get_current_user

router = APIRouter(prefix="/export", tags=["export"])


@router.get("/csv")
def export_csv(db: Session = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    content = generate_csv_export(transactions)
    filename = f"transactions_{date.today().isoformat()}.csv"
    return Response(content=content, media_type="text/csv",
                     headers={"Content-Disposition": f"attachment; filename={filename}"})


@router.get("/pdf")
def export_pdf(db: Session = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    content = generate_pdf_export(transactions, user_name=current_user.full_name or current_user.email)
    filename = f"financial_report_{date.today().isoformat()}.pdf"
    return Response(content=content, media_type="application/pdf",
                     headers={"Content-Disposition": f"attachment; filename={filename}"})
