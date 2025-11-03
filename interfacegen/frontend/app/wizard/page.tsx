"use client";
import Link from "next/link";
import { WizardForm } from "../../components/WizardForm";

export default function WizardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Modo: Wizard Guiado</h1>
          <Link href="/" className="text-sm text-zinc-700 underline">voltar</Link>
        </header>
        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm text-zinc-600">
            Responda às perguntas para compor o prompt final. Em seguida, gere a interface.
          </p>
          <WizardForm />
        </section>
      </div>
    </div>
  );
}


