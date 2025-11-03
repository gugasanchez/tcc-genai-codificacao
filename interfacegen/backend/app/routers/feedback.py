from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models
from app.schemas.feedback import FeedbackCreate


router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.post("")
def create_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    session = db.get(models.Session, payload.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    fb = models.Feedback(
        session_id=payload.session_id,
        sus_score=payload.sus_score,
        nasa_tlx_load=payload.nasa_tlx_load,
        comments=payload.comments,
    )
    db.add(fb)
    db.commit()
    return {"ok": True}


