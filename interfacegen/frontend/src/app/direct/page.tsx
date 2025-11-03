"use client";
import { useState } from "react";
import { generateDirect } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DirectPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onGenerate() {
    setLoading(true);
    try {
      const res = await generateDirect({
        participantId: "demo-participant",
        prompt,
      });
      if (res.session_id) {
        router.push(`/results?sessionId=${res.session_id}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-xl font-semibold">Prompt Direto</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-40 p-2 border rounded"
        placeholder="Descreva a interface desejada"
      />
      <button
        onClick={onGenerate}
        disabled={loading || !prompt}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Gerando..." : "Gerar Interface"}
      </button>
    </main>
  );
}
