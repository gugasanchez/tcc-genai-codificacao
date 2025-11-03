import uuid
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models


router = APIRouter(prefix="/participants", tags=["participants"])


def _next_start_mode(db: Session) -> str:
  total = db.query(models.Participant).count()
  return "direct" if total % 2 == 0 else "wizard"


@router.post("")
def create_participant(db: Session = Depends(get_db)):
  start_mode = _next_start_mode(db)
  p = models.Participant(id=uuid.uuid4(), start_mode=start_mode, timestamp_start=datetime.utcnow())
  db.add(p)
  db.commit()
  db.refresh(p)
  return {"id": str(p.id), "start_mode": p.start_mode}


