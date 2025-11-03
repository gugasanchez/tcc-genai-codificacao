from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models
import csv
import io
from fastapi.responses import StreamingResponse, JSONResponse


router = APIRouter(prefix="/export", tags=["export"])


@router.get("/json")
def export_json(db: Session = Depends(get_db)):
    sessions = db.query(models.Session).all()
    data = [
        {
            "id": s.id,
            "participant_id": str(s.participant_id),
            "mode": s.mode,
            "generation_time_ms": s.generation_time_ms,
            "accessibility_score": s.accessibility_score,
            "created_at": s.created_at.isoformat(),
        }
        for s in sessions
    ]
    return JSONResponse(content=data)


@router.get("/csv")
def export_csv(db: Session = Depends(get_db)):
    sessions = db.query(models.Session).all()
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["id", "participant_id", "mode", "generation_time_ms", "accessibility_score", "created_at"])
    for s in sessions:
        writer.writerow([s.id, str(s.participant_id), s.mode, s.generation_time_ms or "", s.accessibility_score or "", s.created_at.isoformat()])
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv")


