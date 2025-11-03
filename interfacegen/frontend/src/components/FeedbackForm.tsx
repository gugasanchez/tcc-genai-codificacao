"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export default function FeedbackForm() {
  const [sessionId, setSessionId] = useState("");
  const [sus, setSus] = useState<number | "">("");
  const [tlx, setTlx] = useState<number | "">("");
  const [comments, setComments] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null);
    const res = await fetch(`${API}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: Number(sessionId),
        sus_score: sus === "" ? null : sus,
        nasa_tlx_load: tlx === "" ? null : tlx,
        comments,
      }),
    });
    setOk(res.ok);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">ID da sessão</label>
        <input
          className="w-full p-2 border rounded"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">SUS (0–100)</label>
          <input
            type="number"
            min={0}
            max={100}
            className="w-full p-2 border rounded"
            value={sus}
            onChange={(e) =>
              setSus(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium">NASA-TLX (0–100)</label>
          <input
            type="number"
            min={0}
            max={100}
            className="w-full p-2 border rounded"
            value={tlx}
            onChange={(e) =>
              setTlx(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Comentários</label>
        <textarea
          className="w-full p-2 border rounded"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>
      <button className="px-4 py-2 bg-gray-900 text-white rounded">
        Enviar feedback
      </button>
      {ok !== null && (
        <p className={ok ? "text-green-600" : "text-red-600"}>
          {ok ? "Enviado" : "Falha ao enviar"}
        </p>
      )}
    </form>
  );
}
