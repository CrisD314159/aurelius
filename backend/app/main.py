"""
This module is the entrypoint for the backed of aurelius desktop app
"""
from fastapi import FastAPI
from app.api.call_router import router as call_router
from app.api.user_router import user_router

app = FastAPI(
    title="Aurelius Backend",
    description="""This API handles everithing related to TTS, STT
    and LLM services for aurelius desktop app""",
    version="1.0.0"
)


app.include_router(call_router)
app.include_router(user_router)
