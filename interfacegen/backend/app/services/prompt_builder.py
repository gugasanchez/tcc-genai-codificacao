from typing import Dict, Any, List


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


def build_refine_messages(current_prompt: str, last_answer: str, turn_index: int) -> List[Dict[str, str]]:
    system = (
        "Você é um Analista de Requisitos e Acessibilidade. Aplique práticas de PE4RE, ReAct curto (sem pensamentos visíveis), prompt chaining e self-critique mínima. "
        "Elicite e consolide requisitos funcionais e não funcionais, além de uma checklist WCAG/WAI-ARIA integrada. "
        "Responda SEMPRE em JSON estrito com os campos: "
        "question (string, <=120 chars), suggestions (array<=3, curtas), prompt (string, rascunho atualizado), "
        "wcag_flags (obj com alt,label,landmarks,contrast,tabindex: booleans), "
        "requirements_doc (obj com: functional[], non_functional[], acceptance_criteria[], accessibility[], aria_landmarks[], constraints[], risks[], ui_components[], data[]), "
        "ready (bool)."
    )
    user = (
        f"Contexto atual do prompt composto:\n{current_prompt}\n\n"
        f"Última resposta do usuário: {last_answer or '-'}\n"
        f"Iteração: {turn_index + 1}. "
        f"Faça UMA pergunta objetiva sobre lacunas críticas (funcionais, não funcionais, acessibilidade/ARIA, componentes, dados, critérios de aceitação). "
        f"Atualize o rascunho do prompt e os arrays do requirements_doc. Se já houver cobertura mínima em todas as seções e wcag_flags completos, defina ready=true."
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

