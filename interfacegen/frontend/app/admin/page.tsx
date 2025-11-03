"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, SessionDetails } from "../../lib/api";

export default function AdminPage() {
  const [sessions, setSessions] = useState<SessionDetails[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(api.exportJsonUrl())
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
      .then((d) => setSessions(d))
      .catch((e) => setError((e as Error).message));
  }, []);

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
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="py-2">{s.id}</td>
                      <td className="font-mono text-xs text-zinc-700">{s.participant_id}</td>
                      <td>{s.mode}</td>
                      <td>{s.generation_time_ms ?? "-"}</td>
                      <td>{s.accessibility_score ?? "-"}</td>
                      <td className="text-zinc-600">{new Date(s.created_at).toLocaleString()}</td>
                    </tr>
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


