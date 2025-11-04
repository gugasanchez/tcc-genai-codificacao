from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from time import perf_counter
from app.db.session import get_db
from app.db import models
from app.schemas.session import GenerateRequest, SessionResponse, DraftRequest, DraftResponse, FinalGenerateRequest
from app.services.llm_client import LLMClient
from app.services.prompt_builder import build_direct_prompt, build_wizard_prompt, build_refine_messages, build_generate_messages
from app.services.audits_runner import run_audits
import uuid
import hashlib
import json


router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("/generate", response_model=SessionResponse)
def generate_interface(payload: GenerateRequest, db: Session = Depends(get_db)):
    if payload.mode == "direct" and not payload.prompt:
        raise HTTPException(status_code=400, detail="prompt é obrigatório no modo direct")
    # No modo wizard, aceitamos OU wizard_answers (fluxo antigo) OU um prompt final consolidado (fluxo novo)
    if payload.mode == "wizard" and not (payload.wizard_answers or payload.prompt):
        raise HTTPException(status_code=400, detail="forneça 'wizard_answers' ou 'prompt' no modo wizard")

    start = perf_counter()

    if payload.mode == "direct":
        full_prompt = build_direct_prompt(payload.prompt or "")
    else:
        # wizard: se vier answers, compõe; caso contrário usa o prompt consolidado fornecido
        if payload.wizard_answers:
            full_prompt = build_wizard_prompt(payload.wizard_answers or {})
        else:
            full_prompt = (payload.prompt or "").strip()

    llm = LLMClient()
    code = llm.generate_code(full_prompt)
    # Cap de tamanho para atender RNF de desempenho e segurança
    if len(code) > 200_000:
        code = code[:200_000]

    participant_uuid = uuid.UUID(payload.participant_id)

    session = models.Session(
        participant_id=participant_uuid,
        mode=payload.mode,
        prompt=full_prompt,
        response_code=code,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    elapsed_ms = int((perf_counter() - start) * 1000)
    session.generation_time_ms = elapsed_ms
    session.content_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()

    # Executa auditorias (stub retorna None por enquanto)
    score, findings = run_audits(code)
    if score is not None:
        session.accessibility_score = score
    if findings is not None:
        session.wcag_findings = findings
    db.add(session)
    db.commit()

    return SessionResponse(session_id=session.id, code=code, metrics=None)
@router.post("/draft", response_model=DraftResponse)
def draft_iteration(payload: DraftRequest, db: Session = Depends(get_db)):
    if payload.session_id is None and not payload.participant_id:
        raise HTTPException(status_code=400, detail="participant_id é obrigatório na primeira iteração")

    # Cria sessão placeholder se necessário
    if payload.session_id is None:
        participant_uuid = uuid.UUID(payload.participant_id)  # type: ignore[arg-type]
        session = models.Session(
            participant_id=participant_uuid,
            mode="wizard",
            prompt=payload.current_prompt,
            response_code=None,
            refine_iterations=0,
            final_prompt=None,
        )
        db.add(session)
        db.commit()
        db.refresh(session)
    else:
        session = db.get(models.Session, payload.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Sessão não encontrada")

    start = perf_counter()
    llm = LLMClient()
    messages = build_refine_messages(payload.current_prompt, payload.user_answer or "", payload.turn_index)

    ready = False
    ai_question = "Quais elementos principais a interface deve conter?"
    suggestions = ["Menu + herói", "Formulário com labels", "Contraste alto"]
    prompt_snapshot = payload.current_prompt
    wcag_flags = {"alt": False, "label": False, "landmarks": False, "contrast": False, "tabindex": False}

    try:
        content = llm.chat(messages, temperature=0.3, max_tokens=300)
        # Tenta extrair JSON do conteúdo
        obj = None
        try:
            # Se vier marcado, tenta pegar primeiro objeto JSON
            start_i = content.find("{")
            end_i = content.rfind("}")
            if start_i != -1 and end_i != -1 and end_i > start_i:
                obj = json.loads(content[start_i:end_i+1])
        except Exception:
            obj = None
        if isinstance(obj, dict):
            ai_question = str(obj.get("question") or ai_question)[:160]
            prompt_snapshot = str(obj.get("prompt") or prompt_snapshot)
            wcag_flags = obj.get("wcag_flags") or wcag_flags
            suggestions = obj.get("suggestions") or suggestions
            ready = bool(obj.get("ready", False))
            requirements_doc = obj.get("requirements_doc") or {}
        else:
            requirements_doc = {}
    except Exception:
        # Mantém valores default
        requirements_doc = {}

    # Atualiza sessão
    session.prompt = prompt_snapshot
    session.refine_iterations = (session.refine_iterations or 0) + 1
    db.add(session)
    db.commit()

    elapsed_ms = int((perf_counter() - start) * 1000)
    # Persiste turno
    turn = models.DraftTurn(
        session_id=session.id,
        turn_index=payload.turn_index,
        ai_question=ai_question,
        user_answer=payload.user_answer or "",
        prompt_snapshot=prompt_snapshot,
        wcag_flags=wcag_flags,
        requirements_doc=requirements_doc,
        model_name=llm.settings.llm_model,
        temperature=0.3,
        duration_ms=elapsed_ms,
    )
    db.add(turn)
    db.commit()

    # Heurística de prontidão: >=3 iterações ou checklist completo
    checklist_ok = all(bool(wcag_flags.get(k)) for k in ["alt", "label", "landmarks", "contrast", "tabindex"]) if isinstance(wcag_flags, dict) else False
    # Cobertura mínima do documento de requisitos: ao menos 1 item em conjuntos centrais
    def _len_ok(x):
        return isinstance(x, list) and len(x) > 0
    doc_ok = (
        isinstance(requirements_doc, dict)
        and _len_ok(requirements_doc.get("functional"))
        and _len_ok(requirements_doc.get("non_functional"))
        and _len_ok(requirements_doc.get("acceptance_criteria"))
        and _len_ok(requirements_doc.get("accessibility"))
        and _len_ok(requirements_doc.get("aria_landmarks"))
    )
    is_ready = ready or (session.refine_iterations or 0) >= 3 or checklist_ok or doc_ok

    return DraftResponse(
        session_id=session.id,
        ai_question=ai_question,
        suggestions=suggestions[:3],
        prompt_snapshot=prompt_snapshot,
        wcag_flags={
            "wcag_flags": wcag_flags or {},
            "requirements_doc": requirements_doc or {},
        },
        ready=is_ready,
        model=llm.settings.llm_model,
        temperature=0.3,
        duration_ms=elapsed_ms,
    )


@router.post("/final", response_model=SessionResponse)
def finalize_generation(payload: FinalGenerateRequest, db: Session = Depends(get_db)):
    # Reutiliza a lógica existente de geração
    return generate_interface(GenerateRequest(**payload.model_dump()), db)  # type: ignore[arg-type]



@router.get("/{session_id}")
def get_session(session_id: int, db: Session = Depends(get_db)):
    s = db.get(models.Session, session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    return {
        "id": s.id,
        "participant_id": str(s.participant_id),
        "mode": s.mode,
        "prompt": s.prompt,
        "response_code": s.response_code,
        "generation_time_ms": s.generation_time_ms,
        "accessibility_score": s.accessibility_score,
        "wcag_findings": s.wcag_findings,
        "created_at": s.created_at.isoformat(),
    }


