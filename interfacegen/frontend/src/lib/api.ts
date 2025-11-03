const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

export async function generateDirect({ participantId, prompt }: { participantId: string; prompt: string }) {
  const res = await fetch(`${BASE_URL}/sessions/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participant_id: participantId, mode: 'direct', prompt })
  })
  if (!res.ok) throw new Error('Falha ao gerar interface')
  return res.json()
}

export async function generateWizard({ participantId, answers }: { participantId: string; answers: Record<string, string> }) {
  const res = await fetch(`${BASE_URL}/sessions/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participant_id: participantId, mode: 'wizard', wizard_answers: answers })
  })
  if (!res.ok) throw new Error('Falha ao gerar interface')
  return res.json()
}

export async function getSession(sessionId: number) {
  const res = await fetch(`${BASE_URL}/sessions/${sessionId}`)
  if (!res.ok) throw new Error('Sessão não encontrada')
  return res.json()
}


