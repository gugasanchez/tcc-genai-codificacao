"use client";
import schema from "@/data/wizard_schema.json";
import { useState } from "react";
import { generateWizard } from "@/lib/api";
import { useRouter } from "next/navigation";

type Answers = Record<string, string>;

export default function WizardPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function onGenerate() {
    setLoading(true);
    try {
      const res = await generateWizard({
        participantId: "demo-participant",
        answers,
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
      <h1 className="text-xl font-semibold">Wizard Guiado</h1>
      <div className="space-y-3">
        {schema.questions.map((q) => (
          <div key={q.id} className="space-y-1">
            <label className="block text-sm font-medium">{q.label}</label>
            <input
              className="w-full p-2 border rounded"
              value={answers[q.id] || ""}
              onChange={(e) => setAnswer(q.id, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button
        onClick={onGenerate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Gerando..." : "Gerar Interface"}
      </button>
    </main>
  );
}
