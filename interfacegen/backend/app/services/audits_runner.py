import subprocess
import json
from typing import Optional, Tuple
from app.config import get_settings


def run_audits(html_content: str) -> Tuple[Optional[int], Optional[dict]]:
    """Executa o CLI de auditoria passando HTML via stdin e retorna (score, findings)."""
    settings = get_settings()
    cli_path = settings.audits_cli_path
    try:
        completed = subprocess.run(
            ["node", cli_path, "--stdin"],
            input=html_content.encode("utf-8"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=settings.audits_timeout_seconds,
            check=True,
        )
        payload = json.loads(completed.stdout.decode("utf-8") or "{}")
        score = payload.get("accessibility_score")
        findings = payload.get("wcag_findings")
        return score, findings
    except Exception:
        # Falha na auditoria não deve quebrar fluxo de geração
        return None, None


