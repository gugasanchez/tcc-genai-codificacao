"use client";
import { useCallback, useState } from "react";
import { api } from "../lib/api";

type Props = {
  sessionId: number;
};

export function FeedbackForm({ sessionId }: Props) {
  const [sus, setSus] = useState<number>(70);
  const [load, setLoad] = useState<number>(35);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      setSubmitting(true);
      await api.createFeedback({
        session_id: sessionId,
        sus_score: sus,
        nasa_tlx_load: load,
        comments: comments || undefined,
      });
      setSubmitted(true);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }, [comments, load, sessionId, sus]);

  if (submitted) {
    return <p className="text-sm text-green-700">Feedback enviado. Obrigado!</p>;
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-zinc-800">SUS (0–100)</label>
        <input
          type="number"
          min={0}
          max={100}
          className="mt-1 w-40 rounded-md border p-2"
          value={sus}
          onChange={(e) => setSus(Number(e.target.value))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-800">NASA‑TLX (0–100)</label>
        <input
          type="number"
          min={0}
          max={100}
          className="mt-1 w-40 rounded-md border p-2"
          value={load}
          onChange={(e) => setLoad(Number(e.target.value))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-800">Comentários</label>
        <textarea
          className="mt-1 h-24 w-full rounded-md border p-2"
          placeholder="Observações sobre a tarefa"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>
      <button
        className="rounded-md bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Enviando..." : "Enviar feedback"}
      </button>
    </div>
  );
}


