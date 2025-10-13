## TCC GenAI RAG

Comparar LLM puro vs LLM+RAG em tarefas de manutenção de código.

### Objetivo

- Avaliar impacto de RAG em tempo de execução e sucesso de testes.

### Como rodar

1. Criar o repositório e convenções (local):

```bash
mkdir tcc-genai-rag && cd tcc-genai-rag
git init -b main
```

2. Ambiente Python e deps:

```bash
python -m pip install --upgrade pip
make setup
```

3. Rodar testes:

```bash
make test
```

4. Construir índice RAG:

```bash
python rag/build_index.py --src-dir . --out-dir rag/store
```

5. Rodar experimentos:

```bash
python experiments/run_experiment.py --task-file experiments/tasks/task-001.yaml --mode puro
python experiments/run_experiment.py --task-file experiments/tasks/task-001.yaml --mode rag
```

6. Coletar métricas estáticas:

```bash
make metrics
```

### Adicionar novas tarefas

Crie novos YAMLs em `experiments/tasks/` e use os prompts em `experiments/prompts/`.
