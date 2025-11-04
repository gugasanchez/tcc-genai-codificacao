from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from time import perf_counter
from app.db.session import get_db
from app.db import models
from app.schemas.session import GenerateRequest, SessionResponse, DraftRequest, DraftResponse, FinalGenerateRequest
from app.services.llm_client import LLMClient
from app.services.prompt_builder import build_direct_prompt, build_wizard_prompt, build_refine_messages, build_generate_messages
import uuid
import hashlib
import json
import re


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

    db.add(session)
    db.commit()

    return SessionResponse(session_id=session.id, code=code, metrics=None)
@router.post("/draft", response_model=DraftResponse)
def draft_iteration(payload: DraftRequest, db: Session = Depends(get_db)):
    print({
        "draft_event": "start",
        "session_id": payload.session_id,
        "run_id": payload.run_id,
        "turn_index": payload.turn_index,
        "current_prompt_chars": len(payload.current_prompt or ""),
    })
    if payload.session_id is None and not (payload.run_id):
        raise HTTPException(status_code=400, detail="run_id é obrigatório na primeira iteração")

    # Cria sessão placeholder se necessário
    if payload.session_id is None:
        run_uuid = uuid.UUID(payload.run_id)  # type: ignore[arg-type]
        session = models.Session(
            participant_id=None,
            run_id=run_uuid,
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
    # Monta mensagens para a LLM (sem requisitos/flags persistidos)
    messages = build_refine_messages(payload.current_prompt, payload.user_answer or "", payload.turn_index, None)
    print({
        "draft_event": "messages_built",
        "messages_preview": [m.get("role") for m in messages],
    })

    ready = False
    ai_question = None  # sem fallback estático
    suggestions: list[str] = []
    prompt_snapshot = payload.current_prompt
    # sem wcag_flags / requirements_doc neste fluxo simplificado

    def _try_parse_json(txt: str):
        preview = (txt or "")[:600]
        print({"draft_event": "llm_raw_preview", "preview": preview})
        # normalização leve
        def _normalize(s: str) -> str:
            s = s.replace("\ufeff", "")  # BOM
            # aspas "inteligentes" para aspas normais
            s = s.replace("\u201c", '"').replace("\u201d", '"').replace("\u2018", '"').replace("\u2019", '"')
            return s
        txt = _normalize(txt)
        # 1) tentativa direta
        try:
            direct = json.loads(txt)
            if isinstance(direct, str):
                # às vezes vem string contendo JSON; tenta de novo
                try:
                    nested = json.loads(direct)
                    print({"json_parse_strategy": "direct_nested"})
                    return nested
                except Exception:
                    pass
            print({"json_parse_strategy": "direct"})
            return direct
        except Exception:
            pass
        # 2) remover cercas de código ```...```
        try:
            stripped = txt.strip()
            if stripped.startswith("```") and stripped.endswith("```"):
                # remove primeira linha com ```json ou ``` e a última com ```
                lines = stripped.splitlines()
                if len(lines) >= 3:
                    inner = "\n".join(lines[1:-1])
                    res = json.loads(inner)
                    print({"json_parse_strategy": "strip_fences"})
                    return res
        except Exception:
            pass
        # 3) corrigir vírgulas finais e tentar
        try:
            fixed = re.sub(r",\s*([}\]])", r"\1", txt)
            res = json.loads(fixed)
            print({"json_parse_strategy": "fix_trailing_commas"})
            return res
        except Exception:
            pass
        # 4) varredura por blocos balanceados { ... }
        try:
            stack = 0
            start = -1
            candidates = []
            for i, ch in enumerate(txt):
                if ch == '{':
                    if stack == 0:
                        start = i
                    stack += 1
                elif ch == '}':
                    stack -= 1
                    if stack == 0 and start != -1:
                        candidates.append(txt[start:i+1])
                        start = -1
            # tenta cada candidato e escolhe o que contém campos esperados
            for c in candidates:
                try:
                    obj = json.loads(c)
                    keys = obj.keys() if isinstance(obj, dict) else []
                    if any(k in keys for k in ("question", "prompt", "wcag_flags", "requirements_doc")):
                        print({"json_parse_strategy": "balanced_block"})
                        return obj
                except Exception:
                    continue
        except Exception:
            pass
        # 5) heurística: substituir aspas simples por duplas somente fora de contexto perigoso
        try:
            single_fixed = re.sub(r"'", '"', txt)
            res = json.loads(single_fixed)
            print({"json_parse_strategy": "replace_single_quotes"})
            return res
        except Exception:
            pass
        # falha
        raise ValueError("could not coerce JSON from LLM content")

    try:
        print({"draft_event": "llm_chat_request"})
        content = llm.chat(messages, temperature=0.7, max_tokens=600)
        print({"draft_event": "llm_chat_response", "content_chars": len(content or "")})
        obj = _try_parse_json(content)
        ai_question = (obj.get("question") or "")
        if isinstance(ai_question, str):
            ai_question = ai_question[:160]
        prompt_snapshot = str(obj.get("prompt") or prompt_snapshot)
        suggestions = obj.get("suggestions") or suggestions
        ready = bool(obj.get("ready", False))
        print({
            "draft_event": "llm_parsed",
            "has_question": bool(ai_question),
            "suggestions_count": len(suggestions) if isinstance(suggestions, list) else 0,
        })
    except Exception as e:
        # Em caso de falha, registre e siga com valores vazios para não quebrar o fluxo (sem pergunta estática)
        print({"llm_refine_parse_warning": str(e)})
        ai_question = ""  # não exibir pergunta estática
        suggestions = []

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
        wcag_flags=None,
        requirements_doc=None,
        model_name=llm.settings.llm_model,
        temperature=0.7,
        duration_ms=elapsed_ms,
    )
    db.add(turn)
    db.commit()
    print({
        "draft_event": "turn_persisted",
        "session_id": session.id,
        "turn_index": payload.turn_index,
        "duration_ms": elapsed_ms,
    })

    # Heurística de prontidão simplificada: sinal da LLM ou 3+ iterações
    is_ready = ready or (session.refine_iterations or 0) >= 3
    print({
        "draft_event": "ready_eval",
        "ready_model": ready,
        "iterations": session.refine_iterations,
        "is_ready": is_ready,
    })

    return DraftResponse(
        session_id=session.id,
        ai_question=ai_question or "",
        suggestions=(suggestions or [])[:3],
        prompt_snapshot=prompt_snapshot,
        ready=is_ready,
        model=llm.settings.llm_model,
        temperature=0.7,
        duration_ms=elapsed_ms,
    )


@router.post("/final", response_model=SessionResponse)
def finalize_generation(payload: FinalGenerateRequest, db: Session = Depends(get_db)):
    # Finaliza geração na MESMA sessão wizard, incorporando requisitos/flags coletados
    session = db.get(models.Session, payload.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    if session.mode != "wizard":
        raise HTTPException(status_code=400, detail="Finalização permitida apenas para sessões em modo 'wizard'")

    # Prompt final: apenas o prompt consolidado da sessão
    final_prompt = session.prompt or ""

    start = perf_counter()
    llm = LLMClient()
    code = llm.generate_code(final_prompt)
    if len(code) > 200_000:
        code = code[:200_000]

    elapsed_ms = int((perf_counter() - start) * 1000)

    # Atualiza a mesma sessão
    session.final_prompt = final_prompt
    session.response_code = code
    session.generation_time_ms = elapsed_ms
    session.content_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()

    db.add(session)
    db.commit()

    return SessionResponse(session_id=session.id, code=code, metrics=None)



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


