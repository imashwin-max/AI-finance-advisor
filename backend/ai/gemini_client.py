import google.generativeai as genai
from typing import AsyncGenerator, List, Dict
from core.config import settings

_configured = False


def is_gemini_available() -> bool:
    return bool(settings.GEMINI_API_KEY)


def _ensure_configured():
    global _configured
    if not _configured:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        _configured = True


def get_model():
    _ensure_configured()
    return genai.GenerativeModel("gemini-2.0-flash")


async def generate_reply(prompt_parts: List[Dict]) -> str:
    model = get_model()
    prompt_text = prompt_parts[0]["parts"][0]
    response = model.generate_content(prompt_text)
    return response.text


async def generate_reply_stream(prompt_parts: List[Dict]) -> AsyncGenerator[str, None]:
    model = get_model()
    prompt_text = prompt_parts[0]["parts"][0]
    response = model.generate_content(prompt_text, stream=True)
    for chunk in response:
        if chunk.text:
            yield chunk.text
