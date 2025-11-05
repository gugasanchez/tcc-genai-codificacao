export type StartMode = "direct" | "wizard";

export type CreateParticipantResponse = {
  id: string;
  start_mode: StartMode;
};

export type GenerateDirectRequest = {
  participant_id: string;
  mode: "direct";
  prompt: string;
};

export type GenerateWizardRequest = {
  participant_id: string;
  mode: "wizard";
  wizard_answers: Record<string, unknown>;
};

export type GenerateResponse = {
  session_id: number;
  code: string;
  metrics: unknown | null;
};

export type SessionDetails = {
  id: number;
  participant_id: string;
  mode: StartMode;
  prompt: string;
  response_code: string;
  generation_time_ms: number | null;
  pre_wizard_time_ms?: number | null;
  wizard_phase_time_ms?: number | null;
  accessibility_score: number | null;
  wcag_findings: unknown | null;
  created_at: string;
};

export type RunDetails = {
  run_id: string;
  direct_session: SessionDetails | null;
  wizard_session: SessionDetails | null;
};

export type FeedbackCreate = {
  session_id: number;
  answers: {
    usability: number[]; // length 5
    cognitive_load: number[]; // length 5
    perceived_quality: number[]; // length 5
  };
  comments?: string;
};

export type DraftRequest = {
  session_id?: number;
  participant_id?: string; // required on first turn
  run_id?: string; // required on first turn now
  turn_index: number;
  current_prompt: string;
  user_answer?: string;
};

export type DraftResponse = {
  session_id: number;
  ai_question: string;
  suggestions: string[];
  prompt_snapshot: string;
  ready: boolean;
  model: string;
  temperature: number;
  duration_ms: number;
};

export type FinalizeRequest = { session_id: number; wizard_phase_time_ms?: number };

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000/api";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  // Some endpoints may return empty bodies
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}

export async function createParticipant(): Promise<{ id: string }> {
  const res = await http<{ id: string; start_mode?: string }>(
    "/participants",
    { method: "POST" }
  );
  return { id: res.id };
}

export const api = {
  health: () => http<{ status: string }>("/health"),
  createParticipant: () =>
    http<CreateParticipantResponse>("/participants", { method: "POST" }),
  generate: (payload: GenerateDirectRequest | GenerateWizardRequest) =>
    http<GenerateResponse>("/sessions/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  draft: (payload: DraftRequest) =>
    http<DraftResponse>("/sessions/draft", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  startRun: (initial_prompt: string, pre_wizard_time_ms?: number) =>
    http<{ run_id: string; direct_session_id: number; code: string }>("/runs/start", {
      method: "POST",
      body: JSON.stringify({ initial_prompt, ...(typeof pre_wizard_time_ms === "number" ? { pre_wizard_time_ms } : {}) }),
    }),
  finalize: (payload: FinalizeRequest) =>
    http<GenerateResponse>("/sessions/final", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getRun: (runId: string) => http<RunDetails>(`/runs/${runId}`),
  getSession: (id: number) => http<SessionDetails>(`/sessions/${id}`),
  createFeedback: (payload: FeedbackCreate) =>
    http<{ ok: boolean }>("/feedback", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  exportJsonUrl: () => `${API_BASE}/export/json`,
  exportCsvUrl: () => `${API_BASE}/export/csv`,
};


