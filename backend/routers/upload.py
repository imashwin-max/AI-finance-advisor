from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import FileResponse, Response
from sqlalchemy.orm import Session
from pathlib import Path
from database.session import get_db_session
from models.transaction import Transaction
from models.user import User
from services.csv_parser import parse_bank_statement
from services.categorizer import categorize_transaction
from utils.csv_validators import validate_file_extension, validate_file_size
from core.dependencies import get_current_user

router = APIRouter(prefix="/upload", tags=["upload"])

SAMPLE_CSV_PATH = Path(__file__).resolve().parent.parent.parent / "sample-data" / "demo-transactions.csv"


@router.post("")
async def upload_statement(
    file: UploadFile = File(...),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    validate_file_extension(file.filename)
    content = await file.read()
    validate_file_size(content)

    records = parse_bank_statement(content)

    created = 0
    for record in records:
        category, _confidence = categorize_transaction(record["description"], record.get("merchant"))
        txn = Transaction(
            user_id=current_user.id,
            date=record["date"],
            description=record["description"],
            merchant=record.get("merchant"),
            category=category,
            debit=record["debit"],
            credit=record["credit"],
            balance=record.get("balance"),
        )
        db.add(txn)
        created += 1

    db.commit()
    return {"message": "Statement processed successfully.", "transactions_imported": created}


@router.get("/sample-csv")
def download_sample_csv():
    if SAMPLE_CSV_PATH.exists():
        return FileResponse(path=str(SAMPLE_CSV_PATH), media_type="text/csv", filename="demo-transactions.csv")

    fallback = (
        "Date,Description,Debit,Credit,Balance\n"
        "2026-06-01,Salary Credit,0,75000,75000\n"
        "2026-06-02,Swiggy Order,450,0,74550\n"
    )
    return Response(content=fallback, media_type="text/csv",
                     headers={"Content-Disposition": "attachment; filename=demo-transactions.csv"})
