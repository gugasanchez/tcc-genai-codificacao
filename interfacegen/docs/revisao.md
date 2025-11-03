Esta monografia investiga a aplicação de modelos generativos de linguagem no contexto da engenharia de software, com ênfase em técnicas de \textit{Engenharia de Contexto} e \textit{Prompt Engineering} para aprimorar o processo de geração automatizada de interfaces web. A pesquisa abrange desde a fundamentação teórica e a revisão da literatura sobre \sigla{IA}{inteligência artificial} generativa e \sigla{LLMs}{\textit{Large Language Models}} aplicados à codificação, até a análise prática de um experimento comparativo entre diferentes modos de interação com o modelo. Neste capítulo, são apresentadas a motivação, os objetivos e a estrutura geral do estudo. O trabalho propõe um estudo de caso baseado no desenvolvimento do sistema \textit{InterfaceGen}, que compara dois fluxos de geração de código — o \textbf{Prompt Direto}, baseado em instruções livres, e o \textbf{Wizard Guiado}, estruturado a partir de perguntas derivadas de princípios de \textit{Engenharia de Requisitos} — buscando mensurar ganhos em qualidade, acessibilidade e consistência das interfaces geradas. Além disso, o estudo discute as implicações dessas abordagens para o desenvolvimento colaborativo humano-IA, suas limitações e oportunidades de integração com ferramentas e \textit{benchmarks} contemporâneos de geração de código, como \textit{ArtifactsBench} e \textit{FeedA11y}.

\section{Motivação e Contextualização}

A engenharia de software tem experimentado transformações significativas nas últimas décadas, impulsionadas pelos avanços em \textit{inteligência artificial} e aprendizado profundo. O surgimento de \textit{Large Language Models} (\textit{LLMs}), como \textit{GPT}, \textit{Claude}, \textit{Gemini} e \textit{Llama}, marcou o início de uma nova era de automação cognitiva, permitindo que máquinas compreendam e gerem linguagem natural e código com precisão crescente \cite{chen2021codex, guimaraes2025analyzing, retrievalsurvey2024}. Ferramentas como o \textit{GitHub Copilot}, \textit{Replit Agent 3} e \textit{Cursor} já demonstram impacto expressivo na produtividade e na redução de esforço cognitivo de desenvolvedores, permitindo a geração rápida de componentes, testes e documentações \cite{partnering2024, becker2025measuringimpactearly2025ai, }.

Contudo, essa integração entre IA e engenharia de software traz desafios substanciais \cite{pasquale2025challenges}. A geração de código — especialmente de interfaces web — depende fortemente do \textbf{contexto fornecido} ao modelo. Quando o \textit{prompt} é vago ou mal estruturado, o código resultante tende a apresentar inconsistências, baixa acessibilidade e violações de boas práticas \cite{ragreq2024, barriers2025}. Essa limitação decorre da natureza dos LLMs, que operam sobre janelas de contexto finitas e não possuem entendimento global do projeto \cite{contextagents2025}. Como consequência, erros sutis de coerência entre componentes e violações de padrões \textit{WCAG} (\textit{Web Content Accessibility Guidelines}) e \textit{WAI-ARIA} (\textit{Accessible Rich Internet Applications}) ainda são recorrentes \cite{humanorllm2024,webaim2023}.

Para mitigar essas falhas, emergem as técnicas de \textit{Engenharia de Contexto} e \textit{Prompt Engineering}, que visam estruturar a comunicação com o modelo e fornecer informações relevantes para melhorar a precisão da geração. A \textit{Engenharia de Contexto} abrange desde a curadoria do conteúdo até o enriquecimento do \textit{prompt} com variáveis e restrições que orientem o raciocínio do modelo, permitindo que ele produza saídas mais consistentes \cite{contextagents2025}. De modo análogo, a \textit{Engenharia de Prompt} (\textit{Prompt Engineering}) tem evoluído como um novo paradigma de programação, em que a formulação textual de instruções atua como uma camada de controle de alto nível sobre a execução da IA \cite{liu2021pretrain, white2023promptcatalog, pe4re2024}.

No contexto deste trabalho, a motivação principal é compreender como o desenho da interação humano-IA — isto é, a forma como o usuário comunica suas intenções ao modelo — afeta a qualidade e a previsibilidade do código gerado. Duas abordagens contrastantes são analisadas: o \textbf{Prompt Direto}, em que o usuário fornece instruções abertas e não estruturadas, e o \textbf{Wizard Guiado}, uma forma de interação estruturada baseada em princípios de \textit{Engenharia de Requisitos} e inspirada em estudos clássicos sobre interfaces do tipo “assistente” (\textit{wizard}) \cite{wizardthesis1998,partnering2024}. Essa segunda abordagem busca reduzir ambiguidades por meio de perguntas contextuais e etapas de clarificação, aproximando o processo de geração de uma modelagem de requisitos interativa.

A literatura recente indica que abordagens guiadas tendem a produzir resultados mais previsíveis e aderentes a padrões técnicos, ao custo de maior tempo inicial e menor liberdade criativa. Em contraste, o \textit{prompting} livre estimula variedade e exploração, mas acarreta maior risco de inconsistências \cite{partnering2024}. Essa tensão entre orientação e criatividade é um tema central na co-criação com IA e fornece o pano de fundo teórico para o experimento conduzido neste estudo.

\section{Objetivos}

O objetivo deste trabalho é analisar o impacto da \sigla{IA}{inteligência artificial} generativa na geração automatizada de interfaces web, por meio do uso de \sigla{LLMs}{\textit{Large Language Models}} e técnicas de \textit{Engenharia de Contexto} e \textit{Prompt Engineering}. Especificamente, busca-se desenvolver um \sigla{MVP}{Produto Mínimo Viável} denominado \textit{InterfaceGen}, capaz de gerar código front-end a partir de instruções textuais em dois modos distintos de interação: o \textbf{Prompt Direto}, baseado em comandos livres, e o \textbf{Wizard Guiado}, estruturado a partir de perguntas inspiradas em princípios de \textit{Engenharia de Requisitos}.

Por meio dessa comparação, pretende-se avaliar de que forma o grau de estruturação do contexto influencia a qualidade, a acessibilidade e a consistência do código gerado. O estudo busca mensurar ganhos objetivos em conformidade com as diretrizes \textit{WCAG 2.1}, tempo de geração e usabilidade percebida pelos usuários. Além disso, propõe-se uma análise comparativa com ferramentas de referência de mercado, como \textit{Lovable}, \textit{Bolt} e \textit{Base44}, de modo a posicionar o sistema desenvolvido frente às soluções existentes.

Por fim, espera-se que os resultados obtidos contribuam para compreender como a estruturação contextual e o desenho da interação humano-IA podem aprimorar a previsibilidade e a confiabilidade na geração de interfaces, promovendo um equilíbrio entre orientação técnica e liberdade criativa no processo de co-criação com modelos generativos.

\section{Organização}

Este trabalho está estruturado em cinco capítulos principais.  
O Capítulo 1 apresenta a motivação, os objetivos e a estrutura geral da pesquisa.  
O Capítulo 2 desenvolve a \textbf{Revisão Bibliográfica}, abordando os fundamentos teóricos de \textit{LLMs}, \textit{Engenharia de Contexto}, \textit{Prompt Engineering}, acessibilidade web e requisitos de software, bem como os principais \textit{benchmarks} e lacunas na literatura recente.  
O Capítulo 3 descreve o \textbf{Desenvolvimento}, detalhando o sistema \textit{InterfaceGen}, sua arquitetura técnica, ferramentas utilizadas e as etapas do experimento, bem como apresenta os \textbf{Resultados}, com as comparações quantitativas e qualitativas entre os dois modos de interação, além de um contraste com as ferramentas comerciais de referência.  
Por fim, o Capítulo 5 expõe as \textbf{Conclusões e Trabalhos Futuros}, destacando as contribuições obtidas, as limitações observadas e as perspectivas de evolução, como a integração de \textit{Retrieval-Augmented Generation (RAG)}, o uso do \textit{Model Context Protocol (MCP)} e a expansão para geração multimodal de interfaces.

% \section{Intro}

