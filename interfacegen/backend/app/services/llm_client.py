from typing import Any, Dict
from tenacity import retry, stop_after_attempt, wait_exponential
from app.config import get_settings


class LLMClient:
    def __init__(self) -> None:
        self.settings = get_settings()

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.5, min=1, max=8))
    def generate_code(self, prompt: str) -> str:
        # Log mínimo de parâmetros (para reprodutibilidade)
        print({
            "model": self.settings.llm_model,
            "temperature": self.settings.llm_temperature,
            "prompt_chars": len(prompt)
        })
        # Stub inicial: integrar com provedor GPT-4o posteriormente
        # Retorna um HTML mínimo para não quebrar o fluxo
        return (
            "<!doctype html><html><head><meta charset=\"utf-8\"></head>"
            "<body><main><h1>Generated UI</h1></main></body></html>"
        )


