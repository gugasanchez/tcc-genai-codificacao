from fastapi import FastAPI
from app.core.logic import score_value

app = FastAPI(title="TCC GenAI RAG Demo")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/score")
def score(a: int, b: int) -> dict:
    return {"score": score_value(a, b)}