\noindent Este capítulo revisa criticamente a literatura que fundamenta este trabalho, organizando-a em nove eixos complementares: (i) os \textbf{fundamentos de \sigla{IA}{inteligência artificial} e dos \sigla{LLMs}{\textit{Large Language Models}}}, com ênfase na arquitetura \textit{Transformer} e na transição da geração textual para \textit{artefatos} visuais e interativos; (ii) a \textbf{aplicação de LLMs em engenharia de software}, cobrindo capacidades, limitações estruturais e \textit{benchmarks} clássicos e de nível de repositório; (iii) \textbf{\textit{Engenharia de Prompt}} e (iv) \textbf{\textit{Engenharia de Contexto}}, detalhando técnicas como \textit{zero/few-shot}, \textit{chain-of-thought}, \textit{prompt chaining}, \textit{role prompting} e estratégias programáticas de contextualização; (v) a \textbf{\sigla{RAG}{\textit{Retrieval-Augmented Generation}}} e protocolos associados (incluindo o \textit{Model Context Protocol} – \textit{MCP}), suas arquiteturas e requisitos de recuperação; (vi) a \textbf{relação entre \textit{prompting} e Engenharia de Requisitos}, incluindo paralelos com interfaces do tipo \textit{wizard} e mapeamentos de técnicas para atividades de \sigla{ER}{Engenharia de Requisitos}; (vii) a \textbf{geração de interfaces web e acessibilidade}, com foco em diretrizes \textit{WCAG}/\textit{WAI-ARIA} e ciclos de \textit{feedback} (e.g., \textit{ReAct}/FeedA11y); (viii) \textbf{modelos de interação humano–IA e co-criação}, contrastando modos \textit{human-led} e \textit{model-led} e seus efeitos sobre qualidade, diversidade e autoria; e (ix) \textbf{métricas e \textit{benchmarks} modernos}, que expandem a avaliação para fidelidade visual, interatividade, acessibilidade, segurança e \textit{UX}, culminando na identificação de \textbf{lacunas de pesquisa} (padronização métrica, estudos controlados e integração interação–avaliação). Essa síntese estabelece o alicerce conceitual do experimento deste trabalho — a comparação entre \textit{Prompt Direto} e \textit{Wizard Guiado} no \textit{InterfaceGen} — e orienta as hipóteses, métricas e escolhas metodológicas apresentadas nos capítulos subsequentes.

\section{Fundamentos da Inteligência Artificial e dos Modelos Generativos}
\label{sec:fundamentos-ia}

A rápida evolução da \sigla{IA}{inteligência artificial}, desde suas origens teóricas até a atual era dos \sigla{LLMs}{\textit{Large Language Models}}, representa uma das transformações tecnológicas mais significativas do século XXI. Compreender essa trajetória é de importância estratégica para avaliar o impacto profundo e multifacetado que a IA exerce sobre a engenharia de software. O que antes eram sistemas baseados em regras e algoritmos limitados evoluiu para modelos complexos capazes de compreender, gerar e raciocinar sobre dados em uma escala sem precedentes, remodelando fundamentalmente as práticas de desenvolvimento de software \cite{russell2021ai, goodfellow2016deep}.

A história dos modelos de IA é marcada por avanços incrementais, mas a introdução da arquitetura \textit{Transformer} em 2017 foi um ponto de inflexão decisivo \cite{vaswani2017attention}. Essa arquitetura, com seu mecanismo de atenção, superou as limitações dos modelos sequenciais anteriores, permitindo o processamento paralelo de dados e a captura de dependências de longo alcance em textos. Essa inovação viabilizou o treinamento de modelos significativamente maiores e mais complexos, abrindo caminho para o surgimento de LLMs como o \textit{GPT-2} e, posteriormente, o \textit{GPT-3}, que demonstraram capacidades emergentes notáveis \cite{brown2020gpt3}.

A arquitetura \textit{Transformer} tornou-se a espinha dorsal dos LLMs modernos. Ao processar sequências inteiras de dados de uma só vez e ponderar a importância relativa de cada parte da entrada através do mecanismo de atenção, ela permitiu que os modelos desenvolvessem uma compreensão contextual sofisticada da linguagem. Essa capacidade de raciocínio de longo prazo foi fundamental para o escalonamento dos modelos, culminando em uma nova geração de sistemas de IA com desempenho de ponta em uma vasta gama de tarefas \cite{devlin2018bert, openai2023gpt4}.

Entre os modelos de destaque que definem o cenário atual, encontram-se o \textit{GPT-4o} e o \textit{GPT-5} (OpenAI), o \textit{Gemini-2.5-Pro} (Google), o \textit{Claude 4.0-Sonnet} e o \textit{Claude Opus 4.1} (Anthropic), o \textit{DeepSeek-R1} (DeepSeek), o \textit{CodeLLaMA} (Meta), o \textit{Qwen 2.5-Coder} (Alibaba) e o \textit{StarCoder} (BigCode). Esses modelos ilustram a rápida expansão da escala, da capacidade multimodal e da aplicabilidade prática dos LLMs \cite{artifactsbench2025, deepseek2025r1}.

Recentemente, as capacidades desses modelos transcenderam a geração de trechos de código estático. A nova fronteira é a produção de \textit{artefatos} interativos e visuais. Conforme definido pelo estudo \textit{ArtifactsBench} \cite{artifactsbench2025}, um artefato é uma unidade executável, autônoma e gerada por modelo que integra código, elementos visuais e interação. Essa evolução — de texto para experiências dinâmicas, como \textit{widgets} web ou visualizações de dados — representa uma mudança de paradigma, exigindo novas abordagens para avaliação e desenvolvimento, como o uso de modelos multimodais julgadores (\textit{MLLM-as-Judge}) e benchmarks holísticos.

Com a base dos LLMs e sua capacidade de gerar artefatos complexos estabelecida, torna-se crucial analisar suas aplicações e limitações específicas no domínio da engenharia de software, onde seu impacto é cada vez mais profundo e transformador. A próxima seção, portanto, examina como os LLMs estão sendo integrados aos fluxos de trabalho de engenharia de software, suas contribuições diretas e os desafios que persistem em sua adoção prática.

\section{\sigla{LLMs}{\textit{Large Language Models}} e Engenharia de Software}
\label{sec:llms-engenharia-software}

Os \sigla{LLMs}{\textit{Large Language Models}} estão remodelando a criação de software, passando de meros assistentes de programação para parceiros ativos em praticamente todas as etapas do ciclo de vida do desenvolvimento. Essa integração promete acelerar a produtividade, automatizar tarefas repetitivas e democratizar a programação, permitindo que pessoas com diferentes níveis de especialização criem sistemas complexos por meio de descrições em linguagem natural \cite{brown2020gpt3, openai2023gpt4}. Entretanto, para que essa adoção seja eficaz e segura, é essencial compreender tanto as aplicações práticas desses modelos quanto as suas limitações inerentes, garantindo que os ganhos de produtividade não comprometam a qualidade e a manutenibilidade do software \cite{russell2021ai}.

Entre as aplicações mais proeminentes dos LLMs na engenharia de software, destacam-se:

\begin{itemize}
\item \textbf{Geração de código:} criação de funções, classes e até sistemas completos a partir de descrições textuais \cite{chen2021codex}.
\item \textbf{Completude de código (\textit{code completion}):} sugestão automática de trechos de código em tempo real, otimizando o fluxo de trabalho dos desenvolvedores.
\item \textbf{Correção de bugs:} identificação e correção automática de erros lógicos ou sintáticos no código \cite{sakib2023extending}.
\item \textbf{Tradução entre linguagens:} conversão de código entre diferentes linguagens de programação.
\item \textbf{\textit{Refactoring}:} reestruturação de código existente para melhorar legibilidade, desempenho e modularidade \cite{empiricalrefactor2024}.
\item \textbf{Geração de testes:} criação automatizada de testes unitários e de integração \cite{jimenez2023swebench}.
\item \textbf{Documentação automatizada:} geração de comentários, resumos e documentação técnica a partir do código-fonte \cite{pirzado2024navigating}.
\item \textbf{Geração de código em nível de repositório (\sigla{RLCG}{\textit{Repository-Level Code Generation}}):} tarefa emergente que envolve compreender múltiplos arquivos e dependências, exigindo raciocínio de longo alcance e consistência semântica global \cite{retrievalsurvey2024, repobench2023}.
\end{itemize}

Apesar de suas capacidades impressionantes, as arquiteturas atuais dos LLMs apresentam barreiras estruturais que limitam sua aplicação irrestrita na engenharia de software \cite{pasquale2025challenges}. Essas restrições precisam ser entendidas para permitir uma integração responsável e sustentável:

\begin{itemize}
\item \textbf{Janelas de contexto limitadas:} a maioria dos modelos ainda processa apenas uma quantidade finita de informações por vez. Essa limitação reduz a capacidade de realizar raciocínios de longo alcance em grandes bases de código, comprometendo a consistência entre arquivos e módulos.
\item \textbf{Inconsistência semântica entre arquivos:} modelos frequentemente geram discrepâncias em convenções, tipos de dados e estruturas de API, dificultando o uso em sistemas distribuídos.
\item \textbf{Dependência da clareza do \textit{prompt}:} a precisão e a correção do código gerado são fortemente influenciadas pela qualidade da instrução fornecida; \textit{prompts} ambíguos resultam em respostas incorretas ou incoerentes \cite{pirzado2024navigating}.
\item \textbf{Qualidade e segurança irregulares:} estudos empíricos mostram que, embora os LLMs possam gerar código funcional, o resultado tende a ser de qualidade inferior e frequentemente vulnerável a falhas de segurança \cite{securityquality2024}.
\end{itemize}

