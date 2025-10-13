Projeto: `tcc-genai-rag`

Diretórios chave:

- `app/`: API FastAPI e regras de negócio centralizadas em `app/core/`.
- `rag/`: build e consulta do índice local FAISS + sentence-transformers.
- `experiments/`: orquestrador de execuções (LLM puro vs RAG) e prompts/tarefas.
- `evaluate/`: coleta de métricas estáticas de qualidade/segurança/complexidade.
- `data/`: logs/resultados versionados.

tcc-genai-rag/
├─ app/ # código da aplicação (FastAPI exemplo)
│ ├─ **init**.py
│ ├─ main.py
│ └─ core/
│ └─ logic.py
├─ tests/ # testes (unidade/integrado)
│ ├─ **init**.py
│ └─ test_logic.py
├─ rag/ # infraestrutura RAG
│ ├─ build_index.py
│ ├─ retrieve.py
│ └─ store/ # índices (git-ignored)
├─ experiments/ # orquestração dos experimentos
│ ├─ run_experiment.py
│ ├─ prompts/
│ │ ├─ system_puro.txt
│ │ ├─ system_rag.txt
│ │ └─ task_template.txt
│ └─ tasks/ # specs das tarefas
│ ├─ task-001.yaml
│ └─ task-002.yaml
├─ evaluate/ # coleta e cálculo de métricas
│ ├─ collect_metrics.py
│ └─ rubric_clareza.md
├─ scripts/ # utilitários
│ ├─ run_tests.sh
│ └─ lint_static.sh
├─ data/ # artefatos de execução (logs, jsonl)
│ ├─ logs/
│ └─ results/
├─ .github/workflows/ci.yml
├─ .gitignore
├─ pyproject.toml
├─ README.md
└─ Makefile
