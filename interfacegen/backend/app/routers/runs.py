from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from time import perf_counter
import uuid
import hashlib
from app.db.session import get_db
from app.db import models
from app.services.llm_client import LLMClient


router = APIRouter(prefix="/runs", tags=["runs"])


@router.post("/start")
def start_run(payload: dict, db: Session = Depends(get_db)):
    initial_prompt = (payload.get("initial_prompt") or "").strip()
    if not initial_prompt:
        raise HTTPException(status_code=400, detail="initial_prompt é obrigatório")

    run_id = uuid.uuid4()
    start = perf_counter()
    llm = LLMClient()
    code = llm.generate_code(initial_prompt)
    if len(code) > 200_000:
        code = code[:200_000]

    session = models.Session(
        participant_id=None,
        run_id=run_id,
        mode="direct",
        prompt=initial_prompt,
        response_code=code,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    elapsed_ms = int((perf_counter() - start) * 1000)
    session.generation_time_ms = elapsed_ms
    session.content_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    db.add(session)
    db.commit()

    return {
        "run_id": str(run_id),
        "direct_session_id": session.id,
        "code": code,
    }


@router.get("/{run_id}")
def get_run(run_id: str, db: Session = Depends(get_db)):
    try:
        rid = uuid.UUID(run_id)
    except Exception:
        raise HTTPException(status_code=400, detail="run_id inválido")

    sessions = (
        db.query(models.Session)
        .filter(models.Session.run_id == rid)
        .order_by(models.Session.created_at.asc())
        .all()
    )
    if not sessions:
        raise HTTPException(status_code=404, detail="Run não encontrado")

    def _serialize(s: models.Session | None):
        if not s:
            return None
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

    direct = next((s for s in sessions if s.mode == "direct"), None)
    wizard = next((s for s in sessions if s.mode == "wizard"), None)

    return {
        "run_id": run_id,
        "direct_session": _serialize(direct),
        "wizard_session": _serialize(wizard),
    }

