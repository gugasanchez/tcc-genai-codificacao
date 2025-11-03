from typing import Any, Dict
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from app.config import get_settings
import httpx


def _fallback_html(_: Any) -> str:
    return (
        "<!doctype html><html><head><meta charset=\"utf-8\"></head>"
        "<body><main><h1>Generated UI (fallback)</h1></main></body></html>"
    )


class LLMClient:
    def __init__(self) -> None:
        self.settings = get_settings()

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=0.5, min=1, max=8),
        retry=retry_if_exception_type(httpx.HTTPError),
        retry_error_callback=_fallback_html,
    )
    def generate_code(self, prompt: str) -> str:
        print({
            "model": self.settings.llm_model,
            "temperature": self.settings.llm_temperature,
            "prompt_chars": len(prompt)
        })

        if not self.settings.openai_api_key:
            # fallback seguro se não houver chave
            return (
                "<!doctype html><html><head><meta charset=\"utf-8\"></head>"
                "<body><main><h1>Generated UI (fallback)</h1></main></body></html>"
            )

        system = (
            "You output ONLY ready-to-run HTML/CSS/JS (or React) with strong accessibility. "
            "No markdown, no backticks, no explanations. Use semantic HTML, labels, alt text, "
            "keyboard focus, and responsive layout."
        )
        payload = {
            "model": self.settings.llm_model,
            "temperature": self.settings.llm_temperature,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
        }
        headers = {
            "Authorization": f"Bearer {self.settings.openai_api_key}",
            "Content-Type": "application/json",
        }

        try:
            with httpx.Client(timeout=60) as client:
                r = client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
                r.raise_for_status()
                data = r.json()
                content = data["choices"][0]["message"]["content"]
                return content.strip()
        except httpx.HTTPStatusError as e:
            status = e.response.status_code if e.response is not None else None
            print({"openai_http_error": str(e), "status": status})
            # Re-tenta automaticamente em 429/5xx
            if status in {429, 500, 502, 503, 504}:
                raise
            # Demais 4xx: não há sentido em re-tentar; deixa cair para fallback via callback
            return _fallback_html(None)
        except httpx.HTTPError as e:
            print({"openai_http_error": str(e)})
            # Re-tenta erros de rede/transientes
            raise
        except Exception as e:
            print({"openai_unexpected_error": str(e)})
            return _fallback_html(None)


