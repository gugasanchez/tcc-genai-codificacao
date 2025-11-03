import FeedbackForm from "@/components/FeedbackForm";
import CodePreview from "@/components/CodePreview";
import { getSession } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultsPage() {
  const params = useSearchParams();
  const sessionId = Number(params.get("sessionId"));
  const [session, setSession] = useState<any | null>(null);

  useEffect(() => {
    if (!Number.isFinite(sessionId)) return;
    getSession(sessionId)
      .then(setSession)
      .catch(() => setSession(null));
  }, [sessionId]);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Resultados</h1>
        <p className="text-gray-600">
          Sessão: {Number.isFinite(sessionId) ? sessionId : "—"}
        </p>
      </header>

      {session?.response_code && (
        <section className="border rounded overflow-hidden">
          <CodePreview code={session.response_code} />
        </section>
      )}

      <section className="space-y-2">
        <h2 className="font-semibold">Métricas</h2>
        <div className="rounded border p-4 bg-white">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Tempo de geração (ms)</div>
              <div className="font-medium">
                {session?.generation_time_ms ?? "—"}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Acessibilidade (score)</div>
              <div className="font-medium">
                {session?.accessibility_score ?? "—"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Feedback</h2>
        <FeedbackForm />
      </section>
    </main>
  );
}
