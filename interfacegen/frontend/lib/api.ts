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
  accessibility_score: number | null;
  wcag_findings: unknown | null;
  created_at: string;
};

export type FeedbackCreate = {
  session_id: number;
  sus_score: number;
  nasa_tlx_load: number;
  comments?: string;
};

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

export const api = {
  health: () => http<{ status: string }>("/health"),
  createParticipant: () =>
    http<CreateParticipantResponse>("/participants", { method: "POST" }),
  generate: (payload: GenerateDirectRequest | GenerateWizardRequest) =>
    http<GenerateResponse>("/sessions/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getSession: (id: number) => http<SessionDetails>(`/sessions/${id}`),
  createFeedback: (payload: FeedbackCreate) =>
    http<{ ok: boolean }>("/feedback", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  exportJsonUrl: () => `${API_BASE}/export/json`,
  exportCsvUrl: () => `${API_BASE}/export/csv`,
};