Para mensurar o desempenho dos LLMs nessas tarefas, a comunidade de pesquisa emprega benchmarks padronizados que abrangem diferentes níveis de granularidade. O \textit{HumanEval} \cite{chen2021codex}, proposto pela OpenAI, avalia a geração de funções isoladas em \textit{Python} com base na métrica \textit{pass@k}. O \textit{SWE-bench} \cite{jimenez2023swebench} eleva o nível de dificuldade ao utilizar \textit{issues} reais do GitHub, nas quais o modelo precisa gerar patches que passam em testes automatizados. O \textit{RepoBench} \cite{repobench2023} e o \textit{RepoEval} \cite{retrievalsurvey2024} focam no raciocínio em nível de repositório, avaliando a coerência entre múltiplos arquivos, enquanto métricas como \textit{exact match}, cobertura de testes e sucesso de compilação oferecem uma visão complementar de robustez e correção sintática.

Os resultados desses estudos revelam diferenças significativas entre linguagens e modelos. Uma análise multi-linguagem conduzida por \citeonline{securityquality2024} demonstrou que a geração de código em \textit{Python} atinge as maiores taxas de sucesso, enquanto linguagens como \textit{C++} apresentam desempenho inferior devido à sua complexidade sintática e ao gerenciamento explícito de memória. Modelos como o \textit{GPT-4o} e o \textit{Claude 3.5} destacam-se por gerar código mais coerente, embora ainda apresentem vulnerabilidades comuns, como o uso de senhas fixas (\textit{CWE-259}) e falhas de validação de certificados (\textit{CWE-295}).

Essas limitações estruturais levaram ao surgimento de novas disciplinas complementares, como a Engenharia de Prompt e a Engenharia de Contexto — abordadas nas seções seguintes — que buscam aprimorar a entrada dos modelos e otimizar sua capacidade de raciocinar de forma contextual. A combinação dessas abordagens promete reduzir ambiguidades, melhorar a coerência global do código gerado e aproximar o desenvolvimento assistido por IA das boas práticas da engenharia de software tradicional.

\section{Engenharia de \textit{Prompt} e Engenharia de Contexto}
\label{sec:engenharia-prompt-contexto}

A Engenharia de \textit{Prompt} emergiu como uma das áreas mais centrais no uso de \sigla{LLMs}{\textit{Large Language Models}}, sendo frequentemente descrita como a “arte e ciência” de formular instruções para obter saídas precisas, relevantes e contextualmente apropriadas. Em vez de recorrer ao re-treinamento do modelo — processo caro e tecnicamente complexo —, a Engenharia de \textit{Prompt} trata o próprio texto de entrada como uma interface ajustável, que permite controlar o comportamento do modelo sem alterar seus parâmetros internos \cite{white2023promptcatalog, liu2021pretrain}. Essa disciplina é hoje considerada um dos pilares para o uso eficaz de modelos generativos em tarefas de engenharia de software, onde a clareza e a contextualização da instrução determinam diretamente a qualidade do código gerado.

\subsection{Conceitos e Técnicas Fundamentais}

Diversas técnicas e padrões de \textit{prompting} foram consolidados na literatura recente como eficazes para melhorar a precisão e a robustez das respostas dos LLMs:

\begin{itemize}
\item \textbf{\textit{Zero-Shot} e \textit{Few-Shot Learning}:} capacidade do modelo de executar tarefas sem exemplos prévios (\textit{zero-shot}) ou com um pequeno conjunto de exemplos fornecidos diretamente no \textit{prompt} (\textit{few-shot}) \cite{brown2020gpt3}. Esses métodos demonstram que LLMs podem generalizar instruções complexas apenas pela exposição contextual.

    \item \textbf{\textit{Chain-of-Thought (CoT)}:} técnica que instrui o modelo a descrever o raciocínio passo a passo antes de produzir uma resposta final, decompondo problemas complexos em etapas intermediárias \cite{wei2022chain}. Essa abordagem mostrou ganhos significativos em tarefas lógicas e de raciocínio matemático, sendo atualmente aplicada também à geração e refatoração de código \cite{kojima2022large}.

    \item \textbf{\textit{Prompt Chaining}:} o encadeamento de múltiplos \textit{prompts}, onde a saída de uma interação serve de entrada para a próxima. Essa técnica permite decompor tarefas complexas em subtarefas gerenciáveis, criando um fluxo de raciocínio estruturado.

    \item \textbf{\textit{Role Prompting}:} consiste em atribuir um papel específico ao modelo (por exemplo, “aja como um engenheiro de software sênior” ou “analista de requisitos”) \cite{zhou2022large}. Essa contextualização melhora a consistência do tom e alinha a resposta ao domínio técnico da tarefa.

    \item \textbf{\textit{System Prompts} e \textit{Meta-Prompts}:} instruções de alto nível que definem o comportamento geral do modelo em uma sessão, estabelecendo restrições, objetivos e o estilo de raciocínio adotado em todas as respostas subsequentes \cite{ouyang2022training}.

\end{itemize}

A literatura enfatiza que a estrutura e clareza do \textit{prompt} têm impacto direto na qualidade do código gerado. Pequenas variações textuais podem alterar drasticamente o resultado final — um fenômeno conhecido como \textit{prompt sensitivity} —, o que reforça a necessidade de padrões metodológicos na elaboração e validação de \textit{prompts} \cite{white2023promptcatalog}.

\subsection{Técnicas Avançadas e Abordagens Iterativas}

Com o amadurecimento da área, surgiram técnicas experimentais mais sofisticadas, projetadas para contornar as limitações da sensibilidade e da falta de autocrítica dos modelos. Entre elas destacam-se:

\begin{itemize}
\item \textbf{\textit{Self-Criticism} e Loops de Feedback:} o modelo é instruído a revisar e aprimorar sua própria saída, produzindo uma versão revisada com base em critérios de qualidade definidos no próprio \textit{prompt} ou em uma ferramenta externa \cite{yao2022react}.

    \item \textbf{\textit{ReAct Framework}:} propõe um ciclo iterativo de “raciocinar–agir–observar”, em que o modelo alterna entre o pensamento lógico e o uso de ferramentas externas (por exemplo, analisadores estáticos, bancos vetoriais) para resolver tarefas complexas. Essa integração de raciocínio simbólico e interação prática demonstrou ganhos expressivos na precisão e consistência das respostas \cite{yao2022react}.

    \item \textbf{\textit{Auto-Prompting} e Engenharia Programática de Contexto:} abordagens automáticas para gerar, testar e refinar \textit{prompts} por meio de otimização baseada em feedback, buscando reduzir a dependência de instruções manuais.

\end{itemize}

Essas estratégias iterativas preparam o terreno para a próxima etapa evolutiva da Engenharia de Contexto, que vai além da simples formulação textual, incorporando fontes de conhecimento externas de forma dinâmica.

\subsection{Engenharia de Contexto e Recuperação de Informação}

A \textbf{Engenharia de Contexto} (\textit{Context Engineering}) amplia o escopo do \textit{prompting} ao incluir mecanismos de recuperação de conhecimento relevantes para enriquecer a entrada do modelo. Em vez de confiar exclusivamente na memória estática do LLM, essa abordagem injeta dinamicamente trechos de código, documentação, dependências e exemplos relevantes, aproximando a geração de código de um processo de raciocínio contextualizado \cite{lewis2020rag, retrievalsurvey2024}.

Entre as estratégias centrais dessa disciplina, destacam-se:

\begin{itemize}
\item \textbf{Recuperação Lexical:} baseada em palavras-chave e algoritmos clássicos como o BM25, útil em contextos bem delimitados, porém limitada na captura de similaridade semântica.

    \item \textbf{Recuperação Densa:} utiliza \textit{embeddings} vetoriais para representar consultas e documentos em um espaço semântico contínuo, permitindo a recuperação de conteúdos relacionados mesmo com vocabulário distinto.

    \item \textbf{Recuperação Estrutural:} modela bases de código como grafos, nos quais nós representam entidades (funções, classes) e arestas descrevem relações como chamadas e dependências. Essa estrutura é crucial para raciocinar sobre código de múltiplos arquivos, característica essencial em \sigla{RLCG}{\textit{Repository-Level Code Generation}} \cite{retrievalcodegen2024}.

\end{itemize}

O elo entre Engenharia de Contexto e Engenharia de \textit{Prompt} é, portanto, o grau de estruturação da entrada. Quanto mais rico e relevante o contexto, mais previsível e controlável se torna a saída do modelo. Essa interdependência fundamenta técnicas como a \textit{Retrieval-Augmented Generation (RAG)}, que será abordada em profundidade na próxima seção.

\section{Recuperação Aumentada (\sigla{RAG}{\textit{Retrieval-Augmented Generation}}) e Protocolos Associados}
\label{sec:rag}

