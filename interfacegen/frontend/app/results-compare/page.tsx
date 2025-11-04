"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, RunDetails } from "../../lib/api";
import { CodePreview } from "../../components/CodePreview";
import { FeedbackForm } from "../../components/FeedbackForm";

export default function ResultsComparePage() {
  return (
    <Suspense fallback={<div className="p-6 text-zinc-700">Carregando...</div>}>
      <ResultsCompareContent />
    </Suspense>
  );
}

function ResultsCompareContent() {
  const params = useSearchParams();
  const runId = useMemo(() => params.get("runId") || "", [params]);
  const [data, setData] = useState<RunDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!runId) return;
    api
      .getRun(runId)
      .then((d) => {
        if (mounted) setData(d);
      })
      .catch((e) => setError((e as Error).message));
    return () => {
      mounted = false;
    };
  }, [runId]);

  if (!runId) {
    return <div className="p-6 text-red-700">Parâmetro runId inválido.</div>;
  }
  if (!data && !error) {
    return <div className="p-6 text-zinc-700">Carregando...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-700">{error}</div>;
  }

  const direct = data!.direct_session;
  const wizard = data!.wizard_session;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            Comparar resultados — Run {data!.run_id}
          </h1>
          <Link href="/" className="text-sm text-zinc-700 underline">
            Início
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">
                Prompt Direto {direct ? `#${direct.id}` : "(ainda não gerado)"}
              </h2>
              {direct && (
                <a
                  className="text-xs text-blue-700 underline"
                  href={`/results?sessionId=${direct.id}&view=preview&runId=${
                    data!.run_id
                  }`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir em tela cheia
                </a>
              )}
            </div>
            <div className="mt-2 text-xs text-zinc-600">
              Tempo: {direct?.generation_time_ms ?? "-"} ms · A11y:{" "}
              {direct?.accessibility_score ?? "-"}
            </div>
            {direct?.response_code ? (
              <div className="mt-3">
                <CodePreview
                  code={direct.response_code}
                  className="h-[70vh] w-full rounded-md border"
                />
              </div>
            ) : (
              <p className="mt-3 text-sm text-zinc-600">Aguardando geração.</p>
            )}
            {direct && (
              <div className="mt-4">
                <h3 className="text-sm font-medium">Feedback (Direto)</h3>
                <FeedbackForm sessionId={direct.id} />
              </div>
            )}
          </section>

          <section className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">
                Wizard {wizard ? `#${wizard.id}` : "(ainda não gerado)"}
              </h2>
              {wizard && (
                <a
                  className="text-xs text-blue-700 underline"
                  href={`/results?sessionId=${wizard.id}&view=preview&runId=${
                    data!.run_id
                  }`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir em tela cheia
                </a>
              )}
            </div>
            <div className="mt-2 text-xs text-zinc-600">
              Tempo: {wizard?.generation_time_ms ?? "-"} ms · A11y:{" "}
              {wizard?.accessibility_score ?? "-"}
            </div>
            {wizard?.response_code ? (
              <div className="mt-3">
                <CodePreview
                  code={wizard.response_code}
                  className="h-[70vh] w-full rounded-md border"
                />
              </div>
            ) : (
              <p className="mt-3 text-sm text-zinc-600">
                Aguardando geração do wizard.
              </p>
            )}
            {wizard && (
              <div className="mt-4">
                <h3 className="text-sm font-medium">Feedback (Wizard)</h3>
                <FeedbackForm sessionId={wizard.id} />
              </div>
            )}
          </section>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-700 underline">
            Início
          </Link>
          <div className="text-xs text-zinc-500">
            Comparação unificada desta run.
          </div>
        </div>
      </div>
    </div>
  );
}
