from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database.session import get_db_session
from models.transaction import Transaction
from models.user import User
from schemas.chat import ChatRequest, ChatResponse
from ai.prompt_builder import build_chat_prompt
from ai.gemini_client import generate_reply, generate_reply_stream, is_gemini_available
from ai.mock_advisor import generate_mock_reply
from core.dependencies import get_current_user

router = APIRouter(prefix="/chat", tags=["chat"])


def _get_user_transactions(db: Session, user_id: int):
    return db.query(Transaction).filter(Transaction.user_id == user_id).all()


@router.post("", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    transactions = _get_user_transactions(db, current_user.id)

    if not is_gemini_available():
        return ChatResponse(reply=generate_mock_reply(transactions, payload.message))

    prompt = build_chat_prompt(transactions, payload.message, payload.history)
    try:
        reply = await generate_reply(prompt)
        return ChatResponse(reply=reply)
    except Exception:
        return ChatResponse(reply=generate_mock_reply(transactions, payload.message))


@router.post("/stream")
async def chat_stream(
    payload: ChatRequest,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    transactions = _get_user_transactions(db, current_user.id)

    async def event_generator():
        if not is_gemini_available():
            yield generate_mock_reply(transactions, payload.message)
            return

        prompt = build_chat_prompt(transactions, payload.message, payload.history)
        try:
            chunk_sent = False
            async for chunk in generate_reply_stream(prompt):
                chunk_sent = True
                yield chunk
            if not chunk_sent:
                yield generate_mock_reply(transactions, payload.message)
        except Exception:
            yield generate_mock_reply(transactions, payload.message)

    return StreamingResponse(event_generator(), media_type="text/plain")
