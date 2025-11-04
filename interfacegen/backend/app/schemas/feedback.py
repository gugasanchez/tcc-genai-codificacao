from pydantic import BaseModel, validator
from typing import Optional, List


class LikertAnswers(BaseModel):
    usability: List[int]
    cognitive_load: List[int]
    perceived_quality: List[int]

    @validator("usability", "cognitive_load", "perceived_quality")
    def _validate_five_likert(cls, v: List[int]) -> List[int]:
        if len(v) != 5:
            raise ValueError("cada dimensão deve conter exatamente 5 respostas")
        for i, n in enumerate(v):
            if not isinstance(n, int) or n < 1 or n > 5:
                raise ValueError(f"valores devem estar entre 1 e 5 (item {i+1})")
        return v


class FeedbackCreate(BaseModel):
    session_id: int
    answers: LikertAnswers
    comments: Optional[str] = None


