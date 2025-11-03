from pydantic import BaseModel
from typing import Optional


class FeedbackCreate(BaseModel):
    session_id: int
    sus_score: Optional[int] = None
    nasa_tlx_load: Optional[int] = None
    comments: Optional[str] = None


