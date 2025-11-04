from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os


def get_allowed_origins() -> list[str]:
    origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    return [o.strip() for o in origins.split(",") if o.strip()]


app = FastAPI(title="InterfaceGen Backend", version="0.1.0")

from app.config import get_settings as _get_settings
_settings = _get_settings()
cors_origins = ["*"] if _settings.cors_allow_all else get_allowed_origins()
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


from app.routers import sessions, feedback, export, participants, runs
app.include_router(sessions.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(export.router, prefix="/api")
app.include_router(participants.router, prefix="/api")
app.include_router(runs.router, prefix="/api")


# Criação automática do schema (MVP). Para produção, usar Alembic.
from app.db.session import Base, engine
from sqlalchemy import text

@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    # Migrações simples (MVP): adiciona colunas se não existirem
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS refine_iterations INTEGER"))
        conn.execute(text("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS final_prompt TEXT"))
        conn.execute(text("ALTER TABLE draft_turns ADD COLUMN IF NOT EXISTS requirements_doc JSONB"))
        conn.execute(text("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS run_id UUID"))
        # Client-side measured time fields
        conn.execute(text("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS pre_wizard_time_ms INTEGER"))
        conn.execute(text("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS wizard_phase_time_ms INTEGER"))
        # tornar participant_id opcional
        try:
            conn.execute(text("ALTER TABLE sessions ALTER COLUMN participant_id DROP NOT NULL"))
        except Exception:
            pass
        # Feedback: novos campos para questionário Likert
        conn.execute(text("ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS answers JSONB"))
        conn.execute(text("ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS usability_score INTEGER"))
        conn.execute(text("ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS cognitive_score INTEGER"))
        conn.execute(text("ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS quality_score INTEGER"))
        conn.execute(text("ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS overall_score INTEGER"))


