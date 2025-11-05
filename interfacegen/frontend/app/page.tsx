"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";
import { getLocalParticipantId } from "../lib/participant";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [initialPrompt, setInitialPrompt] = useState("");
  const [starting, setStarting] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [preStartAt, setPreStartAt] = useState<number | null>(null);

  const startExperiment = useCallback(async () => {
    if (!initialPrompt.trim()) {
      alert("Descreva o que deseja gerar no prompt inicial.");
      return;
    }
    try {
      setStarting(true);
      const elapsed = preStartAt ? Date.now() - preStartAt : undefined;
      const res = await api.startRun(
        initialPrompt,
        typeof elapsed === "number" ? elapsed : undefined
      );
      const seed = encodeURIComponent(initialPrompt);
      const pid = getLocalParticipantId();
      router.push(
        `/wizard?runId=${res.run_id}&directId=${
          res.direct_session_id
        }&seed=${seed}${pid ? `&participantId=${pid}` : ""}`
      );
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setStarting(false);
    }
  }, [initialPrompt, router, preStartAt]);

  const revealPrompt = useCallback(() => {
    setShowPrompt(true);
    setPreStartAt(Date.now());
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold">InterfaceGen</h1>
          <p className="mt-2 text-zinc-600">
            Experimento controlado para gerar interfaces web com IA em dois
            modos: Prompt Direto e Wizard Guiado por IA, com foco em
            acessibilidade (WCAG/WAI‑ARIA) e qualidade.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Você descreve o objetivo inicial (Prompt Direto).</li>
            <li>
              O sistema gera a versão Direta e usa o mesmo contexto como base do
              Wizard.
            </li>
            <li>
              No Wizard, 5 microiteraçãoes refinam requisitos e acessibilidade.
            </li>
            <li>Ao final, você compara os dois resultados e avalia cada um.</li>
          </ul>
        </header>

        <section
          className="rounded-lg border bg-white p-6 shadow-sm"
          aria-busy={starting}
        >
          <h2 className="text-xl font-medium">Iniciar experimento</h2>
          {!showPrompt && (
            <div className="mt-3">
              <button
                className="rounded-md bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
                onClick={revealPrompt}
                disabled={starting}
              >
                Iniciar experimento
              </button>
            </div>
          )}
          {showPrompt && (
            <div className="mt-3">
              <p className="text-sm text-zinc-600">
                Descreva o prompt inicial. Ele gerará a interface do modo Direto
                e servirá de base para o Wizard Guiado.
              </p>
              <textarea
                className="mt-4 h-40 w-full rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex.: Landing page com herói, CTA e formulário acessível"
                value={initialPrompt}
                onChange={(e) => setInitialPrompt(e.target.value)}
                disabled={starting}
              />
              <div className="mt-4 flex gap-3">
                <button
                  className="rounded-md bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
                  onClick={startExperiment}
                  disabled={starting}
                >
                  {starting ? "Iniciando..." : "Iniciar trilha"}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="mt-8 flex items-center justify-between">
          <Link href="/admin" className="text-sm text-zinc-700 underline">
            Painel do pesquisador
          </Link>
        </section>
      </div>
    </div>
  );
}
