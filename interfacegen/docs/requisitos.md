# Documento de Requisitos do Software – InterfaceGen

## 1. Introdução

### 1.1 Propósito do Documento

Este documento define os requisitos funcionais e não funcionais do sistema InterfaceGen, desenvolvido para o experimento do TCC “Uso de Modelos Generativos para Codificação: Um Estudo de Caso com Engenharia de Contexto, RAG e MCP”.

O sistema servirá como plataforma experimental para comparar dois modos de interação com modelos de linguagem (LLMs):

- Prompt Direto: entrada livre de instruções textuais.
- Wizard Guiado: entrada estruturada em etapas, baseada em Engenharia de Requisitos.

O documento descreve o escopo, funcionalidades, interfaces, restrições e critérios de aceitação, garantindo que o software atenda integralmente às necessidades do experimento.

---

## 2. Escopo do Sistema

O InterfaceGen é um sistema web full-stack que permite a geração automatizada de código front-end (HTML, CSS, React/JS) a partir de descrições em linguagem natural fornecidas por usuários.

Seu objetivo é registrar, processar e comparar resultados obtidos por dois modos de interação com o modelo generativo (LLM), permitindo mensurar qualidade, acessibilidade e consistência do código produzido.

### 2.1 Funções Principais

- Oferecer duas modalidades de interação (Prompt Direto e Wizard Guiado).
- Enviar prompts para o modelo GPT-4o via API e receber o código gerado.
- Renderizar visualmente o resultado em um sandbox integrado.
- Executar auditoria automática de acessibilidade (Lighthouse/axe-core).
- Registrar tempo de geração, logs, respostas, e metadados.
- Disponibilizar painel administrativo para exportação e análise dos dados.

### 2.2 Escopo Experimental

O sistema será utilizado exclusivamente no contexto do experimento acadêmico descrito no TCC.

Participantes (8–12) realizarão tarefas controladas para geração de uma landing page simples em ambos os modos.

---

## 3. Definições, Acrônimos e Abreviações

| Sigla    | Significado                           |
| -------- | ------------------------------------- |
| LLM      | Large Language Model                  |
| RAG      | Retrieval-Augmented Generation        |
| MCP      | Model Context Protocol                |
| UI       | User Interface                        |
| WCAG     | Web Content Accessibility Guidelines  |
| ARIA     | Accessible Rich Internet Applications |
| SUS      | System Usability Scale                |
| NASA-TLX | NASA Task Load Index                  |

---

## 4. Visão Geral do Sistema

### 4.1 Arquitetura Geral

O sistema será composto por três camadas:

1. Frontend (React + TailwindCSS)
   - Interface do participante e painel do pesquisador.
   - Módulos separados para Prompt Direto e Wizard Guiado.
   - Visualização e renderização do código gerado em iframe sandbox.
2. Backend (FastAPI – Python)
   - Controlador de requisições, autenticação e persistência.
   - Integração com a API do GPT-4o.
   - Execução de rotinas de auditoria de acessibilidade (Lighthouse/axe-core CLI).
   - Registro de logs e metadados experimentais.
3. Banco de Dados (PostgreSQL)
   - Armazena prompts, respostas, tempos, métricas e resultados de auditoria.

---

## 5. Requisitos Funcionais

| ID   | Requisito                                  | Descrição                                                                                                                                           | Prioridade |
| ---- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| RF01 | **Gerar interface via Prompt Direto**      | O usuário deve poder inserir um comando textual livre e receber um código front-end gerado pelo modelo.                                             | Alta       |
| RF02 | **Gerar interface via Wizard Guiado**      | O sistema deve apresentar perguntas sequenciais (requisitos funcionais, estrutura, estilo, acessibilidade) e compor o prompt final automaticamente. | Alta       |
| RF03 | **Renderizar o código gerado**             | O sistema deve renderizar o HTML/CSS/JS gerado dentro de um _sandbox_ seguro.                                                                       | Alta       |
| RF04 | **Registrar tempo de geração**             | O sistema deve registrar o tempo entre o início da interação e a resposta final.                                                                    | Alta       |
| RF05 | **Auditar acessibilidade automaticamente** | Após a geração, o sistema deve rodar auditoria via Lighthouse e axe-core, armazenando o score WCAG.                                                 | Alta       |
| RF06 | **Salvar logs completos**                  | Deve registrar prompt, resposta, modo de interação, tempo, participante e versão do modelo.                                                         | Alta       |
| RF07 | **Exportar dados do experimento**          | O pesquisador deve poder exportar os resultados em formato CSV/JSON.                                                                                | Alta       |
| RF08 | **Autenticação simples de participantes**  | O sistema deve permitir a criação de sessões identificáveis por ID de participante (sem login complexo).                                            | Média      |
| RF09 | **Visualizar histórico de interações**     | O pesquisador deve acessar o histórico de execuções com tempo e métricas associadas.                                                                | Média      |
| RF10 | **Formulário de feedback pós-tarefa**      | Ao final de cada tarefa, o sistema deve coletar respostas dos questionários SUS e NASA-TLX.                                                         | Média      |
| RF11 | **Controle de ordem experimental**         | O sistema deve atribuir automaticamente o modo inicial (Prompt Direto ou Wizard) de forma balanceada.                                               | Média      |
| RF12 | **Painel administrativo**                  | Interface para visualização e filtragem de dados (modo, tempo, métricas, participante).                                                             | Baixa      |

