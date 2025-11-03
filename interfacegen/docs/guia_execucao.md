## Guia de execução e uso – InterfaceGen (MVP)

Este guia explica como preparar o ambiente, executar os serviços (backend, banco e auditorias), rodar o frontend e utilizar o sistema para o experimento (Prompt Direto vs. Wizard Guiado).

### 1) Pré‑requisitos

- Docker e Docker Compose
- Node.js 18+ (apenas para rodar o frontend localmente)

### 2) Configuração de ambiente

1. Entre na pasta do monorepo:

```bash
cd interfacegen
```

2. Crie o arquivo de variáveis a partir do exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

- Campos relevantes:
  - `OPENAI_API_KEY` (opcional neste MVP; o gerador ainda está em modo stub)
  - `ALLOWED_ORIGINS=http://localhost:3000` (origem do frontend)
  - `AUDITS_TIMEOUT_SECONDS=10` (timeout da auditoria)

### 3) Subir serviços de infraestrutura (DB, Backend, Audits)

Na pasta `interfacegen/`:

```bash
docker compose up -d --build
```

- Serviços:
  - `db` (PostgreSQL)
  - `backend` (FastAPI em http://localhost:8000)
  - `audits` (compila `audits/dist/cli.js` usado pelo backend)

Verificar saúde do backend:

```bash
curl http://localhost:8000/api/health
```

Resposta esperada: `{ "status": "ok" }`

Logs (se precisar):

```bash
docker compose logs -f backend audits db
```

### 4) Rodar o frontend (Next.js)

Em outro terminal:

```bash
cd interfacegen/frontend
npm ci
npm run dev
```

Acesse `http://localhost:3000`.

Caso use um backend remoto, defina no frontend:

```bash
export NEXT_PUBLIC_API_BASE_URL="https://seu-backend/api"
```

### 5) Fluxo de uso (experimento)

1. Criar participante (atribui ordem balanceada direct/wizard):

```bash
curl -X POST http://localhost:8000/api/participants
```

Exemplo de resposta: `{"id":"<uuid>","start_mode":"direct"}`

2. Modo Prompt Direto (UI):

   - Acesse `http://localhost:3000/direct`, escreva o prompt e gere.
   - O sistema cria uma sessão via `POST /api/sessions/generate` e redireciona para `results?sessionId=...`.

3. Modo Wizard Guiado (UI):

   - Acesse `http://localhost:3000/wizard`, responda às perguntas e gere.
   - Redireciona para `results?sessionId=...`.

4. Resultados e métricas:

   - `http://localhost:3000/results?sessionId=<id>` exibe o código gerado (em sandbox) e métricas: tempo e `accessibility_score` (quando a auditoria concluir).

5. Feedback pós‑tarefa (SUS / NASA‑TLX):

   - Na página de resultados, preencha o formulário informando o `sessionId` correspondente.

6. Exportação e painel do pesquisador:
   - UI simples em `http://localhost:3000/admin` com links de export.
   - Endpoints diretos:

```bash
curl http://localhost:8000/api/export/json
curl http://localhost:8000/api/export/csv
```

### 6) Endpoints principais (REST)

- `POST /api/participants` → cria participante e define `start_mode` (balanceado)
- `POST /api/sessions/generate` → body:

```json
{
  "participant_id": "<uuid>",
  "mode": "direct" | "wizard",
  "prompt": "...",                // exigido em direct
  "wizard_answers": {"k":"v"}   // exigido em wizard
}
```

Resposta:

```json
{ "session_id": 1, "code": "...", "metrics": null }
```

- `GET /api/sessions/{id}` → retorna sessão com `response_code`, tempo e métricas
- `POST /api/feedback` → body:

```json
{ "session_id": 1, "sus_score": 80, "nasa_tlx_load": 35, "comments": "..." }
```

- `GET /api/export/json` e `GET /api/export/csv`
- `GET /api/health`

### 7) Auditorias de acessibilidade

- O backend executa `node /audits/dist/cli.js --stdin`, que roda axe‑core (via JSDOM) e calcula um score simples (0–100) por penalização de violações.
- Timeout padrão: `AUDITS_TIMEOUT_SECONDS=10`.
- Saída persistida em `Session.accessibility_score` e `Session.wcag_findings`.

### 8) Segurança e sandbox (frontend)

- O preview utiliza `iframe` com `sandbox="allow-scripts"` e CSP restritiva (sem rede externa, sem eval).
- Tamanho máximo do HTML retornado pelo LLM é limitado no backend (200k chars).

### 9) Testes (backend)

Rodar testes localmente (fora do container):

```bash
cd interfacegen/backend
pytest -q
```

Ou dentro do container do backend (nome pode variar):

```bash
docker compose exec backend pytest -q
```

### 10) Solução de problemas

- Porta em uso (8000/3000/5432): pare serviços em conflito ou altere mapeamentos no `docker-compose.yml`.
- CORS bloqueando o frontend: ajuste `ALLOWED_ORIGINS` no `.env` do backend.
- API base no frontend: defina `NEXT_PUBLIC_API_BASE_URL` se o backend não estiver em `localhost:8000`.
- Auditoria lenta: aumente ou reduza `AUDITS_TIMEOUT_SECONDS` no `.env`.
- Logs:

```bash
docker compose logs -f backend
docker compose logs -f audits
docker compose logs -f db
```

### 11) Encerrar serviços e limpar volumes

```bash
cd interfacegen
docker compose down -v
```
