"use client";
import Link from "next/link";
import { PromptInput } from "../../components/PromptInput";

export default function DirectPage() {
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


