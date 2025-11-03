from pydantic import BaseModel, Field
from typing import Optional, Literal, Dict, Any


Mode = Literal["direct", "wizard"]


class GenerateRequest(BaseModel):
    participant_id: str
    mode: Mode
    prompt: Optional[str] = None
    wizard_answers: Optional[Dict[str, Any]] = None


class SessionResponse(BaseModel):
    session_id: int
    code: str
    metrics: Optional[dict] = None


