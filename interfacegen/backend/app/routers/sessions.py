from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from time import perf_counter
from app.db.session import get_db
from app.db import models
from app.schemas.session import GenerateRequest, SessionResponse
from app.services.llm_client import LLMClient
from app.services.prompt_builder import build_direct_prompt, build_wizard_prompt
from app.services.audits_runner import run_audits
import uuid
import hashlib


router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("/generate", response_model=SessionResponse)
def generate_interface(payload: GenerateRequest, db: Session = Depends(get_db)):
    if payload.mode == "direct" and not payload.prompt:
        raise HTTPException(status_code=400, detail="prompt é obrigatório no modo direct")
    if payload.mode == "wizard" and not payload.wizard_answers:
        raise HTTPException(status_code=400, detail="wizard_answers é obrigatório no modo wizard")

    start = perf_counter()

    if payload.mode == "direct":
        full_prompt = build_direct_prompt(payload.prompt or "")
    else:
        full_prompt = build_wizard_prompt(payload.wizard_answers or {})

    llm = LLMClient()
    code = llm.generate_code(full_prompt)
    # Cap de tamanho para atender RNF de desempenho e segurança
    if len(code) > 200_000:
        code = code[:200_000]

    participant_uuid = uuid.UUID(payload.participant_id)

    session = models.Session(
        participant_id=participant_uuid,
        mode=payload.mode,
        prompt=full_prompt,
        response_code=code,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    elapsed_ms = int((perf_counter() - start) * 1000)
    session.generation_time_ms = elapsed_ms
    session.content_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()

    # Executa auditorias (stub retorna None por enquanto)
    score, findings = run_audits(code)
    if score is not None:
        session.accessibility_score = score
    if findings is not None:
        session.wcag_findings = findings
    db.add(session)
    db.commit()

    return SessionResponse(session_id=session.id, code=code, metrics=None)


@router.get("/{session_id}")
def get_session(session_id: int, db: Session = Depends(get_db)):
    s = db.get(models.Session, session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    return {
        "id": s.id,
        "participant_id": str(s.participant_id),
        "mode": s.mode,
        "prompt": s.prompt,
        "response_code": s.response_code,
        "generation_time_ms": s.generation_time_ms,
        "accessibility_score": s.accessibility_score,
        "wcag_findings": s.wcag_findings,
        "created_at": s.created_at.isoformat(),
    }