A \sigla{RAG}{\textit{Retrieval-Augmented Generation}} surgiu como um dos paradigmas mais promissores para superar as limitações estruturais dos \sigla{LLMs}{\textit{Large Language Models}}, especialmente no que diz respeito à capacidade de raciocínio em longo contexto e à atualização de conhecimento \cite{lewis2020rag}. Enquanto os LLMs tradicionais dependem exclusivamente do conhecimento aprendido durante o treinamento — o que os torna suscetíveis à obsolescência e a lacunas de domínio —, os sistemas baseados em RAG permitem que o modelo recupere dinamicamente informações externas relevantes antes de gerar uma resposta. Essa integração transforma o processo de geração em uma operação de \textit{“consulta contextual”}, aproximando o raciocínio da IA de um comportamento interpretativo, adaptável e verificável.

\subsection{Arquitetura e Fluxo Operacional da RAG}

Conforme definido por \citeonline{lewis2020rag}, o fluxo operacional da RAG combina dois componentes centrais:

\begin{enumerate}
\item \textbf{Módulo de Recuperação (\textit{Retriever})}: responsável por buscar, em uma base de conhecimento externa, os documentos mais relevantes com base na consulta do usuário.
\item \textbf{Módulo de Geração (\textit{Generator})}: utiliza o conteúdo recuperado, juntamente com a consulta original, como contexto expandido para produzir a resposta final.
\end{enumerate}

Formalmente, dado um \textit{prompt} $q$, o módulo de recuperação $R$ seleciona um conjunto de $k$ documentos relevantes $D_k = R(q)$. O módulo gerador $G$ então produz a saída $y$ condicionada à concatenação $[q, D_k]$, ou seja, $y = G([q, D_k])$. Esse ciclo garante que a geração de texto, código ou resposta seja fundamentada em evidências externas, reduzindo as chamadas “alucinações” e ampliando o domínio de aplicação do modelo.

A \textit{RAG} se diferencia de técnicas tradicionais de busca e de sistemas de \textit{Information Retrieval (IR)} porque o conteúdo recuperado não é apenas retornado, mas incorporado semanticamente no contexto de geração, permitindo que o LLM o use de maneira interpretativa.

\subsection{Estratégias de Recuperação}

O desempenho e a precisão da RAG dependem fortemente da estratégia de recuperação adotada. Três categorias principais são identificadas na literatura \cite{retrievalsurvey2024, retrievalcodegen2024}:

\begin{itemize}
\item \textbf{Recuperação Lexical:} baseada na correspondência literal de termos, geralmente implementada com algoritmos como \textit{BM25}. Apesar de simples e eficiente, é limitada por sua incapacidade de capturar relações semânticas entre palavras ou conceitos.
\item \textbf{Recuperação Densa:} utiliza \textit{embeddings} vetoriais para representar consultas e documentos em um espaço contínuo de alta dimensão, permitindo a comparação semântica via similaridade de cosseno. Essa abordagem é amplamente usada em bases vetoriais como FAISS e Milvus \cite{retrievalsurvey2024}.
\item \textbf{Recuperação Estrutural:} modela o domínio como um grafo de conhecimento, no qual nós representam entidades (como funções, classes ou módulos) e arestas representam relações (como chamadas, dependências ou herança). Essa técnica é especialmente eficaz em aplicações de \sigla{RLCG}{\textit{Repository-Level Code Generation}}, onde é necessário raciocinar sobre a estrutura completa de um sistema de software \cite{retrievalcodegen2024}.
\end{itemize}

Na prática, sistemas híbridos que combinam múltiplas estratégias de recuperação tendem a apresentar os melhores resultados, equilibrando velocidade, precisão e relevância contextual.

\subsection{RAG em Engenharia de Software}

A aplicação da RAG na engenharia de software tem se mostrado particularmente eficaz para tarefas que exigem raciocínio contextual extenso e referência cruzada entre múltiplos artefatos. Estudos como \citeonline{retrievalcodegen2024} demonstram que a integração de recuperação semântica em tarefas como rastreabilidade de requisitos (\sigla{TLR}{\textit{Traceability Link Recovery}}) e revisão automatizada de código melhora significativamente a precisão e a consistência das respostas.

Em um experimento conduzido com seis bases de dados de requisitos, o método RAG superou abordagens tradicionais de aprendizado supervisionado e modelos puramente generativos em precisão e completude de rastreamento. Além disso, observou-se que o uso de \textit{Chain-of-Thought Prompting (CoT)} combinado ao RAG potencializa o raciocínio contextual e reduz falsos positivos em tarefas de validação semântica.

\subsection{Requisitos de Recuperação e Engenharia de Requisitos para RAG}

Um avanço conceitual recente é o estabelecimento dos chamados \textbf{“Requisitos de Recuperação”} (\textit{Retrieval Requirements}), discutidos por \citeonline{ragreq2024}. Essa noção propõe que a definição explícita de requisitos para a fase de recuperação — como a relevância, diversidade e atualidade dos dados — é essencial para o sucesso de sistemas RAG. Em um estudo de caso conduzido em uma empresa do setor marítimo, os autores demonstram que a diversidade do conhecimento recuperado é mais importante que o volume bruto de exemplos, uma vez que a repetição de dados redundantes não melhora o desempenho do modelo.

A Engenharia de Requisitos para RAG propõe um ciclo de vida estruturado composto pelas etapas de:
\begin{enumerate}
\item \textbf{Estratégia de Recuperação:} definição dos tipos de fontes, granularidade dos dados e políticas de atualização.
\item \textbf{Indexação e Pré-processamento:} transformação dos dados em representações vetoriais ou grafos de conhecimento.
\item \textbf{Gerenciamento de Dados:} controle de qualidade, deduplicação e enriquecimento semântico.
\item \textbf{Monitoramento e Avaliação:} auditoria contínua da eficácia da recuperação e correlação com métricas de geração.
\end{enumerate}

Essas etapas asseguram que o sistema RAG mantenha consistência, relevância e transparência durante a operação, alinhando-se às boas práticas da Engenharia de Software.

\subsection{Protocolos de Contexto e o Model Context Protocol (MCP)}

Recentemente, o \textbf{\textit{Model Context Protocol (MCP)}} tem sido proposto como um padrão emergente para a integração entre LLMs e múltiplas fontes de dados \cite{mcp2024}. O MCP define um conjunto de diretrizes e interfaces para permitir que agentes de IA troquem contexto de maneira estruturada, interoperável e segura, promovendo a padronização entre diferentes implementações de \textit{context engineering}.

O MCP introduz camadas de comunicação padronizadas que descrevem:
\begin{itemize}
\item \textbf{Gerenciamento de Contexto:} como o modelo acessa, valida e prioriza múltiplas fontes de informação externas.
\item \textbf{Versionamento de Contexto:} mecanismos para controlar atualizações e revisões de conhecimento.
\item \textbf{Rastreabilidade:} registro auditável das fontes utilizadas durante a geração, fortalecendo a explicabilidade e a confiança do sistema.
\end{itemize}

Combinado à RAG, o MCP representa uma evolução no sentido de tornar os modelos generativos componentes confiáveis de sistemas complexos, capazes de operar com autonomia contextual e transparência verificável.

\section{Engenharia de Requisitos e sua Relação com \textit{Prompting}}
\label{sec:engenharia-requisitos}

A \sigla{ER}{Engenharia de Requisitos} é uma disciplina fundamental da Engenharia de Software, responsável por descobrir, analisar, documentar e gerenciar as necessidades e restrições de um sistema. Com o advento dos \sigla{LLMs}{\textit{Large Language Models}}, a Engenharia de \textit{Prompt} passou a ser interpretada como uma forma moderna e interativa de elicitação de requisitos, na qual o usuário atua como um \textit{stakeholder} que guia o modelo, por meio de uma sequência de instruções textuais, a gerar um artefato de software que satisfaça uma necessidade específica \cite{pe4re2024}. Essa relação transforma o processo de interação com modelos generativos em um diálogo de co-criação, aproximando o \textit{prompting} dos princípios clássicos de especificação de sistemas.

\subsection{Fundamentos da Engenharia de Requisitos Tradicional}

Tradicionalmente, a Engenharia de Requisitos é estruturada em cinco etapas principais \cite{sommerville2016software}:
\begin{enumerate}
\item \textbf{Elicitação:} coleta de requisitos junto aos \textit{stakeholders}, buscando compreender suas necessidades e expectativas.
\item \textbf{Análise:} verificação de conflitos, inconsistências e dependências entre requisitos.
\item \textbf{Especificação:} documentação formal dos requisitos funcionais e não-funcionais.
\item \textbf{Validação:} verificação de que os requisitos refletem corretamente as necessidades do usuário.
\item \textbf{Gerenciamento:} controle de mudanças e rastreabilidade ao longo do ciclo de vida do sistema.
\end{enumerate}

Essas etapas têm o propósito de reduzir ambiguidade e garantir que o produto final atenda aos objetivos de negócio e restrições técnicas. No contexto dos LLMs, cada uma dessas fases encontra paralelo no processo de \textit{prompting}: a elaboração do \textit{prompt} atua como elicitação e especificação, enquanto as revisões iterativas representam validação e gerenciamento contínuo de requisitos.

