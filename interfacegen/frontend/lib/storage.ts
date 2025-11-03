const PARTICIPANT_KEY = "interfacegen:participantId";

export function getParticipantId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(PARTICIPANT_KEY);
  } catch {
    return null;
  }
}

export function setParticipantId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PARTICIPANT_KEY, id);
  } catch {
    // ignore
  }
}

export function clearParticipantId(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PARTICIPANT_KEY);
  } catch {
    // ignore
  }
}


