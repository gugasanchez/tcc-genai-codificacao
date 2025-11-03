"use client";
import { useCallback, useState } from "react";
import { api } from "../lib/api";
import { getParticipantId } from "../lib/storage";
import { useRouter } from "next/navigation";

export function PromptInput() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = useCallback(async () => {
    const participantId = getParticipantId();
    if (!participantId) {
      alert("Crie um participante na página inicial antes de continuar.");
      return;
    }
    if (!prompt.trim()) {
      alert("Digite um prompt.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.generate({
        participant_id: participantId,
        mode: "direct",
        prompt,
      });
      router.push(`/results?sessionId=${res.session_id}`);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [prompt, router]);

  return (
    <div className="space-y-3">
      <textarea
        className="h-40 w-full rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Descreva a interface desejada (ex.: landing page com menu, herói, formulário)..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="rounded-md bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Gerando..." : "Gerar Interface"}
      </button>
    </div>
  );
}


