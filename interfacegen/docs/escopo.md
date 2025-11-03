# Escopo do Experimento

## 1. Contextualização

Com base nos fundamentos de Engenharia de Contexto, Engenharia de Prompt, RAG e Interação Humano–IA, o experimento avalia o impacto do grau de estruturação da interação na geração de código front-end por LLMs.

A hipótese central: o modo Wizard Guiado (perguntas estruturadas derivadas de Engenharia de Requisitos) melhora a consistência e a acessibilidade das interfaces, em relação ao Prompt Direto (instruções livres).

A implementação ocorre no InterfaceGen (MVP web que integra um LLM para gerar HTML/CSS/JS/React).

---

## 2. Objetivos Experimentais

### Objetivo Geral

Avaliar o efeito do tipo de interação (Prompt Direto vs. Wizard Guiado) na qualidade, acessibilidade e consistência das interfaces web geradas.

### Objetivos Específicos

1. Quantificar diferenças de tempo, completude e acessibilidade entre os modos.
2. Avaliar conformidade WCAG 2.1 e HTML semântico.
3. Medir usabilidade percebida e clareza do fluxo pelos usuários.
4. Mapear limitações e oportunidades do prompting guiado para futura integração com RAG e MCP.

---

## 3. Hipóteses

ID Hipótese Tipo
H1 Wizard Guiado gera maior conformidade WCAG 2.1 que Prompt Direto. Principal
H2 Wizard Guiado reduz a variabilidade semântica entre execuções (maior consistência estrutural). Complementar
H3 Prompt Direto aumenta a diversidade criativa, porém com mais falhas de acessibilidade e inconsistências visuais. Exploratória
H4 Wizard Guiado aumenta tempo inicial, mas reduz retrabalho e ambiguidade percebida. Operacional

---

## 4. Delineamento Experimental

Tipo: comparativo, intra-sujeitos (cada participante usa ambos os modos).
Desenho: quase-experimental controlado.
Natureza: exploratória–quantitativa com suporte qualitativo.

Amostra
• Participantes: 8–12 (alunos de Eng. Computação e devs juniores).
• Inclusão: noções básicas de HTML/CSS.
• Exclusão: expertise avançada em frameworks front-end.

Tarefas
• T1: Landing page com menu e formulário de contato — Prompt Direto.
• T2: Mesma interface — Wizard Guiado (perguntas progressivas).
• Execução no InterfaceGen (registra tempo, prompts, outputs).

---

## 5. Variáveis

### 5.1 Independente

• Modo de Interação ∈ {Prompt Direto, Wizard Guiado}

### 5.2 Dependentes

Categoria Variável Descrição Métrica

Qualidade técnica Conformidade WCAG Aderência a WCAG 2.1 Score via Lighthouse / axe-core

Acessibilidade estrutural Semântica/ARIA Uso correto de alt/label/role Checklist + auditor automatizado

Consistência Coerência estrutural Similaridade de DOM/CSS entre execuções Edit distance / similaridade (%)

Eficiência Tempo de geração Início do prompt → código funcional Segundos (média/mediana)

Usabilidade Percepção Clareza, esforço, satisfação SUS + NASA-TLX (Likert)

Criatividade Variedade Diversidade estética/estrutural Avaliação humana (Likert)

---

## 6. Ferramentas e Ambiente

- LLM: GPT-4o (temperatura 0.7; versão e parâmetros documentados).
- Sistema: InterfaceGen (Frontend React/Tailwind; Backend Python FastAPI).
- Acessibilidade: Lighthouse CLI, axe-core.
- Dados/Logs: PostgreSQL (prompts, tempos, versões).
- Análise: Python (pandas/scipy), Jupyter/planilhas.

---

## 7. Procedimento

1.  Consentimento e instruções (5 min).
2.  Treinamento rápido no InterfaceGen (5 min).
3.  Tarefa 1 — Prompt Direto (ou Wizard, ordem alternada/contra-balanceada).
4.  Tarefa 2 — Wizard Guiado (ou Direto).
5.  Coleta automática: tempo, logs, auditorias de acessibilidade.
6.  Questionários: SUS + NASA-TLX (curto).
7.  Encerramento e comentários qualitativos.

Contra-balanceamento de ordem: alocar metade dos participantes começando por Prompt Direto e metade por Wizard para mitigar efeitos de aprendizado/fadiga.

---

## 8. Análise dos Dados

### 8.1 Quantitativa

- Comparações (pareadas):
  - Tempo, WCAG score, itens ARIA: t-test pareado (ou Wilcoxon se não normal).
- Consistência estrutural:
  - Similaridade de DOM/CSS (edit distance): ANOVA unifatorial ou teste pareado conforme distribuição.
- Correlação:
  - Tempo × WCAG × SUS (Pearson/Spearman).
- Visualizações: boxplots, heatmap de similaridade, radar comparativo.

### 8.2 Qualitativa

- Análise temática de comentários e respostas abertas (clareza, controle, colaboração com IA).
- Triangulação com métricas quantitativas.

---

## 9. Validação e Reprodutibilidade

- Versionamento de todos os prompts e códigos (Git).
- Logs completos (timestamps, parâmetros do LLM, auditorias).
- Scripts de análise publicados (apêndice técnico).
- Reexecução padronizada de Lighthouse/axe-core.
- Relato explícito de versão do modelo, temperatura, context window e políticas do InterfaceGen.

---

## 10. Limitações

1.  Amostra pequena (poder estatístico limitado).
2.  Um único LLM no recorte principal.
3.  Auditorias automatizadas não capturam todas as nuances humanas.
4.  Foco em UI estática (menos cobertura de acessibilidade dinâmica/ARIA avançado).

---

## 11. Resultados Esperados

- Wizard com melhor WCAG e maior previsibilidade (H1, H2).
- Trade-off: mais tempo inicial e menor diversidade criativa (H3, H4).
- Diretrizes práticas de prompting estruturado para geração de UI.
