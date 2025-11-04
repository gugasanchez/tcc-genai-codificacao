from typing import Dict, Any, List, Optional
import json


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


def build_refine_messages(current_prompt: str, last_answer: str, turn_index: int, requirements_doc: Optional[Dict[str, Any]] = None) -> List[Dict[str, str]]:
    system = (
        "Você é um Analista de Requisitos e Acessibilidade. Aplique PE4RE, prompt chaining e self-critique mínima. "
        "Seu objetivo é refinar um prompt de geração de interface para melhorar acessibilidade (WCAG/WAI-ARIA), clareza de requisitos funcionais e não funcionais e qualidade geral. "
        "Responda SOMENTE com um JSON válido (sem markdown/backticks), contendo os campos: "
        "question (string, <=120 chars), suggestions (array<=3, curtas), prompt (string, rascunho atualizado), ready (bool)."
    )
    user = (
        f"Contexto atual do prompt composto:\n{current_prompt}\n\n"
        f"Última resposta do usuário: {last_answer or '-'}\n"
        f"Iteração: {turn_index + 1}. "
        f"Faça UMA pergunta objetiva para reduzir ambiguidade e cobrir aspectos críticos de requisitos (funcionais/não funcionais) e acessibilidade (WCAG/ARIA). "
        f"Atualize o rascunho do prompt incorporando a resposta do usuário e explicitando requisitos e práticas de acessibilidade quando necessário. "
        f"Se o rascunho já estiver claro e suficiente para uma boa geração acessível, defina ready=true."
    )
    return [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ]


def build_generate_messages(final_prompt: str) -> List[Dict[str, str]]:
    system = (
        "Você é um Engenheiro Front-end Sênior + A11y. Gere SOMENTE código executável (HTML/CSS/JS ou React) com HTML semântico, ARIA correto, design responsivo, e componentes reutilizáveis."
    )
    user = final_prompt
    return [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ]

