"use client";
import { useSearchParams } from "next/navigation";

export default function ResultsMenuPage() {
  const params = useSearchParams();
  const directId = params.get("directId");
  const wizardId = params.get("wizardId");

  const openResult = (id: string | null) => {
    if (!id) return;
    const url = `/results?sessionId=${id}&view=preview`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-xl px-6 py-12">
        <h1 className="text-2xl font-semibold">Resultados do experimento</h1>
        <p className="mt-2 text-sm text-zinc-600">Escolha qual resultado deseja visualizar em nova aba. Cada preview possui botão para avaliação.</p>
        <div className="mt-6 grid gap-3">
          <button
            className="rounded-md bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
            onClick={() => openResult(directId)}
            disabled={!directId}
          >
            Abrir resultado – Prompt Direto
          </button>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            onClick={() => openResult(wizardId)}
            disabled={!wizardId}
          >
            Abrir resultado – Wizard Guiado
          </button>
        </div>
      </div>
    </div>
  );
}


