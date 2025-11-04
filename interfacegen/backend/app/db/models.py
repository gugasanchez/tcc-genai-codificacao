import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Text, Enum, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.session import Base


class Participant(Base):
    __tablename__ = "participants"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    start_mode: Mapped[str] = mapped_column(String(16), nullable=False)
    timestamp_start: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    sessions = relationship("Session", back_populates="participant")


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    participant_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("participants.id"), nullable=True)
    run_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    mode: Mapped[str] = mapped_column(String(16), nullable=False)  # direct | wizard
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    response_code: Mapped[str] = mapped_column(Text, nullable=True)
    generation_time_ms: Mapped[int] = mapped_column(Integer, nullable=True)
    accessibility_score: Mapped[int] = mapped_column(Integer, nullable=True)
    wcag_findings: Mapped[dict] = mapped_column(JSONB, nullable=True)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=True)
    refine_iterations: Mapped[int] = mapped_column(Integer, nullable=True)
    final_prompt: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    participant = relationship("Participant", back_populates="sessions")
    feedback = relationship("Feedback", back_populates="session", uselist=False)


class DraftTurn(Base):
    __tablename__ = "draft_turns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(Integer, ForeignKey("sessions.id"), nullable=False)
    turn_index: Mapped[int] = mapped_column(Integer, nullable=False)
    ai_question: Mapped[str] = mapped_column(Text, nullable=False)
    user_answer: Mapped[str] = mapped_column(Text, nullable=True)
    prompt_snapshot: Mapped[str] = mapped_column(Text, nullable=False)
    wcag_flags: Mapped[dict] = mapped_column(JSONB, nullable=True)
    requirements_doc: Mapped[dict] = mapped_column(JSONB, nullable=True)
    model_name: Mapped[str] = mapped_column(String(64), nullable=True)
    temperature: Mapped[float] = mapped_column(Float, nullable=True)
    duration_ms: Mapped[int] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class Feedback(Base):
    __tablename__ = "feedbacks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(Integer, ForeignKey("sessions.id"), nullable=False)
    sus_score: Mapped[int] = mapped_column(Integer, nullable=True)
    nasa_tlx_load: Mapped[int] = mapped_column(Integer, nullable=True)
    comments: Mapped[str] = mapped_column(Text, nullable=True)
    # New Likert-based feedback fields
    answers: Mapped[dict] = mapped_column(JSONB, nullable=True)
    usability_score: Mapped[int] = mapped_column(Integer, nullable=True)
    cognitive_score: Mapped[int] = mapped_column(Integer, nullable=True)
    quality_score: Mapped[int] = mapped_column(Integer, nullable=True)
    overall_score: Mapped[int] = mapped_column(Integer, nullable=True)

    session = relationship("Session", back_populates="feedback")


