from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine
from core.config import settings

connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
Base = declarative_base()


def init_db() -> None:
    from models import user, transaction, budget  # noqa: F401
    Base.metadata.create_all(bind=engine)