---

## 6. Requisitos Não Funcionais

| ID    | Categoria             | Descrição                                                                          | Nível |
| ----- | --------------------- | ---------------------------------------------------------------------------------- | ----- |
| RNF01 | **Desempenho**        | Geração e renderização devem ocorrer em até 15 segundos médios.                    | Alta  |
| RNF02 | **Segurança**         | Código gerado deve ser executado em _sandbox_ isolado (sem acesso a rede externa). | Alta  |
| RNF03 | **Persistência**      | Todos os dados experimentais devem ser armazenados de forma transacional e segura. | Alta  |
| RNF04 | **Auditabilidade**    | Todos os registros devem conter timestamp, modo e hash de conteúdo.                | Alta  |
| RNF05 | **Usabilidade**       | Interface minimalista, responsiva e com clareza textual (Tailwind UI).             | Média |
| RNF06 | **Compatibilidade**   | Suporte aos navegadores Chromium-based (Chrome, Edge, Brave).                      | Média |
| RNF07 | **Escalabilidade**    | Suporte a 15 sessões simultâneas para experimentos.                                | Baixa |
| RNF08 | **Confiabilidade**    | Registro automático de falhas e exceções no backend.                               | Alta  |
| RNF09 | **Reprodutibilidade** | Cada execução deve poder ser reconstituída a partir dos logs completos.            | Alta  |
| RNF10 | **Portabilidade**     | O sistema deve rodar em ambiente local (localhost) e servidor remoto (Railway).    | Média |

---

## 7. Requisitos de Interface

### 7.1 Interface do Participante

- Tela Inicial
  - Seleção de modo experimental (Prompt Direto ou Wizard Guiado).
  - Exibição de instruções breves e botão “Iniciar”.
- Prompt Direto
  - Campo de texto livre.
  - Botão “Gerar Interface”.
  - Exibição do código e renderização.
- Wizard Guiado
  - Série de perguntas estruturadas:
    1.  Tipo de página
    2.  Elementos principais (menu, formulário, imagens)
    3.  Público-alvo
    4.  Estilo visual desejado
    5.  Restrições de acessibilidade
  - Preview final do prompt composto.
- Tela de Resultados
  - Exibe código, preview e métricas WCAG.
  - Botão para enviar feedback (SUS/NASA-TLX).

### 7.2 Interface do Pesquisador

- Painel de experimentos
- Listagem de execuções com filtros (participante, modo, data).
- Exportação de resultados (CSV/JSON).
- Dashboard simples com médias de tempo, scores e consistência.

---

$$
8. Modelo de Dados

Entidades Principais:
- Participant
    - id (UUID)
    - start_mode (direct/wizard)
    - timestamp_start
- Session
    - id
    - participant_id
    - mode
    - prompt
    - response_code
    - generation_time
    - accessibility_score
    - wcag_findings
    - created_at
- Feedback
    - session_id
    - sus_score
    - nasa_tlx_load
    - comments

---

## 9. Fluxos de Operação

Fluxo 1 – Geração via Prompt Direto
1.	Usuário acessa a interface e insere um prompt textual livre.
2.	Backend envia o prompt à API GPT-4o.
3.	Código retornado é salvo e renderizado.
4.	Backend executa auditoria (Lighthouse/axe-core).
5.	Resultados (tempo, score, código) são armazenados.

Fluxo 2 – Geração via Wizard Guiado
1.	Usuário responde às perguntas sequenciais.
2.	O sistema compõe o prompt final.
3.	Backend envia prompt ao GPT-4o e processa o retorno.
4.	Auditoria automática e registro de métricas.
5.	Feedback do participante é solicitado.

Fluxo 3 – Exportação de Dados
1.	Pesquisador acessa painel administrativo.
2.	Seleciona intervalo e filtros.
3.	Sistema exporta CSV/JSON com logs, tempos e métricas.

---

## 10. Restrições de Projeto
- O sistema não deve depender de login com credenciais externas (Google, GitHub).
- A auditoria deve ser offline (sem chamada externa além da API do modelo).
- A arquitetura deve permitir replicação local para auditoria independente.
- Código e dados deverão ser versionados em Git.

---

## 11. Critérios de Aceitação
1.	O sistema executa ambos os modos de interação de forma completa.
2.	Cada execução gera código renderizável e auditável.
3.	Resultados WCAG e tempo são registrados corretamente.
4.	Exportação CSV/JSON contém todos os campos previstos.
5.	Logs permitem reconstrução completa da sessão.

---

## 12. Possíveis Extensões Futuras
- Integração com RAG para contextualização automática (documentos de referência).
- Implementação do protocolo MCP (Model Context Protocol) para rastreabilidade de contexto.
- Inclusão de módulo de avaliação multimodal (renderização por imagem).
- Ampliação para avaliação colaborativa (múltiplos usuários).

⸻

13. Conclusão

O InterfaceGen constitui o núcleo experimental da monografia, permitindo testar empiricamente os efeitos da estruturação contextual no processo de geração de interfaces com IA.
A implementação fiel a este documento assegura reprodutibilidade, rastreabilidade e validade científica dos resultados obtidos.
$$
