"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [initialPrompt, setInitialPrompt] = useState("");
  const [starting, setStarting] = useState(false);

  const startExperiment = useCallback(async () => {
    if (!initialPrompt.trim()) {
      alert("Descreva o que deseja gerar no prompt inicial.");
      return;
    }
    try {
      setStarting(true);
      const res = await api.startRun(initialPrompt);
      const seed = encodeURIComponent(initialPrompt);
      router.push(`/wizard?runId=${res.run_id}&directId=${res.direct_session_id}&seed=${seed}`);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setStarting(false);
    }
  }, [initialPrompt, router]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold">InterfaceGen</h1>
          <p className="mt-2 text-zinc-600">
            Experimento controlado para gerar interfaces web com IA em dois modos: Prompt Direto e Wizard Guiado por IA, com foco em acessibilidade (WCAG/WAI‑ARIA) e qualidade.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Você descreve o objetivo inicial (Prompt Direto).</li>
            <li>O sistema gera a versão Direta e usa o mesmo contexto como base do Wizard.</li>
            <li>No Wizard, 5 microiteraçãoes refinam requisitos e acessibilidade.</li>
            <li>Ao final, você compara os dois resultados e avalia cada um.</li>
          </ul>
        </header>

        <section className="rounded-lg border bg-white p-6 shadow-sm" aria-busy={starting}>
          <h2 className="text-xl font-medium">Iniciar experimento</h2>
          <p className="mt-2 text-sm text-zinc-600">Descreva o prompt inicial. Ele gerará a interface do modo Direto e servirá de base para o Wizard Guiado.</p>
          <textarea
            className="mt-4 h-40 w-full rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex.: Landing page com herói, CTA e formulário acessível"
            value={initialPrompt}
            onChange={(e) => setInitialPrompt(e.target.value)}
            disabled={starting}
          />
          <div className="mt-4 flex gap-3">
            <button className="rounded-md bg-zinc-900 px-4 py-2 text-white disabled:opacity-50" onClick={startExperiment} disabled={starting}>
              {starting ? "Iniciando..." : "Iniciar trilha (Direto → Wizard)"}
            </button>
            <Link href="/admin" className="text-sm text-zinc-700 underline">Painel do pesquisador</Link>
          </div>
        </section>

        <section className="mt-8 flex items-center justify-between">
          <Link href="/admin" className="text-sm text-zinc-700 underline">
            Painel do pesquisador
          </Link>
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-zinc-400"
          >
            Next.js
          </a>
        </section>
      </div>
    </div>
  );
}
