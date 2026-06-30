import pandas as pd
from fastapi import HTTPException

MAX_FILE_SIZE_MB = 10


def validate_file_extension(filename: str) -> None:
    if not filename or not filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")


def validate_file_size(content: bytes) -> None:
    size_mb = len(content) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"File exceeds {MAX_FILE_SIZE_MB}MB limit.")
    if size_mb == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")


def validate_dataframe_not_empty(df: pd.DataFrame) -> None:
    if df.empty:
        raise HTTPException(status_code=400, detail="CSV contains no transaction rows.")
