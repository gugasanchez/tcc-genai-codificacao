"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api, CreateParticipantResponse } from "../lib/api";
import {
  getParticipantId,
  setParticipantId,
  clearParticipantId,
} from "../lib/storage";

export default function Home() {
  const [creating, setCreating] = useState(false);
  const [participant, setParticipant] =
    useState<CreateParticipantResponse | null>(null);
  const storedId = useMemo(() => getParticipantId(), []);

  useEffect(() => {
    // No auto-create; allow explicit creation for controlled experiments
  }, []);

  const handleCreate = useCallback(async () => {
    try {
      setCreating(true);
      const p = await api.createParticipant();
      setParticipantId(p.id);
      setParticipant(p);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setCreating(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    clearParticipantId();
    setParticipant(null);
  }, []);

  const currentId = participant?.id || storedId || null;
  const recommended = participant?.start_mode || null;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold">InterfaceGen</h1>
          <p className="mt-2 text-zinc-600">
            Experimento: Prompt Direto vs. Wizard Guiado
          </p>
        </header>

        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-medium">1) Participante</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Crie um participante para iniciar. A ordem recomendada é atribuída
            automaticamente.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? "Criando..." : "Criar participante"}
            </button>
            {currentId && (
              <span className="text-sm text-zinc-700">ID: {currentId}</span>
            )}
            {currentId && (
              <button
                className="ml-auto text-sm text-red-600"
                onClick={handleReset}
              >
                limpar
              </button>
            )}
          </div>
          {recommended && (
            <p className="mt-2 text-sm text-zinc-700">
              Modo inicial recomendado: <strong>{recommended}</strong>
            </p>
          )}
        </section>

        <section className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-medium">2) Selecionar modo</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Escolha um modo para iniciar a tarefa.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href="/direct"
              className={`rounded-md px-4 py-2 text-white ${
                recommended === "direct" ? "bg-blue-600" : "bg-zinc-900"
              }`}
              prefetch
            >
              Prompt Direto
            </Link>
            <Link
              href="/wizard"
              className={`rounded-md px-4 py-2 text-white ${
                recommended === "wizard" ? "bg-blue-600" : "bg-zinc-900"
              }`}
              prefetch
            >
              Wizard Guiado
            </Link>
          </div>
          {!currentId && (
            <p className="mt-3 text-sm text-amber-700">
              Dica: crie um participante para registrar a sessão.
            </p>
          )}
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
