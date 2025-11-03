"use client";
import { useCallback, useState } from "react";
import { api } from "../lib/api";
import { getParticipantId } from "../lib/storage";
import { useRouter } from "next/navigation";

type Answers = {
  page_type: string;
  main_elements: string;
  audience: string;
  visual_style: string;
  accessibility: string;
};

const initial: Answers = {
  page_type: "landing page",
  main_elements: "menu, seção herói, seção features, formulário de contato",
  audience: "público geral",
  visual_style: "limpo, responsivo, contraste alto",
  accessibility: "alt em imagens, labels em inputs, navegação por teclado",
};

export function WizardForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initial);
  const [loading, setLoading] = useState(false);

  const questions: { key: keyof Answers; label: string; placeholder: string }[] = [
    { key: "page_type", label: "1) Tipo de página", placeholder: "landing page, blog, portfólio..." },
    { key: "main_elements", label: "2) Elementos principais", placeholder: "menu, imagens, formulário..." },
    { key: "audience", label: "3) Público-alvo", placeholder: "ex.: iniciantes, empresas B2B..." },
    { key: "visual_style", label: "4) Estilo visual", placeholder: "ex.: minimalista, material, dark..." },
    { key: "accessibility", label: "5) Restrições de acessibilidade", placeholder: "alt/label/role, contraste..." },
  ];

  const composePrompt = (): string => {
    return `Gere HTML/CSS/JS para uma ${answers.page_type} com ${answers.main_elements}. Público-alvo: ${answers.audience}. Estilo: ${answers.visual_style}. Requisitos de acessibilidade: ${answers.accessibility}. Use HTML semântico, ARIA quando apropriado e responsividade.`;
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, questions.length - 1));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 0));

  const handleGenerate = useCallback(async () => {
    const participantId = getParticipantId();
    if (!participantId) {
      alert("Crie um participante na página inicial antes de continuar.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.generate({
        participant_id: participantId,
        mode: "wizard",
        wizard_answers: { ...answers, composed_prompt: composePrompt() },
      });
      router.push(`/results?sessionId=${res.session_id}`);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [answers, router]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4">
        <label className="block text-sm font-medium text-zinc-800">
          {questions[step].label}
        </label>
        <input
          className="mt-2 w-full rounded-md border p-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={questions[step].placeholder}
          value={answers[questions[step].key]}
          onChange={(e) =>
            setAnswers((a) => ({ ...a, [questions[step].key]: e.target.value }))
          }
        />
        <div className="mt-3 flex items-center justify-between">
          <button
            className="rounded-md px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
            onClick={handlePrev}
            disabled={step === 0}
          >
            Voltar
          </button>
          <span className="text-xs text-zinc-500">Etapa {step + 1} / {questions.length}</span>
          <button
            className="rounded-md px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
            onClick={handleNext}
            disabled={step === questions.length - 1}
          >
            Avançar
          </button>
        </div>
      </div>

      <div className="rounded-md border p-4">
        <div className="text-sm font-medium text-zinc-800">Preview do prompt</div>
        <pre className="mt-2 whitespace-pre-wrap rounded bg-zinc-50 p-3 text-sm text-zinc-800">{composePrompt()}</pre>
      </div>

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


