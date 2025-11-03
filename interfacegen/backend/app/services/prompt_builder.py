from typing import Dict, Any


def build_direct_prompt(user_prompt: str) -> str:
    return user_prompt.strip()


def build_wizard_prompt(answers: Dict[str, Any]) -> str:
    parts = [
        "Gere uma landing page acessível (HTML/CSS/JS ou React) com base nas respostas:",
    ]
    for key, value in answers.items():
        parts.append(f"- {key}: {value}")
    parts.append("Use HTML semântico, labels, alt em imagens e contraste adequado.")
    return "\n".join(parts)


