"use client";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { api } from "../../lib/api";
import { getParticipantId } from "../../lib/storage";
import { useRouter } from "next/navigation";

type WizardState = "initialPrompt" | "refineLoop" | "readinessCheck" | "finalPreview" | "generating" | "done";

const TURN_TIMEOUT_MS = 20000; // timeout por turno
const MAX_TURNS = 5;

export default function WizardPage() {
  const router = useRouter();
  const [state, setState] = useState<WizardState>("initialPrompt");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [aiQuestion, setAiQuestion] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [wcagFlags, setWcagFlags] = useState<Record<string, unknown>>({});
  const [requirementsDoc, setRequirementsDoc] = useState<any>(null);
  const [readyFlag, setReadyFlag] = useState(false);
  const [loading, setLoading] = useState(false);

  const turnsRef = useRef<Array<{ aiQuestion: string; userAnswer: string; promptSnapshot: string }>>([]);

  const participantId = useMemo(() => getParticipantId(), []);

  const startRefine = useCallback(async () => {
    if (!participantId) {
      alert("Crie um participante na página inicial antes de continuar.");
      return;
    }
    if (!currentPrompt.trim()) {
      alert("Descreva o que deseja gerar.");
      return;
    }
    setState("refineLoop");
    setTurnIndex(0);
    setAiQuestion(null);
    setSuggestions([]);
    setUserAnswer("");
    await doTurn(0, "");
  }, [participantId, currentPrompt]);

  const doTurn = useCallback(
    async (index: number, answer: string) => {
      setLoading(true);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TURN_TIMEOUT_MS);
      try {
        const payload = {
          session_id: sessionId ?? undefined,
          participant_id: sessionId ? undefined : participantId!,
          turn_index: index,
          current_prompt: currentPrompt,
          user_answer: answer,
        };
        const res = await api.draft(payload as any);
        clearTimeout(timer);
        setSessionId(res.session_id);
        setAiQuestion(res.ai_question);
        setSuggestions(res.suggestions || []);
        setCurrentPrompt(res.prompt_snapshot);
        setWcagFlags(res.wcag_flags || {});
        const doc = (res as any)?.wcag_flags?.requirements_doc || null;
        setRequirementsDoc(doc);
        setReadyFlag(res.ready || false);
        turnsRef.current.push({ aiQuestion: res.ai_question, userAnswer: answer, promptSnapshot: res.prompt_snapshot });
      } catch (e) {
        clearTimeout(timer);
        alert((e as Error).message || "Falha ao processar iteração");
      } finally {
        setLoading(false);
      }
    },
    [participantId, sessionId, currentPrompt]
  );

  const submitAnswer = useCallback(async () => {
    const answer = userAnswer.trim();
    setUserAnswer("");
    const nextIndex = turnIndex + 1;
    setTurnIndex(nextIndex);
    await doTurn(nextIndex, answer);
    if (nextIndex + 1 >= 3 && (readyFlag || nextIndex + 1 >= MAX_TURNS)) {
      setState("readinessCheck");
    }
  }, [userAnswer, turnIndex, doTurn, readyFlag]);

  const toFinalPreview = useCallback(() => {
    setState("finalPreview");
  }, []);

  const backToRefine = useCallback(() => {
    setState("refineLoop");
  }, []);

  const finalize = useCallback(async () => {
    if (!participantId || !sessionId) return;
    setState("generating");
    try {
      const res = await api.finalize({
        participant_id: participantId,
        mode: "wizard",
        prompt: currentPrompt,
      } as any);
      router.push(`/results?sessionId=${res.session_id}&view=preview`);
      setState("done");
    } catch (e) {
      alert((e as Error).message);
      setState("finalPreview");
    }
  }, [participantId, sessionId, currentPrompt, router]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Wizard Guiado por IA</h1>
          <Link href="/" className="text-sm text-zinc-700 underline">voltar</Link>
        </header>

        {state === "initialPrompt" && (
          <section className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm text-zinc-600">Descreva o que deseja gerar. A IA fará 3–5 microperguntas para consolidar requisitos e acessibilidade.</p>
            <textarea
              className="h-40 w-full rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex.: Landing page com herói, CTA e formulário acessível"
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
            />
            <div className="mt-4 flex gap-3">
              <button className="rounded-md bg-zinc-900 px-4 py-2 text-white" onClick={startRefine}>Iniciar refinamento</button>
            </div>
          </section>
        )}

        {state === "refineLoop" && (
          <section className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Iteração {turnIndex + 1} / {MAX_TURNS}</h2>
              <span className="text-xs text-zinc-500">Timeout por turno: {TURN_TIMEOUT_MS / 1000}s</span>
            </div>
            <div className="mt-4">
              <div className="text-sm text-zinc-800">{aiQuestion ?? "Aguarde a primeira pergunta..."}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.slice(0, 3).map((s, i) => (
                  <button key={i} className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-50" onClick={() => setUserAnswer(s)}>{s}</button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  className="flex-1 rounded-md border p-2"
                  placeholder="Sua resposta"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                <button className="rounded-md bg-zinc-900 px-4 py-2 text-white disabled:opacity-50" onClick={submitAnswer} disabled={loading || (!userAnswer && suggestions.length === 0)}>
                  {loading ? "Enviando..." : "Responder"}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="text-sm font-medium text-zinc-800">Prompt Composto (snapshot)</div>
              <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded bg-zinc-50 p-3 text-xs text-zinc-800 md:col-span-2">{currentPrompt}</pre>
              <div>
                <div className="text-sm font-medium text-zinc-800">Cobertura WCAG</div>
                <ul className="mt-2 space-y-1 text-xs text-zinc-700">
                  {(["alt","label","landmarks","contrast","tabindex"] as const).map(k => (
                    <li key={k}>{k}: <strong>{String((wcagFlags as any)?.wcag_flags?.[k] ?? (wcagFlags as any)?.[k] ?? false)}</strong></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-800">Documento de Requisitos</div>
                {!requirementsDoc && <p className="mt-2 text-xs text-zinc-600">Aguardando preenchimento...</p>}
                {requirementsDoc && (
                  <ul className="mt-2 space-y-1 text-xs text-zinc-700">
                    <li>Funcionais: <strong>{requirementsDoc.functional?.length ?? 0}</strong></li>
                    <li>Não Funcionais: <strong>{requirementsDoc.non_functional?.length ?? 0}</strong></li>
                    <li>Critérios de Aceitação: <strong>{requirementsDoc.acceptance_criteria?.length ?? 0}</strong></li>
                    <li>Acessibilidade: <strong>{requirementsDoc.accessibility?.length ?? 0}</strong></li>
                    <li>ARIA Landmarks: <strong>{requirementsDoc.aria_landmarks?.length ?? 0}</strong></li>
                    <li>Componentes UI: <strong>{requirementsDoc.ui_components?.length ?? 0}</strong></li>
                    <li>Dados (entidades): <strong>{requirementsDoc.data?.length ?? 0}</strong></li>
                  </ul>
                )}
              </div>
            </div>

            {(turnIndex + 1 >= 3 || readyFlag) && (
              <div className="mt-6 flex items-center justify-between rounded-md bg-emerald-50 p-3 text-emerald-800">
                <span>Critérios mínimos atendidos. Você pode avançar para a revisão final.</span>
                <button className="rounded-md bg-emerald-600 px-3 py-1 text-white" onClick={() => setState("readinessCheck")}>Avançar</button>
              </div>
            )}
          </section>
        )}

        {state === "readinessCheck" && (
          <section className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium">Checagem de prontidão</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li>Requisitos funcionais e não funcionais consolidados</li>
              <li>Checklist WCAG (alt, label, landmarks, contraste, tabindex)</li>
              <li>Iterações: {turnIndex + 1} (mínimo sugerido: 3)</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <button className="rounded-md px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100" onClick={backToRefine}>Voltar</button>
              <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white" onClick={toFinalPreview}>Continuar</button>
            </div>
          </section>
        )}

        {state === "finalPreview" && (
          <section className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium">Prompt consolidado</h2>
            <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded bg-zinc-50 p-3 text-xs text-zinc-800">{currentPrompt}</pre>
            <div className="mt-4 flex gap-3">
              <button className="rounded-md px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100" onClick={backToRefine}>Voltar</button>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white" onClick={finalize}>Gerar</button>
            </div>
          </section>
        )}

        {state === "generating" && (
          <section className="rounded-lg border bg-white p-6 shadow-sm text-sm text-zinc-700">Gerando interface e executando auditorias...</section>
        )}
      </div>
    </div>
  );
}


