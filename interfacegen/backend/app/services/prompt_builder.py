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
        "Você é um Engenheiro de Requisitos. Transforme a intenção do usuário em um mini-SRS conciso e acionável. "
        "Priorize: objetivos, telas/fluxos/estados, componentes, modelo de dados, integrações, critérios de aceite e requisitos não funcionais "
        "(desempenho, segurança, i18n, responsividade e acessibilidade WCAG 2.2 AA). "
        "A cada iteração:\n"
        "1) Faça 2–3 perguntas objetivas (≤100 caracteres cada) sobre as lacunas mais críticas.\n"
        "2) Sugira até 3 melhorias curtas e específicas (frases imperativas).\n"
        "3) Devolva um JSON válido contendo: "
        "question (string <=240 chars, primeira pergunta mais importante), "
        "suggestions (array <=5), "
        "prompt (string com o rascunho atualizado do documento de requisitos) "
        "e ready (bool indicando se o documento está suficientemente completo para gerar o código final). "
        "Defina ready=true somente quando summary, telas, modelo de dados, critérios de aceite e requisitos não funcionais estiverem razoavelmente completos. "
        "Responda SOMENTE com um JSON válido (sem markdown/backticks)."
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