\subsection{O \textit{Prompting} como Processo de Elicitação Iterativa}

O processo de \textit{prompting} guiado, especialmente quando iterativo, reflete diretamente as práticas de elicitação e análise da Engenharia de Requisitos tradicional. A criação de \textit{prompts}, a avaliação das respostas e o subsequente refinamento das instruções espelham o ciclo de negociação e esclarecimento que ocorre entre analistas e usuários humanos \cite{pe4re2024}.

Cada iteração de \textit{prompting} representa uma nova tentativa de capturar a intenção do usuário, ajustando os parâmetros e delimitando o escopo da tarefa, de forma semelhante ao que ocorre no processo de especificação incremental. Esse comportamento é particularmente evidente em sistemas baseados em \textit{wizard prompting}, que estruturam a interação em etapas progressivas.

\subsection{O Paradigma \textit{Wizard} e sua Relevância Histórica}

Um paralelo histórico interessante pode ser traçado com as interfaces do tipo \textit{Wizard}, amplamente utilizadas em softwares da década de 2000. Tais interfaces decompunham tarefas complexas em uma série de etapas simples, reduzindo a carga cognitiva do usuário e aumentando a precisão das entradas \cite{wizardthesis1998}. Segundo o estudo \citeonline{wizardthesis1998}, usuários que utilizaram interfaces \textit{wizard} foram, em média, 46\% mais rápidos e 34\% mais precisos na execução de tarefas de criação de documentos e aplicações em comparação com interfaces livres.

Esse resultado histórico fornece uma validação empírica para os princípios subjacentes do \textit{prompting} estruturado. Assim como o \textit{wizard} atua como mediador entre a intenção do usuário e a execução técnica, o \textit{prompting} guiado atua como um facilitador cognitivo na interação humano–IA, permitindo que a tarefa seja decomposta, compreendida e executada de forma incremental.

\subsection{Mapeamento entre Técnicas de \textit{Prompting} e Tarefas de Engenharia de Requisitos}

A revisão sistemática intitulada \textit{Prompt Engineering for Requirements Engineering (PE4RE)} formaliza a conexão entre a Engenharia de \textit{Prompt} e a Engenharia de Requisitos, propondo uma taxonomia que associa técnicas específicas de \textit{prompting} a atividades clássicas da ER \cite{pe4re2024}. O mapeamento é apresentado na Tabela~\ref{tab:pe4re}.

\begin{table}[H]
\centering
\caption{Mapeamento entre Técnicas de \textit{Prompting} e Atividades de Engenharia de Requisitos.}
\label{tab:pe4re}
\begin{tabular}{|p{5cm}|p{8cm}|}
\hline
\textbf{Técnica de \textit{Prompting}} & \textbf{Tarefa de Engenharia de Requisitos (ER)} \\ \hline
\textit{Few-Shot Learning} & Elicitação e Validação \\ \hline
\textit{Chain-of-Thought (CoT)} & Análise e Validação \\ \hline
\textit{Retrieval-Augmented Generation (RAG)} & Elicitação, Rastreabilidade e Gerenciamento \\ \hline
\textit{Role Prompting} & Elicitação e Comunicação com Stakeholders \\ \hline
\end{tabular}
\end{table}

Essa taxonomia evidencia que as técnicas de \textit{prompting} não apenas reproduzem, mas também ampliam as práticas tradicionais de ER. Por exemplo, a RAG, ao permitir rastreabilidade e atualização dinâmica de requisitos, contribui diretamente para o gerenciamento de mudanças — um dos maiores desafios da engenharia contemporânea.

\subsection{Integração com Requisitos Não Funcionais e Acessibilidade}

A convergência entre \textit{prompting} e ER se estende também aos requisitos não funcionais, como desempenho, segurança e acessibilidade. Em particular, estudos recentes demonstram que LLMs podem gerar código acessível de forma mais consistente que desenvolvedores humanos em aspectos básicos, embora ainda apresentem dificuldades em lidar com estruturas semânticas complexas \cite{humanorllm2024}. Incorporar explicitamente diretrizes como o \textit{Web Content Accessibility Guidelines (WCAG)} nos \textit{prompts} tem se mostrado uma prática eficaz para mitigar esse problema, integrando princípios de qualidade e inclusão já na etapa de especificação.

\subsection{Síntese e Implicações}

Dessa forma, a integração entre Engenharia de Requisitos e Engenharia de \textit{Prompt} redefine o papel do engenheiro de software na era dos modelos generativos. O profissional deixa de ser apenas um tradutor de necessidades humanas para requisitos formais e passa a atuar como um projetista de interações cognitivas com sistemas inteligentes. Essa mudança de paradigma amplia as fronteiras da ER, posicionando o \textit{prompting} não como uma técnica auxiliar, mas como um novo paradigma de especificação e colaboração homem–máquina.

\section{Geração de Interfaces Web e Acessibilidade}
\label{sec:geracao-interfaces}

A geração de interfaces de usuário (\sigla{UI}{\textit{User Interface}}) evoluiu de maneira significativa nas últimas décadas, passando de sistemas baseados em \textit{templates} estáticos para abordagens dinâmicas impulsionadas por Inteligência Artificial. Os \sigla{LLMs}{\textit{Large Language Models}} modernos demonstram capacidade crescente para gerar interfaces web completas a partir de descrições em linguagem natural, utilizando \textit{frameworks} como React, Next.js e bibliotecas de estilização como Tailwind CSS. No entanto, essa automação traz um desafio central: garantir que as interfaces geradas não sejam apenas funcionais e esteticamente agradáveis, mas também acessíveis e inclusivas.

\subsection{Acessibilidade Digital e seus Padrões}

A acessibilidade digital refere-se ao conjunto de práticas de design e desenvolvimento voltadas a garantir que produtos digitais possam ser utilizados por pessoas com diferentes habilidades e deficiências \cite{wcag2023}. Seu fundamento técnico e ético é estabelecido pelas \sigla{WCAG}{\textit{Web Content Accessibility Guidelines}}, atualmente em sua versão 2.2, publicadas pelo \sigla{W3C}{\textit{World Wide Web Consortium}}.

Essas diretrizes definem princípios fundamentais de acessibilidade, agrupados nos eixos “Perceptível”, “Operável”, “Compreensível” e “Robusto”. A aderência a esses padrões não é apenas uma questão de conformidade legal, mas um requisito essencial para garantir experiências digitais equitativas. Além disso, especificações complementares, como o \textit{WAI-ARIA (Accessible Rich Internet Applications)}, estabelecem regras para o uso de atributos semânticos que auxiliam tecnologias assistivas, como leitores de tela e teclados virtuais.

Apesar de avanços substanciais, estudos recentes revelam que a maioria das páginas web ainda apresenta múltiplas falhas de conformidade com as WCAG, mesmo em grandes corporações \cite{webaim2023}. Esse contexto reforça a importância de investigar se modelos generativos podem contribuir para mitigar tais lacunas.

\subsection{Modelos Generativos na Criação de Interfaces Acessíveis}

O estudo \textit{Human or LLM? A Comparative Study on Accessible Code Generation Capability} \cite{humanorllm2024} comparou o código gerado por LLMs com o código escrito por desenvolvedores humanos em dez projetos web reais, utilizando ferramentas automatizadas de validação de acessibilidade (IBM Equal Access e QualWeb). Os resultados indicaram que os modelos — particularmente o \textit{GPT-4o} e o \textit{Qwen2.5-Coder} — superaram os humanos em métricas de acessibilidade básica, como contraste de cores e presença de textos alternativos em imagens.

Entretanto, os modelos ainda apresentaram limitações importantes na geração de estruturas semânticas adequadas e no uso de atributos \textit{ARIA}, fundamentais para aplicações ricas e interativas. Esses achados sugerem que, embora os LLMs possuam potencial para gerar código acessível, sua eficácia depende de instruções explícitas e da incorporação de mecanismos de retroalimentação durante o processo de geração.

\subsection{O Papel dos Ciclos de Feedback e o \textit{FeedA11y}}

Com base nesse desafio, o estudo \textit{FeedA11y: A Feedback-Driven Approach for Accessibility-Aware Code Generation} propôs uma solução iterativa baseada no \textit{framework} \sigla{ReAct}{\textit{Reason + Act}} \cite{yao2022react, humanorllm2024}. Nessa abordagem, o modelo gera o código inicial, executa uma verificação automatizada de acessibilidade e, em seguida, utiliza os resultados dos testes para refinar sua própria saída. Esse ciclo de raciocínio–ação–observação possibilita correções precisas e contextualizadas, superando limitações observadas em técnicas de \textit{prompting} estático.

Os experimentos conduzidos com o \textit{FeedA11y} demonstraram melhorias significativas na conformidade com as diretrizes WCAG 2.1 e na correção de erros relacionados a contraste, semântica e estrutura de navegação. O método alcançou desempenho superior às abordagens baseadas em \textit{Zero-Shot}, \textit{Few-Shot} e \textit{Self-Criticism}, consolidando-se como um avanço na integração entre \textit{Prompt Engineering} e avaliação automatizada de acessibilidade.

