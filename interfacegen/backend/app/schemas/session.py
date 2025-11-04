from pydantic import BaseModel, Field
from typing import Optional, Literal, Dict, Any


Mode = Literal["direct", "wizard"]


class GenerateRequest(BaseModel):
    participant_id: Optional[str] = None
    mode: Mode
    prompt: Optional[str] = None
    wizard_answers: Optional[Dict[str, Any]] = None


class SessionResponse(BaseModel):
    session_id: int
    code: str
    metrics: Optional[dict] = None


class DraftRequest(BaseModel):
    # Se session_id ausente, criar nova sessão em modo wizard; usar run_id para agrupar
    session_id: Optional[int] = None
    participant_id: Optional[str] = None
    run_id: Optional[str] = None
    turn_index: int
    current_prompt: str
    user_answer: Optional[str] = ""


class DraftResponse(BaseModel):
    session_id: int
    ai_question: str
    suggestions: list[str]
    prompt_snapshot: str
    ready: bool
    model: str
    temperature: float
    duration_ms: int


class FinalGenerateRequest(BaseModel):
    # Finaliza a geração para uma sessão wizard existente
    session_id: int

