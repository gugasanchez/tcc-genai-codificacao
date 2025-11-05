"use client";
import Link from "next/link";
import { PromptInput } from "../../components/PromptInput";
import { useEffect } from "react";
import * as api from "../../lib/api";
import { ensureParticipantId } from "../../lib/participant";

export default function DirectPage() {
  useEffect(() => {
    (async () => {
      try {
        await ensureParticipantId({ createParticipant: api.createParticipant });
      } catch (e) {
        // visible feedback and silent retry handled upstream in wizard; here we just surface
        // the failure to the user to attempt again via navigation or refresh
        alert((e as Error)?.message || "Falha ao inicializar participante.");
      }
    })();
  }, []);
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Modo: Prompt Direto</h1>
          <Link href="/" className="text-sm text-zinc-700 underline">voltar</Link>
        </header>
        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm text-zinc-600">
            Descreva a interface que deseja gerar. O sistema registrará a sessão e executará auditorias.
          </p>
          <PromptInput />
        </section>
      </div>
    </div>
  );
}