\subsection{Desafios e Oportunidades}

Embora a IA generativa represente uma nova fronteira para a criação de interfaces inclusivas, ainda há desafios consideráveis. Um dos principais é a dificuldade em capturar nuances contextuais complexas — por exemplo, a relação entre hierarquias visuais e estruturas semânticas —, que frequentemente dependem de julgamento humano. Além disso, há risco de perpetuação de vieses contidos nos dados de treinamento, reproduzindo práticas incorretas de design e desenvolvimento \cite{barriers2025}.

Por outro lado, as oportunidades são vastas. A integração de técnicas de \textit{prompting guiado} com ferramentas de verificação automatizada abre caminho para fluxos de trabalho em que a acessibilidade é incorporada desde a concepção do sistema, em vez de ser tratada como uma etapa posterior. Essa abordagem de \textit{“acessibilidade por design”} promove não apenas conformidade técnica, mas também uma mudança cultural na engenharia de software orientada à inclusão.

\subsection{Síntese da Seção}

A literatura indica que os \sigla{LLMs}{\textit{Large Language Models}} podem atuar como agentes colaborativos na geração de interfaces web acessíveis, desde que orientados por técnicas de \textit{prompting} estruturado e apoiados por ciclos de feedback contínuo. A integração de padrões como \textit{WCAG} e \textit{WAI-ARIA} diretamente nos processos de geração e validação representa um passo importante em direção a uma IA generativa responsável e centrada no usuário. Essa sinergia entre engenharia de contexto, verificação automatizada e design inclusivo será aprofundada nos experimentos descritos nos capítulos subsequentes.

\section{Interação Humano–IA e Co-Criação}
\label{sec:interacao-humano-ia}

O paradigma de interação entre humanos e sistemas de \sigla{IA}{\textit{Inteligência Artificial}} tem evoluído de modo substancial nas últimas décadas, passando da simples automação de tarefas para a \textbf{colaboração criativa e cognitiva}. Essa transformação marca a transição da IA como ferramenta executora para a IA como \textit{parceira de pensamento} (\textit{thought partner}), capaz de contribuir em processos de ideação, design e resolução de problemas de alta complexidade \cite{partnering2024}. No contexto da engenharia de software e da geração de interfaces, essa mudança implica o redesenho dos modos de interação, buscando equilibrar os pontos fortes da cognição humana — criatividade, julgamento contextual e empatia — com as capacidades computacionais da máquina — precisão, velocidade e memória expandida.

\subsection{Modelos de Colaboração Humano–IA}

De acordo com o estudo \textit{Partnering with Generative AI: Experimental Evaluation of Human-Led and Model-Led Interaction in Human–AI Co-Creation} \cite{partnering2024}, a interação colaborativa com IA pode assumir essencialmente dois modos de operação:

\begin{itemize}
\item \textbf{Modo \textit{Human-Led}} (liderado pelo humano): a IA atua como um parceiro reflexivo, oferecendo sugestões, fazendo perguntas e expandindo o espaço de ideias. O controle da tarefa e das decisões criativas permanece com o humano.
\item \textbf{Modo \textit{Model-Led}} (liderado pelo modelo): o sistema de IA assume um papel proativo e diretivo, reescrevendo, expandindo ou refinando as ideias iniciais do usuário de forma autônoma.
\end{itemize}

O experimento, conduzido com 486 participantes, comparou esses modos em um contexto de ideação criativa e demonstrou \textbf{diferenças marcantes} nos resultados. Conforme apresentado na Tabela~\ref{tab:humanmodelcomparison}, ambos os modos melhoraram a qualidade das ideias, mas o modo \textit{Human-Led}, em que a IA faz perguntas em vez de reescrever o conteúdo, preservou a diversidade das soluções e o senso de autoria dos usuários.

\begin{table}[H]
\centering
\caption{Comparação entre os Modos de Interação Humano–IA segundo \citeonline{partnering2024}.}
\label{tab:humanmodelcomparison}
\begin{tabular}{|p{4cm}|p{4cm}|p{4cm}|}
\hline
\textbf{Métrica Avaliada} & \textbf{Modo \textit{Human-Led}} & \textbf{Modo \textit{Model-Led}} \\ \hline
Qualidade da Ideia & Aumenta & Aumenta \\ \hline
Diversidade das Ideias & Preservada & Reduzida \\ \hline
Senso de Autoria (\textit{Ownership}) & Mantido & Reduzido \\ \hline
Carga Cognitiva & Moderadamente Alta & Reduzida \\ \hline
\end{tabular}
\end{table}

Esses resultados evidenciam um dilema central da co-criação com IA: quanto maior o grau de automação, menor tende a ser a diversidade criativa e o engajamento humano. Em contrapartida, modos reflexivos e iterativos, ainda que cognitivamente mais exigentes, geram resultados mais originais e fortalecem o sentimento de autoria do usuário sobre o produto final.

\subsection{Fundamentos Cognitivos e Carga Mental}

A literatura em \sigla{HCI}{\textit{Human–Computer Interaction}} reforça que a qualidade da colaboração humano–IA depende diretamente da \textbf{gestão da carga cognitiva} do usuário \cite{promptinfuser2024}. Modelos excessivamente autônomos podem gerar alienação, enquanto sistemas que exigem demasiada intervenção humana podem causar fadiga e reduzir a fluidez da interação. Pesquisas recentes sugerem que os modos de interação \textit{wizard-like} — que estruturam a comunicação em etapas — reduzem significativamente o esforço cognitivo, melhorando a precisão e a satisfação do usuário \cite{wizardthesis1998}.

Em experimentos clássicos, o uso de interfaces \textit{wizard} resultou em ganhos de 46\% em velocidade e 34\% em precisão em comparação a abordagens livres \cite{wizardthesis1998}. Esses resultados permanecem relevantes para o design de agentes conversacionais e sistemas de prompting estruturado, nos quais a decomposição da tarefa em microetapas promove maior clareza e controle no processo de co-criação.

\subsection{IA como “\textit{Thought Partner}” e o Papel da Reflexão}

A ideia da IA como “\textit{thought partner}” propõe que a função mais valiosa de um modelo generativo não é substituir o raciocínio humano, mas estimulá-lo \cite{partnering2024}. Essa abordagem aproxima-se de técnicas de \textit{Prompting Reflexivo}, nas quais o modelo responde com perguntas estratégicas ou reiterações parciais antes de produzir a solução final. Tal estratégia espelha o método socrático e as práticas de \textit{design thinking}, promovendo a ampliação do espaço de busca criativa.

No contexto da engenharia de software, essa forma de interação pode ser aplicada para a elicitação de requisitos, brainstorming de funcionalidades ou geração de interfaces. Ao adotar um modelo reflexivo, o sistema atua como uma ferramenta de \textit{co-raciocínio}, ajudando o engenheiro a explorar múltiplos caminhos possíveis antes de chegar à implementação final. Essa abordagem é compatível com arquiteturas iterativas de agentes, como o \textit{ReAct} (\textit{Reason + Act}) \cite{yao2022react}, que intercalam raciocínio, ação e observação em ciclos sucessivos, aproximando-se de um comportamento deliberativo e adaptativo.

\subsection{Integração com Processos de Co-Criação em Engenharia de Software}

Em um ambiente de desenvolvimento colaborativo, o sucesso da co-criação com IA depende do equilíbrio entre autonomia do modelo e controle humano. Estudos em engenharia de software baseada em IA indicam que a presença de um “ciclo de reflexão” explícito — onde o engenheiro valida e refina continuamente as sugestões do modelo — melhora significativamente a consistência e a manutenibilidade do código \cite{contextagents2025}.

Essa estrutura de colaboração pode ser implementada por meio de sistemas de \textit{Wizard Prompting} integrados a ferramentas de versionamento, como GitHub Copilot, Replit ou Cursor, nos quais cada iteração do modelo é tratada como uma proposta sujeita a revisão. Assim, o fluxo humano–IA passa a incorporar práticas de revisão de código, testes automatizados e feedback contextual, configurando uma forma híbrida de engenharia de software orientada à reflexão.

\subsection{Síntese e Implicações}

Os avanços em interação humano–IA apontam para um novo paradigma de colaboração, no qual a IA atua como amplificadora da cognição humana e não como substituta. Os resultados de estudos empíricos mostram que o envolvimento humano contínuo é essencial para preservar a diversidade criativa, a qualidade do raciocínio e o senso de autoria.

A incorporação de princípios como \textit{prompting reflexivo}, \textit{wizard prompting} e ciclos de raciocínio–ação–observação (\textit{ReAct}) demonstra que a engenharia de software do futuro será, cada vez mais, uma prática de co-criação iterativa, combinando o rigor lógico das máquinas com a intuição e julgamento humano.

