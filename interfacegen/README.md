# InterfaceGen — MVP experimental

Plataforma para comparar dois modos de interação com LLMs (Prompt Direto vs. Wizard Guiado) na geração de UI web, com coleta de métricas de acessibilidade, tempo e consistência.

## Pastas

- `frontend/`: Next.js 15 + Tailwind + TypeScript
- `backend/`: FastAPI + SQLAlchemy + PostgreSQL

## Executando (visão geral)

1. Configure variáveis em `.env` (baseado em `.env.example`).
2. `docker compose up -d` para subir `db`, `backend`.
3. Rode o `frontend` localmente (`npm run dev`) ou adicione como serviço do compose.

Detalhes nos READMEs de cada pasta (a adicionar) e no `docs/` do repositório raiz.
