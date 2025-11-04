from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models
from app.schemas.feedback import FeedbackCreate
import uuid


router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.post("")
def create_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    session = db.get(models.Session, payload.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    # Se não houver participante vinculado, cria um e associa todas as sessões do mesmo run_id
    if session.participant_id is None:
        new_pid = uuid.uuid4()
        p = models.Participant(id=new_pid, start_mode=session.mode, timestamp_start=session.created_at)
        db.add(p)
        db.flush()
        if session.run_id:
            db.query(models.Session).filter(models.Session.run_id == session.run_id).update({models.Session.participant_id: new_pid})
        else:
            session.participant_id = new_pid
    # Calcula escores por dimensão (carga cognitiva sem inversão — perguntas já positivas)
    u = payload.answers.usability
    c_raw = payload.answers.cognitive_load
    q = payload.answers.perceived_quality
    u_sum = sum(u)
    c_sum = sum(c_raw)
    q_sum = sum(q)
    overall = round((u_sum + c_sum + q_sum) / 3)

    fb = models.Feedback(
        session_id=payload.session_id,
        comments=payload.comments,
        answers={
            "usability": u,
            "cognitive_load": c_raw,
            "perceived_quality": q,
        },
        usability_score=u_sum,
        cognitive_score=c_sum,
        quality_score=q_sum,
        overall_score=overall,
    )
    db.add(fb)
    db.commit()
    return {"ok": True}


