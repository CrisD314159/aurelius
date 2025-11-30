"""This module contains everything needed for establish 
a communication between frontend and backend using websockets"""

from typing import List
import numpy as np
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.services.stt.stt_service import STTService
from app.services.llm.llm_service import LLMService


router = APIRouter(
    prefix="/ws"
)


class ConnectionManager:
    """
    This class is used as an auxiliar for 
    connect, and disconnect websockets
    """

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """This method receives a websocket from the frontend"""
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        """This method disconnects a websocket from the frontend"""
        self.active_connections.remove(websocket)

    def is_silence(self, chunk, threshold=500):
        """This method detects if there is silence
          in a provided PCM RAW audio chunk"""
        audio = np.frombuffer(chunk, dtype=np.int16)
        return np.abs(audio).mean() < threshold


manager = ConnectionManager()


@router.websocket("/call")
async def electron_prompt(websocket: WebSocket,
                          stt_service: STTService = Depends(),
                          llm_service: LLMService = Depends()):
    """
    This method receives an hanldes the websocket connection from the frontend.
    First, receives the user speech audio, then using STT service converts the waveform
    to text. After that, this method uses the LLM and TTS services to generate 
    and send a response to the frontend


    :param websocket: Description
    :type websocket: WebSocket
    :param stt_service: Description
    :type stt_service: STTService
    :param llm_service: Description
    :type llm_service: LLMService
    """
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
                print(answer)

    except WebSocketDisconnect:
        await manager.disconnect(websocket)
