"use client";
import { useCallback, useMemo, useState } from "react";
import { api } from "../lib/api";

type Props = {
  sessionId: number;
};

export function FeedbackForm({ sessionId }: Props) {
  type Maybe = number | null;
  const [u, setU] = useState<Maybe[]>([null, null, null, null, null]);
  const [c, setC] = useState<Maybe[]>([null, null, null, null, null]);
  const [q, setQ] = useState<Maybe[]>([null, null, null, null, null]);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const usabilityQs = useMemo(
    () => [
      "O sistema foi fácil de entender e utilizar.",
      "As etapas neste processo foram bem organizadas.",
      "Eu me senti confiante durante a interação com a IA.",
      "O sistema respondeu de forma rápida e previsível.",
      "No geral, eu fiquei satisfeito com a experiência de uso.",
    ],
    []
  );
  const cognitiveQs = useMemo(
    () => [
      "Eu precisei me engajar mentalmente para concluir a tarefa.",
      "Eu consegui entender facilmente o que a IA iria desenvolver.",
      "As informações apresentadas foram fáceis de processar e não me sobrecarregaram.",
      "Eu mantive boa concentração e foco durante todo o processo.",
      "Senti que estava tranquilo(a) e focado(a) durante a execução da tarefa.",
    ],
    []
  );
  const qualityQs = useMemo(
    () => [
      "A interface gerada atendeu ao que eu esperava em termos aparência e funcionalidade.",
      "O resultado foi visualmentebem estruturado e de fácil leitura.",
      "O design da interface foi coerente com a descrição do(s) prompt(s).",
      "A interface apresentou boa legibilidade, contraste e organização dos elementos.",
      "Eu consideraria usar essa interface como base em um projeto real.",
    ],
    []
  );

  const allAnswered = useMemo(
    () => u.every(Boolean) && c.every(Boolean) && q.every(Boolean),
    [u, c, q]
  );

  const uSum = useMemo(
    () =>
      u.every(Boolean) ? (u as number[]).reduce((a, b) => a + b, 0) : null,
    [u]
  );
  const cSum = useMemo(
    () =>
      c.every(Boolean) ? (c as number[]).reduce((a, b) => a + b, 0) : null,
    [c]
  );
  const qSum = useMemo(
    () =>
      q.every(Boolean) ? (q as number[]).reduce((a, b) => a + b, 0) : null,
    [q]
  );

  const handleSubmit = useCallback(async () => {
    if (!allAnswered) return;
    try {
      setSubmitting(true);
      await api.createFeedback({
        session_id: sessionId,
        answers: {
          usability: u as number[],
          cognitive_load: c as number[],
          perceived_quality: q as number[],
        },
        comments: comments || undefined,
      });
      setSubmitted(true);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }, [allAnswered, c, comments, q, sessionId, u]);

  if (submitted) {
    return (
      <p className="text-sm text-green-700">Feedback enviado. Obrigado!</p>
    );
  }

  const LikertRow = ({
    label,
    group,
    idx,
    value,
    onChange,
  }: {
    label: string;
    group: "u" | "c" | "q";
    idx: number;
    value: Maybe;
    onChange: (val: number) => void;
  }) => (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex-1 pr-3 text-sm text-zinc-800">{label}</div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className="flex cursor-pointer items-center justify-center rounded-md border px-2 py-1 text-xs hover:bg-zinc-50"
          >
            <input
              type="radio"
              name={`${sessionId}-${group}-${idx}`}
              className="mr-1"
              checked={value === n}
              onChange={() => onChange(n)}
            />
            {n}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium">Usabilidade</h4>
          <div className="text-xs text-zinc-600">
            Soma (5–25): {uSum ?? "-"}
          </div>
        </div>
        <div className="divide-y">
          {usabilityQs.map((qLabel, i) => (
            <LikertRow
              key={i}
              label={qLabel}
              group="u"
              idx={i}
              value={u[i]}
              onChange={(val) => {
                const next = [...u];
                next[i] = val;
                setU(next);
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium">
            Carga Cognitiva (NASA‑TLX simplificado)
          </h4>
          <div className="text-xs text-zinc-600">
            Soma (5–25): {cSum ?? "-"}
          </div>
        </div>
        <div className="divide-y">
          {cognitiveQs.map((qLabel, i) => (
            <LikertRow
              key={i}
              label={qLabel}
              group="c"
              idx={i}
              value={c[i]}
              onChange={(val) => {
                const next = [...c];
                next[i] = val;
                setC(next);
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium">Qualidade Percebida do Código</h4>
          <div className="text-xs text-zinc-600">
            Soma (5–25): {qSum ?? "-"}
          </div>
        </div>
        <div className="divide-y">
          {qualityQs.map((qLabel, i) => (
            <LikertRow
              key={i}
              label={qLabel}
              group="q"
              idx={i}
              value={q[i]}
              onChange={(val) => {
                const next = [...q];
                next[i] = val;
                setQ(next);
              }}
            />
          ))}
        </div>
      </section>

      <div>
        <label className="block text-sm font-medium text-zinc-800">
          Comentários
        </label>
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
        disabled={submitting || !allAnswered}
      >
        {submitting ? "Enviando..." : "Enviar feedback"}
      </button>
    </div>
  );
}
