from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from contextlib import asynccontextmanager

from core.config import settings
from database.base import init_db

from routers import upload, transactions, analytics, budgets, health_score, chat, auth, export


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="AI Finance Advisor API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(status_code=422, content={"detail": "Invalid request data.", "errors": exc.errors()})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"detail": "Internal server error. Please try again."})


app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(transactions.router)
app.include_router(analytics.router)
app.include_router(budgets.router)
app.include_router(health_score.router)
app.include_router(chat.router)
app.include_router(export.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "AI Finance Advisor API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
