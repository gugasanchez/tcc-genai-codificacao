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
            "feedback": (
                {
                    "answers": getattr(s.feedback, "answers", None),
                    "usability_score": getattr(s.feedback, "usability_score", None),
                    "cognitive_score": getattr(s.feedback, "cognitive_score", None),
                    "quality_score": getattr(s.feedback, "quality_score", None),
                    "overall_score": getattr(s.feedback, "overall_score", None),
                    "comments": getattr(s.feedback, "comments", None),
                }
                if getattr(s, "feedback", None)
                else None
            ),
        }
        for s in sessions
    ]
    return JSONResponse(content=data)


@router.get("/csv")
def export_csv(db: Session = Depends(get_db)):
    sessions = db.query(models.Session).all()
    buf = io.StringIO()
    writer = csv.writer(buf)
    header = [
        "id",
        "participant_id",
        "mode",
        "generation_time_ms",
        "accessibility_score",
        "created_at",
        # feedback sums
        "usability_score",
        "cognitive_score",
        "quality_score",
        "overall_score",
        # per-question raw answers
        *[f"u{i+1}" for i in range(5)],
        *[f"c{i+1}" for i in range(5)],
        *[f"q{i+1}" for i in range(5)],
        "comments",
    ]
    writer.writerow(header)
    for s in sessions:
        f = getattr(s, "feedback", None)
        answers = getattr(f, "answers", None) or {}
        u = (answers.get("usability") if isinstance(answers, dict) else None) or [None] * 5
        c = (answers.get("cognitive_load") if isinstance(answers, dict) else None) or [None] * 5
        q = (answers.get("perceived_quality") if isinstance(answers, dict) else None) or [None] * 5
        row = [
            s.id,
            str(s.participant_id),
            s.mode,
            s.generation_time_ms or "",
            s.accessibility_score or "",
            s.created_at.isoformat(),
            getattr(f, "usability_score", "") or "",
            getattr(f, "cognitive_score", "") or "",
            getattr(f, "quality_score", "") or "",
            getattr(f, "overall_score", "") or "",
            *[(x if x is not None else "") for x in u[:5]],
            *[(x if x is not None else "") for x in c[:5]],
            *[(x if x is not None else "") for x in q[:5]],
            getattr(f, "comments", "") or "",
        ]
        writer.writerow(row)
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv")


