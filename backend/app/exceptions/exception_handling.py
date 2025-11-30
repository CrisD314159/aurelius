from fastapi import HTTPException, status


class JarvisException(HTTPException):
    """Base Exception"""
    pass


class LLMNotLoadedException(JarvisException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="LLM not loaded"
        )


class ConversationNotFoundException(JarvisException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=self.detail
        )


class TTSException(JarvisException):
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail
        )


class STTException(JarvisException):
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail
        )
