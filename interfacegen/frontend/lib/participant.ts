const KEY = "interfacegen:participant_id";

export function getLocalParticipantId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setLocalParticipantId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, id);
}

export type CreateParticipantFn = () => Promise<{ id: string }>;

/**
 * Regras:
 * 1) Se existir ?participantId=... na URL, usar esse valor e SINCRONIZAR no localStorage.
 * 2) Senão, usar o que estiver no localStorage.
 * 3) Se nada existir, chamar POST /participants e salvar.
 * Retorna sempre um id válido.
 */
export async function ensureParticipantId(api: { createParticipant: CreateParticipantFn }): Promise<string> {
  if (typeof window === "undefined") return "";

  const url = new URL(window.location.href);
  const fromQuery = url.searchParams.get("participantId");
  if (fromQuery) {
    setLocalParticipantId(fromQuery);
    return fromQuery;
  }

  const fromLocal = getLocalParticipantId();
  if (fromLocal) return fromLocal;

  // Network creation with a single silent retry
  try {
    const p = await api.createParticipant();
    setLocalParticipantId(p.id);
    return p.id;
  } catch (err) {
    // retry once after a short delay
    await new Promise((r) => setTimeout(r, 800));
    const p2 = await api.createParticipant();
    setLocalParticipantId(p2.id);
    return p2.id;
  }
}


