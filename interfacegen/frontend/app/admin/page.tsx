"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, SessionDetails } from "../../lib/api";

export default function AdminPage() {
  const [sessions, setSessions] = useState<SessionDetails[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<number, SessionDetails | "loading" | "error">>({});

  useEffect(() => {
    fetch(api.exportJsonUrl())
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
      .then((d) => setSessions(d))
      .catch((e) => setError((e as Error).message));
  }, []);

  const toggleExpand = async (id: number) => {
    if (expanded[id]) {
      const copy = { ...expanded };
      delete copy[id];
      setExpanded(copy);
      return;
    }
    setExpanded((e) => ({ ...e, [id]: "loading" }));
    try {
      const details = await api.getSession(id);
      setExpanded((e) => ({ ...e, [id]: details }));
    } catch (e) {
      setExpanded((prev) => ({ ...prev, [id]: "error" }));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Painel do pesquisador</h1>
          <Link href="/" className="text-sm text-zinc-700 underline">início</Link>
        </header>

        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-medium">Exportações</h2>
          <div className="mt-3 flex gap-3">
            <a className="rounded-md bg-zinc-900 px-3 py-2 text-white" href={api.exportJsonUrl()} target="_blank">JSON</a>
            <a className="rounded-md bg-zinc-900 px-3 py-2 text-white" href={api.exportCsvUrl()} target="_blank">CSV</a>
          </div>
        </section>

        <section className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-medium">Execuções</h2>
          {error && <p className="text-red-700">{error}</p>}
          {!sessions && !error && <p className="text-sm text-zinc-600">Carregando...</p>}
          {sessions && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-zinc-700">
                    <th className="py-2">ID</th>
                    <th>Participante</th>
                    <th>Modo</th>
                    <th>Tempo (ms)</th>
                    <th>Acessibilidade</th>
                    <th>Criada</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <>
                      <tr key={s.id} className="border-b last:border-0">
                        <td className="py-2">{s.id}</td>
                        <td className="font-mono text-xs text-zinc-700">{s.participant_id}</td>
                        <td>{s.mode}</td>
                        <td>{s.generation_time_ms ?? "-"}</td>
                        <td>{s.accessibility_score ?? "-"}</td>
                        <td className="text-zinc-600">{new Date(s.created_at).toLocaleString()}</td>
                        <td>
                          <button className="rounded-md border px-2 py-1 text-xs" onClick={() => toggleExpand(s.id)}>
                            {expanded[s.id] ? "Fechar" : "Ver detalhes"}
                          </button>
                        </td>
                      </tr>
                      {expanded[s.id] && (
                        <tr className="bg-zinc-50">
                          <td colSpan={7} className="p-4">
                            {expanded[s.id] === "loading" && <div className="text-xs text-zinc-600">Carregando detalhes...</div>}
                            {expanded[s.id] === "error" && <div className="text-xs text-red-700">Falha ao carregar detalhes.</div>}
                            {typeof expanded[s.id] === "object" && (
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <div className="text-sm font-medium text-zinc-800">Prompt</div>
                                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-white p-3 text-xs text-zinc-800 border">{(expanded[s.id] as SessionDetails).prompt}</pre>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-zinc-800">Código (preview)</div>
                                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-white p-3 text-xs text-zinc-800 border">{((expanded[s.id] as SessionDetails).response_code || "").slice(0, 3000)}</pre>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-zinc-800">Métricas</div>
                                  <ul className="mt-2 space-y-1 text-xs text-zinc-700">
                                    <li>Tempo: {(expanded[s.id] as SessionDetails).generation_time_ms ?? "-"} ms</li>
                                    <li>Acessibilidade: {(expanded[s.id] as SessionDetails).accessibility_score ?? "-"}</li>
                                    <li>Criada: {new Date((expanded[s.id] as SessionDetails).created_at).toLocaleString()}</li>
                                  </ul>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-zinc-800">WCAG findings (JSON)</div>
                                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-white p-3 text-xs text-zinc-800 border">{JSON.stringify((expanded[s.id] as SessionDetails).wcag_findings, null, 2)}</pre>
                                </div>
                                <div className="md:col-span-2">
                                  <a className="text-xs text-blue-700 underline" href={`/results?sessionId=${(expanded[s.id] as SessionDetails).id}&view=preview`} target="_blank">Abrir preview em nova aba</a>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


