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
    fb = models.Feedback(
        session_id=payload.session_id,
        sus_score=payload.sus_score,
        nasa_tlx_load=payload.nasa_tlx_load,
        comments=payload.comments,
    )
    db.add(fb)
    db.commit()
    return {"ok": True}


