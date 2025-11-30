import numpy as np
from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.services.stt.stt_service import STTService
from app.services.llm.llm_service import LLMService


router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    def is_silence(self, chunk, threshold=500):
        audio = np.frombuffer(chunk, dtype=np.int16)
        return np.abs(audio).mean() < threshold


manager = ConnectionManager()


@router.websocket("/ws/chat")
async def electron_prompt(websocket: WebSocket,
                          stt_service: STTService = Depends(),
                          llm_service: LLMService = Depends()):
    await manager.connect(websocket)

    audio_buffer = bytearray()
    silence_counter = 0

    silence_limit = 8

    try:
        while True:
            # every chunk need a PCM RAW audio format to work
            chunk = await websocket.receive_bytes()
            audio_buffer.extend(chunk)

            if manager.is_silence(chunk):
                silence_counter += 1
            else:
                silence_counter = 0

            if silence_counter >= silence_limit:
                result = await stt_service.transcript_audio(bytes(audio_buffer))
                answer = await llm_service.assemble_prompt(result.get("text"))

    except WebSocketDisconnect:
        await manager.disconnect(websocket)
