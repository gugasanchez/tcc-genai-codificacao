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

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Resultados</h1>
          <Link href="/" className="text-sm text-zinc-700 underline">início</Link>
        </header>

        {!Number.isFinite(sessionId) && (
          <p className="text-red-700">Parâmetro sessionId inválido.</p>
        )}

        {!data && !error && <Loader label="Carregando sessão..." />}
        {error && <p className="text-red-700">{error}</p>}

        {data && (
          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-lg border bg-white p-4 shadow-sm">
              <h2 className="text-lg font-medium">Preview</h2>
              <div className="mt-3">
                <CodePreview code={data.response_code} />
              </div>
            </section>

            <section className="rounded-lg border bg-white p-4 shadow-sm">
              <h2 className="text-lg font-medium">Métricas</h2>
              <ul className="mt-3 space-y-1 text-sm text-zinc-700">
                <li>Modo: <strong>{data.mode}</strong></li>
                <li>Tempo de geração: <strong>{data.generation_time_ms ?? "-"} ms</strong></li>
                <li>Acessibilidade (0–100): <strong>{data.accessibility_score ?? "-"}</strong></li>
                <li>Criada em: <span className="text-zinc-500">{new Date(data.created_at).toLocaleString()}</span></li>
              </ul>
              <div className="mt-6">
                <h3 className="text-base font-medium">Feedback pós‑tarefa</h3>
                <p className="mb-2 mt-1 text-xs text-zinc-600">Preencha para a sessão #{data.id}</p>
                <FeedbackForm sessionId={data.id} />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}