\section{Métricas de Avaliação e \textit{Benchmarks} Modernos}
\label{sec:metricas-benchmarks}

A evolução dos \sigla{LLMs}{\textit{Large Language Models}} aplicados à engenharia de software revelou uma lacuna crítica na forma como a qualidade dos artefatos de código é avaliada. Os \textit{benchmarks} tradicionais, como o \textit{HumanEval} \cite{chen2021codex}, focam em métricas de correção algorítmica — como \textit{pass@k} e \textit{exact match} —, que se mostram insuficientes para mensurar a qualidade multifacetada de artefatos modernos, especialmente aqueles com componentes visuais e interativos.

Com a crescente capacidade dos LLMs de gerar aplicações completas, interfaces e sistemas multimodais, torna-se necessário adotar novos paradigmas de avaliação que considerem dimensões como fidelidade visual, interatividade, acessibilidade e experiência do usuário (\sigla{UX}{\textit{User Experience}}) \cite{artifactsbench2025}. Essa transição marca a passagem de uma avaliação puramente sintática para uma análise contextual e multimodal.

\subsection{Limitações dos \textit{Benchmarks} Tradicionais}

Os \textit{benchmarks} de geração de código mais difundidos — como \textit{HumanEval} \cite{chen2021codex}, \textit{SWE-bench} \cite{jimenez2023swebench}, \textit{RepoBench} \cite{repobench2023} e \textit{RepoEval} \cite{retrievalsurvey2024} — foram originalmente projetados para avaliar modelos em tarefas de pequena escala, como a geração de funções isoladas ou a correção de erros sintáticos. Embora úteis, esses testes não refletem a complexidade de aplicações reais, nas quais fatores como consistência entre arquivos, interatividade e estética desempenham papel crucial.

Esses \textit{benchmarks} avaliam primordialmente a precisão funcional do código gerado, verificando se ele passa em um conjunto de testes unitários. No entanto, não consideram elementos essenciais à experiência do usuário ou à sustentabilidade do software, como a conformidade com padrões de acessibilidade (\sigla{WCAG}{\textit{Web Content Accessibility Guidelines}}), a segurança (\sigla{CWE}{\textit{Common Weakness Enumeration}}) e a usabilidade.

\subsection{\textit{ArtifactsBench}: Um Paradigma Multimodal}

Para preencher essa lacuna, pesquisadores do grupo Tencent Hunyuan introduziram o \textit{ArtifactsBench} \cite{artifactsbench2025}, um \textit{benchmark} multimodal inovador que avalia a capacidade dos modelos de gerar artefatos visuais e interativos — como jogos, widgets e aplicações web completas.

O \textit{ArtifactsBench} inclui 1.825 tarefas em nove domínios distintos (por exemplo, jogos, aplicações SVG e componentes web), distribuídas em três níveis de dificuldade: fácil, médio e difícil. O processo de avaliação automatizada consiste em renderizar cada artefato em um ambiente \textit{sandboxed} (Chromium sem interface gráfica, 1024×768 pixels) e capturar três \textit{frames} em sequência (antes, durante e após uma interação programada).

A análise é conduzida por um modelo multimodal — denominado \textit{MLLM-as-Judge} — que utiliza um \textit{checklist} de dez dimensões, abrangendo fidelidade visual, responsividade, completude funcional e conformidade com boas práticas de código. O processo emprega uma dupla de avaliadores automáticos (\textit{Gemini-2.5-Pro} e \textit{Qwen2.5-VL-72B}) para garantir consistência e reprodutibilidade nos resultados.

Os resultados empíricos demonstraram alta correlação entre a avaliação automatizada e o julgamento humano, com até 90,95\% de concordância par a par e 94,4\% de consistência de ranqueamento com o \textit{WebDev Arena}, um \textit{benchmark} baseado em votação humana. Modelos generalistas, como o \textit{Gemini-2.5-Pro} e o \textit{Claude 4.0-Sonnet}, apresentaram desempenho superior aos modelos especializados em código, evidenciando que a geração de artefatos visuais exige uma combinação equilibrada de raciocínio, instrução e senso de design.

\subsection{Métricas Contemporâneas de Avaliação}

A nova geração de \textit{benchmarks} e estudos de desempenho sugere a necessidade de múltiplas métricas complementares para avaliar o verdadeiro impacto dos modelos generativos na engenharia de software. Entre as principais, destacam-se:

\begin{itemize}
\item \textbf{Fidelidade Visual (\textit{Visual Fidelity})}: mede o quanto a aparência e o layout da interface gerada correspondem à especificação desejada, garantindo coerência estética e funcional.
\item \textbf{Interatividade}: avalia o comportamento dinâmico dos componentes, verificando se os eventos de interface (cliques, transições, animações) funcionam conforme o esperado.
\item \textbf{Acessibilidade}: mensura a conformidade com os padrões \textit{WCAG 2.2} e \textit{WAI-ARIA}, incluindo métricas objetivas como a \textit{inaccessibility rate} — porcentagem de violações detectadas automaticamente \cite{humanorllm2024}.
\item \textbf{Segurança}: analisa vulnerabilidades utilizando classificações da \sigla{CWE}{\textit{Common Weakness Enumeration}}, abrangendo falhas de injeção, autenticação e gerenciamento de memória \cite{securityquality2024}.
\item \textbf{Usabilidade e Experiência do Usuário (\textit{UX Metrics})}: inclui medidas de carga cognitiva, eficiência e satisfação, podendo ser avaliadas por escalas como o \textit{System Usability Scale (SUS)} ou o \textit{NASA-TLX} \cite{viebahn2025uxgrid}.
\end{itemize}

Além dessas métricas individuais, há um crescente interesse em índices compostos que combinam indicadores técnicos e perceptuais. Propostas recentes, como o \textit{CPHAI-DA} (Consistência de Padrões de Interação Humano–IA no Design) e o \textit{CPHAI-CU} (Consistência entre Usuários), visam avaliar a coerência entre diferentes interações geradas por IA, buscando medir a estabilidade da experiência entre múltiplos usuários.

\subsection{Reprodutibilidade e Avaliação Automatizada}

A reprodutibilidade é uma preocupação central nos estudos de avaliação com LLMs \cite{evalguidelines2024}. O uso de modelos de código fechado dificulta a comparação entre resultados, uma vez que as versões dos modelos e as janelas de contexto variam. Assim, recomenda-se que todos os experimentos documentem claramente os \textit{prompts} utilizados, as condições de teste e o conjunto de dados, além de incluírem um modelo aberto como linha de base.

O \textit{ArtifactsBench} e o \textit{FeedA11y} exemplificam essa prática, ao adotar metodologias reproduzíveis e pipelines automatizados que reduzem o viés humano na avaliação. Essa automatização não elimina a necessidade de validação qualitativa, mas proporciona um ponto de partida padronizado para análises comparativas.

\subsection{Síntese da Seção}

A revisão da literatura evidencia um movimento em direção a uma avaliação mais holística e multimodal dos sistemas generativos. O foco desloca-se da simples precisão funcional para uma análise integrada da qualidade do artefato gerado — considerando aspectos de acessibilidade, segurança, estética e experiência do usuário.

Esse novo paradigma de avaliação reforça a ideia de que o sucesso dos LLMs na engenharia de software não depende apenas da capacidade de gerar código funcional, mas da sua habilidade em criar produtos coerentes, utilizáveis e inclusivos. A consolidação de \textit{benchmarks} modernos como o \textit{ArtifactsBench} representa, portanto, um passo essencial para a maturidade científica da área.

\section{Lacunas e Direcionamentos de Pesquisa}
\label{sec:lacunas-direcionamentos}

A análise da literatura sobre a aplicação de \sigla{LLMs}{\textit{Large Language Models}} na engenharia de software evidencia um campo em rápida evolução, cuja velocidade de inovação técnica tem superado o ritmo de consolidação científica. A expansão das capacidades desses modelos — que agora vão além da geração de código estático para a criação de artefatos complexos, interativos e multimodais — expôs lacunas significativas em três dimensões: metodológica, empírica e avaliativa. Esta seção sintetiza os principais desafios e oportunidades identificados na literatura recente, delineando direções para pesquisas futuras.

\subsection{Falta de Avaliação Empírica sobre \textit{Prompting Guiado} na Geração de Interfaces}

Apesar do grande volume de estudos sobre geração de código e sobre técnicas de \textit{prompt engineering}, há uma notável escassez de experimentos que combinem essas áreas no contexto da geração de interfaces de usuário acessíveis e consistentes. Trabalhos como \citeonline{partnering2024} e \citeonline{humanorllm2024} investigam separadamente os efeitos da co-criação humano–IA e da geração acessível, mas poucos estudos avaliam de forma empírica o impacto de diferentes modos de interação — como o \textit{prompt direto} versus o \textit{wizard guiado} — sobre a qualidade, a acessibilidade e a usabilidade dos artefatos produzidos.

