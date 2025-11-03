"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, SessionDetails } from "../../lib/api";
import { CodePreview } from "../../components/CodePreview";
import { Loader } from "../../components/Loader";
import { FeedbackForm } from "../../components/FeedbackForm";

export default function ResultsPage() {
  const params = useSearchParams();
  const sessionId = useMemo(() => Number(params.get("sessionId")), [params]);
  const view = useMemo(() => (params.get("view") || "preview"), [params]);
  const [data, setData] = useState<SessionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!Number.isFinite(sessionId)) return;
    api
      .getSession(sessionId)
      .then((d) => {
        if (mounted) setData(d);
      })
      .catch((e) => setError((e as Error).message));
    return () => {
      mounted = false;
    };
  }, [sessionId]);

  if (!Number.isFinite(sessionId)) {
    return <div className="p-6 text-red-700">Parâmetro sessionId inválido.</div>;
  }

  if (!data && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <Loader label="Carregando sessão..." />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-700">{error}</div>;
  }

  // Full-screen preview view
  if (data && view === "preview") {
    return (
      <div className="fixed inset-0 bg-white">
        <CodePreview code={data.response_code} className="absolute inset-0 h-full w-full" />
        <Link
          href={`/results?sessionId=${data.id}&view=avaliar`}
          className="fixed bottom-5 right-5 rounded-full bg-blue-600 px-5 py-3 text-white shadow-lg hover:bg-blue-700"
        >
          Avaliar sessão
        </Link>
      </div>
    );
  }

  // Evaluation view
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Avaliação da sessão #{data!.id}</h1>
          <Link href={`/results?sessionId=${data!.id}&view=preview`} className="text-sm text-zinc-700 underline">ver preview em tela cheia</Link>
        </header>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-medium">Critérios e instruções</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700">
            <li><strong>Acessibilidade (WCAG 2.1)</strong>: o sistema roda auditoria automática (axe/Lighthouse) e exibe um score 0–100. Considere contraste, labels, alt em imagens, navegação por teclado.</li>
            <li><strong>Usabilidade (SUS)</strong>: informe sua percepção geral de facilidade de uso da interface gerada.</li>
            <li><strong>Carga de trabalho (NASA‑TLX)</strong>: avalie o esforço percebido para compreender e usar a interface.</li>
            <li><strong>Comentários</strong>: registre problemas, pontos positivos e sugestões de melhoria.</li>
          </ul>
          <div className="mt-4 rounded-md bg-zinc-50 p-3 text-xs text-zinc-600">
            Dica: você pode revisar o preview em tela cheia a qualquer momento pelo link no topo desta página.
          </div>
        </section>

        <section className="mt-6 rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-medium">Métricas registradas</h2>
          <ul className="mt-3 space-y-1 text-sm text-zinc-700">
            <li>Modo: <strong>{data!.mode}</strong></li>
            <li>Tempo de geração: <strong>{data!.generation_time_ms ?? "-"} ms</strong></li>
            <li>Acessibilidade (0–100): <strong>{data!.accessibility_score ?? "-"}</strong></li>
            <li>Criada em: <span className="text-zinc-500">{new Date(data!.created_at).toLocaleString()}</span></li>
          </ul>
        </section>

        <section className="mt-6 rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-medium">Feedback pós‑tarefa</h2>
          <p className="mb-2 mt-1 text-xs text-zinc-600">Preencha para a sessão #{data!.id}</p>
          <FeedbackForm sessionId={data!.id} />
        </section>

        <div className="mt-8 flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-700 underline">início</Link>
          <Link href={`/results?sessionId=${data!.id}&view=preview`} className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white">Ver preview</Link>
        </div>
      </div>
    </div>
  );
}


