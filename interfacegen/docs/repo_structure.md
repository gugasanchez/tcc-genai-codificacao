interfacegen/
├─ README.md
├─ REPO_STRUCTURE.md
├─ .gitignore
├─ .env.example
├─ docker-compose.yml
│
├─ frontend/ # Next.js 15 + Tailwind + TypeScript
│ ├─ package.json
│ ├─ next.config.mjs
│ ├─ tailwind.config.ts
│ ├─ postcss.config.js
│ ├─ tsconfig.json
│ ├─ public/
│ │ └─ favicon.svg
│ └─ src/
│ ├─ app/
│ │ ├─ layout.tsx # layout principal
│ │ ├─ page.tsx # página inicial
│ │ ├─ direct/page.tsx # modo Prompt Direto
│ │ ├─ wizard/page.tsx # modo Wizard Guiado
│ │ ├─ results/page.tsx # preview e métricas
│ │ └─ admin/page.tsx # painel do pesquisador
│ ├─ components/
│ │ ├─ PromptInput.tsx # campo e botão do modo direto
│ │ ├─ WizardForm.tsx # sequência de perguntas
│ │ ├─ CodePreview.tsx # exibe HTML/CSS/JS gerado
│ │ ├─ FeedbackForm.tsx # coleta SUS/NASA-TLX
│ │ └─ Loader.tsx
│ ├─ lib/
│ │ ├─ api.ts # cliente REST → backend FastAPI
│ │ └─ utils.ts
│ ├─ data/
│ │ ├─ wizard_schema.json # perguntas do wizard
│ │ ├─ prompt_templates/
│ │ │ ├─ direct_base.md
│ │ │ └─ wizard_compose.md
│ │ └─ questionnaires/
│ │ ├─ sus.json
│ │ └─ nasa_tlx.json
│ └─ styles/
│ └─ globals.css
│
├─ backend/ # FastAPI + SQLAlchemy + PostgreSQL
│ ├─ requirements.txt
│ └─ app/
│ ├─ main.py # inicialização FastAPI
│ ├─ config.py # variáveis de ambiente
│ ├─ db/
│ │ ├─ models.py # Participant, Session, Feedback
│ │ └─ session.py
│ ├─ routers/
│ │ ├─ sessions.py # geração de interface (GPT-4o)
│ │ ├─ feedback.py # registro SUS/NASA-TLX
│ │ └─ export.py # export JSON/CSV
│ ├─ services/
│ │ ├─ llm_client.py # chamada GPT-4o
│ │ ├─ prompt_builder.py # composição de prompt wizard/direto
│ │ └─ audits_runner.py # executa Lighthouse e axe-core
│ └─ schemas/
│ ├─ session.py
│ └─ feedback.py
│
├─ audits/ # Auditoria automática (Node + TS)
│ ├─ package.json
│ └─ src/
│ ├─ axe_runner.ts # executa axe-core headless
│ ├─ lighthouse_runner.ts # roda Lighthouse CLI
│ └─ cli.ts # interface CLI → backend
│
└─ analysis/ # análise de dados (Python/Jupyter)
├─ notebooks/
│ ├─ 01_cleaning.ipynb
│ ├─ 02_stats.ipynb
│ └─ 03_visuals.ipynb
└─ data/
└─ exports/ # CSV/JSON exportados do backend