Essa lacuna sugere uma oportunidade relevante para experimentos controlados que testem empiricamente como o desenho da interação com o modelo influencia resultados técnicos e perceptuais. A avaliação de parâmetros como tempo de geração, taxa de sucesso em testes automatizados, conformidade com diretrizes \sigla{WCAG}{\textit{Web Content Accessibility Guidelines}} e percepção subjetiva de usabilidade pode fornecer evidências concretas para o aprimoramento de fluxos de trabalho de \textit{prompting estruturado} em contextos de engenharia de software.

\subsection{Ausência de Padronização em Métricas de Avaliação}

A diversidade de métricas atualmente utilizadas na avaliação de código e interfaces geradas por IA — como fidelidade visual, interatividade, acessibilidade, segurança e experiência do usuário (\textit{UX}) — indica um estado de fragmentação metodológica. Estudos baseados em \textit{benchmarks} clássicos, como o \textit{HumanEval} \cite{chen2021codex} e o \textit{SWE-bench} \cite{jimenez2023swebench}, avaliam apenas a correção funcional; já pesquisas mais recentes, como o \textit{ArtifactsBench} \cite{artifactsbench2025} e o \textit{FeedA11y} \cite{humanorllm2024}, introduzem dimensões complementares, mas ainda sem consenso sobre critérios comparativos.

Essa falta de padronização dificulta a comparação entre estudos e a replicação dos resultados. Conforme discutido em \citeonline{evalguidelines2024}, a comunidade de pesquisa deve avançar para a criação de \textit{benchmark suites} integradas, que unifiquem diferentes dimensões de qualidade e forneçam um quadro comparativo consistente. Essa integração é essencial para consolidar uma base empírica robusta, garantindo a validade e a reprodutibilidade das análises sobre o desempenho de LLMs na engenharia de software.

\subsection{Oportunidades de Experimentação Controlada e Reprodutível}

Outro ponto crítico identificado na literatura é a carência de experimentos controlados que isolem variáveis e permitam análises causais. Estudos de referência, como o \textit{Partnering with Generative AI} \cite{partnering2024} e o \textit{ArtifactsBench} \cite{artifactsbench2025}, demonstram que a adoção de desenhos experimentais reprodutíveis — com protocolos detalhados, métricas padronizadas e validação cruzada por humanos — é fundamental para o avanço da área.

A integração de princípios de engenharia experimental, como controle de variáveis, amostragem balanceada e uso de modelos abertos como linha de base, deve se tornar prática comum em pesquisas envolvendo LLMs \cite{evalguidelines2024}. Além disso, a publicação de \textit{datasets} e \textit{pipelines} de avaliação abertos permitirá que a comunidade científica reproduza resultados, promovendo um ecossistema de transparência e progresso cumulativo.

\subsection{Perspectivas Futuras}

Com base nas lacunas identificadas, as principais direções de pesquisa para o futuro incluem:

\begin{itemize}
\item \textbf{Integração entre Interação e Avaliação:} desenvolver estudos que unam os campos de \textit{human–AI interaction} e geração de código, explorando o impacto do \textit{prompting guiado} sobre a qualidade e a previsibilidade dos artefatos produzidos.
\item \textbf{Unificação de Métricas e \textit{Benchmarks}:} propor \textit{frameworks} padronizados que combinem métricas técnicas (como segurança e fidelidade visual) e perceptuais (como usabilidade e satisfação).
\item \textbf{Experimentação Multimodal e Reprodutível:} adotar metodologias inspiradas em \textit{benchmarks} modernos, como o \textit{ArtifactsBench}, que conciliem avaliação automatizada e validação qualitativa por especialistas.
\item \textbf{Integração com Ambientes de Desenvolvimento Reais:} aplicar essas metodologias a fluxos de trabalho reais de engenharia de software, envolvendo plataformas de versionamento, testes contínuos e colaboração entre desenvolvedores e sistemas generativos.
\end{itemize}

\subsection{Síntese da Seção}

Em síntese, o estado atual da pesquisa demonstra avanços notáveis, mas também evidencia a necessidade de amadurecimento científico. A consolidação de métricas padronizadas, a realização de experimentos controlados e o aprofundamento de estudos sobre interação humano–IA são passos indispensáveis para que a aplicação de modelos generativos na engenharia de software evolua de uma fase exploratória para uma prática consolidada e mensurável.

Essas direções formam a base conceitual para o experimento desenvolvido neste trabalho, que busca justamente preencher uma das lacunas identificadas: a ausência de estudos empíricos sobre o impacto do \textit{prompting guiado} e da \textit{engenharia de contexto} na geração automatizada de interfaces web.

\section{Considerações Finais}
\label{sec:consideracoes-finais}

A revisão da literatura apresentada neste capítulo consolidou os fundamentos teóricos e as contribuições mais recentes sobre o uso de \sigla{LLMs}{\textit{Large Language Models}} na engenharia de software, com foco especial nas técnicas de \textit{Engenharia de Contexto}, \textit{Engenharia de Prompt} e \textit{Recuperação Aumentada} (\sigla{RAG}{\textit{Retrieval-Augmented Generation}}). Os estudos analisados demonstram que a integração entre esses elementos representa um avanço substancial na capacidade dos modelos de gerar código, compreender dependências complexas e adaptar-se a contextos específicos de desenvolvimento.

Verificou-se que a evolução dos modelos generativos, especialmente após a adoção da arquitetura \textit{Transformer}, permitiu o salto qualitativo necessário para aplicações práticas em engenharia de software, tornando possível a geração de artefatos complexos — desde funções e componentes modulares até interfaces completas e interativas. No entanto, a literatura também evidencia que a simples adoção de LLMs não é suficiente: a qualidade dos resultados depende fortemente da estruturação contextual, da clareza dos \textit{prompts} e da incorporação de conhecimento externo, fatores diretamente abordados pelas técnicas de \textit{prompting} avançado e pela \textit{Engenharia de Contexto}.

A análise das abordagens de \textit{Recuperação Aumentada (RAG)} e dos protocolos emergentes, como o \textit{Model Context Protocol (MCP)}, evidenciou uma tendência clara em direção à contextualização dinâmica, permitindo que modelos generativos acessem e utilizem conhecimento atualizado, mitigando limitações inerentes ao aprendizado estático. Essa integração entre recuperação e geração redefine a fronteira entre sistemas determinísticos e modelos generativos, posicionando os LLMs como agentes de raciocínio contextual dentro do ciclo de engenharia de software.

No campo da \textit{Engenharia de Requisitos}, observou-se uma convergência conceitual com o \textit{prompting} estruturado: a comunicação iterativa entre usuário e modelo se assemelha aos processos tradicionais de elicitação e validação de requisitos, mas com novas implicações cognitivas e operacionais. O paradigma \textit{wizard}, historicamente utilizado para reduzir a carga cognitiva em tarefas complexas, ressurge como um modelo eficaz de interação humano–IA, oferecendo maior previsibilidade e controle sobre os resultados.

Os estudos sobre interação humano–IA reforçam que a colaboração efetiva não é apenas uma questão técnica, mas também cognitiva: os modos de co-criação e reflexão (\textit{prompting reflexivo}, \textit{ReAct}, \textit{wizard prompting}) permitem equilibrar automação e autoria, garantindo que a IA atue como amplificadora do raciocínio humano — e não como sua substituta. Essa perspectiva alinha-se à visão emergente da IA como \textit{thought partner}, um assistente de raciocínio que potencializa a capacidade criativa e analítica do engenheiro.

Em relação às métricas e \textit{benchmarks}, a literatura evidencia um movimento de transição dos indicadores tradicionais, focados apenas em correção funcional, para abordagens multimodais que avaliam fidelidade visual, acessibilidade, segurança e experiência do usuário. Ferramentas como o \textit{ArtifactsBench} e o \textit{FeedA11y} introduzem protocolos de avaliação automatizada e reproduzível, essenciais para mensurar de forma holística o desempenho de modelos generativos em contextos reais de engenharia.

Por fim, as lacunas identificadas — especialmente a ausência de estudos empíricos sobre \textit{prompting guiado} e geração de interfaces acessíveis — indicam a necessidade de experimentos controlados que validem, com rigor metodológico, o impacto das diferentes estratégias de interação na qualidade dos artefatos gerados. Essa lacuna motiva diretamente o desenvolvimento do estudo de caso proposto neste trabalho, que busca investigar empiricamente o papel da estruturação contextual e do \textit{wizard prompting} na geração automatizada de interfaces web.

Em síntese, a revisão demonstra que a integração entre técnicas de \textit{Engenharia de Contexto}, \textit{Recuperação Aumentada} e \textit{Prompting Estruturado} constitui o alicerce conceitual da próxima geração de ferramentas de desenvolvimento assistido por IA. Esses fundamentos sustentam o experimento desenvolvido nos capítulos seguintes, cujo objetivo é avaliar, de forma quantitativa e qualitativa, como a estruturação da interação entre humano e modelo pode aprimorar a acessibilidade, a consistência e a previsibilidade na geração de código front-end.
