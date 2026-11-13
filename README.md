# PasseNoATS — Otimizador Inteligente de Currículos para Triagem Automática

Aplicação web desenvolvida para comparar currículos com descrições de vagas e gerar uma versão otimizada (*ATS-Friendly*), aumentando a compatibilidade com softwares de recrutamento sem inventar experiências. Projeto construído durante o bootcamp **Santander - Construa seu primeiro App com IA** (DIO) utilizando **Lovable**, **React**, **Tailwind CSS** e **shadcn/ui**.

🔗 **Aplicação publicada:** https://passenoats.lovable.app/

---

## 1. Qual problema a aplicação resolve?
* **A Dor:** Muitos profissionais qualificados são reprovados automaticamente antes mesmo de um recrutador humano avaliar o perfil, pois os sistemas **ATS (*Applicant Tracking System*)** filtram e ranqueiam candidatos pela presença literal de palavras-chave técnicas e termos da descrição da vaga.
* **A Solução:** O **PasseNoATS** diagnostica a aderência semântica entre o currículo e a vaga, aponta exatamente quais termos já estão presentes e quais estão ausentes, e reestrutura o texto do candidato para destacar suas qualificações reais na linguagem esperada pelo algoritmo.
* **Regra de Ouro (Compromisso Ético na UI):** A interface exibe um alerta permanente garantindo que a IA melhora a apresentação e o encaixe das palavras-chave, **mas nunca inventa experiências, cargos ou habilidades que o candidato não possui**.

---

## 2. Como a análise funciona (da vaga colada até o currículo ajustado)
1. **Entrada de Dados:** O usuário insere a *Descrição da Vaga* e o *Currículo Atual* em dois campos lado a lado (validados via Zod).
2. **Processamento Semântico (Backend / Server Function):** Ao acionar a análise, uma *Server Function* (`analyzeResume`) envia os textos para o **Lovable AI Gateway** com um *system prompt* restrito e schema estruturado.
3. **Cálculo e Diagnóstico:**
   * **Match Score (0% a 100%):** Indicador visual circular e barra de progresso que mudam de cor conforme a compatibilidade.
   * **Análise de Palavras-Chave:** Separação visual via `Badges` entre *Palavras Encontradas* (verde) e *Palavras Faltando* (vermelho/âmbar).
4. **Reescrita Fiel e Exportação:** A IA reorganiza o resumo profissional, competências técnicas e projetos reais do candidato em formato de folha limpa, permitindo copiar o texto com um clique ou exportar diretamente em **PDF** via CSS de impressão (`@media print`).

---

## 3. Mega Prompt Utilizado e Evolução até a Versão Final

### Mega Prompt Inicial (Modo Plan)
```text
Atue como um Desenvolvedor Frontend Sênior especializado em React, Tailwind CSS e `shadcn/ui`. Crie uma aplicação web completa (SPA) chamada "PasseNoATS", um otimizador inteligente de currículos para sistemas de triagem automática.

**REGRAS DE DESIGN E UI:**
- Utilize os componentes do `shadcn/ui` (Cards, Buttons, Textareas, Badges, Progress/Gauges).
- Paleta de cores: Clean, confiável e corporativa. Fundo neutro (Slate 50), textos escuros (Slate 900). Ações principais e indicativos de sucesso em Emerald (Verde) e Indigo (Azul).
- **REGRA DE OURO NA UI:** Abaixo do cabeçalho principal, exiba um banner ou alerta (Alert do shadcn) permanente e bem visível dizendo: "Nosso compromisso: A IA otimiza o uso de palavras-chave e a apresentação do seu currículo para os robôs, mas NUNCA inventa experiências, cargos ou habilidades que você não possui."

**ESTRUTURA E FUNCIONALIDADES:**

1. **Entrada de Dados (Input):**
- Layout com dois campos de texto grandes (Textareas) lado a lado em desktop (empilhados em mobile).
- Campo 1: "Cole a Descrição da Vaga".
- Campo 2: "Cole seu Currículo Atual".
- Um botão de ação principal: "Analisar e Otimizar para ATS" (com estado visual de carregamento).

2. **Motor de Análise (Lovable AI / Backend):**
- Ao clicar no botão, utilize a integração nativa de IA da plataforma para comparar os dois textos. A IA deve retornar uma estrutura com:
  - `score`: Porcentagem de match (0 a 100).
  - `foundKeywords`: Array com palavras-chave da vaga encontradas no currículo.
  - `missingKeywords`: Array com palavras-chave importantes da vaga que estão ausentes.
  - `optimizedResume`: O texto do currículo reescrito e formatado, incorporando os termos que faltavam de forma natural nas experiências que o candidato já relatou (sem alucinar dados novos).

3. **Dashboard de Resultados (Abaixo do Input):**
- **Match Score:** Um indicador visual em destaque (ex: barra de progresso grossa ou indicador circular) mostrando a nota.
- **Análise Semântica:** Duas sessões visuais utilizando `Badges` (tags). Uma área com tags verdes para "Palavras Encontradas" e outra com tags vermelhas/amarelas para "Palavras Faltando".
- **O Novo Currículo:** Um painel ou Card exibindo a versão `optimizedResume` gerada, formatada com quebras de linha para leitura fácil.

4. **Ações de Exportação:**
- Abaixo do currículo gerado, inclua dois botões (usando ícones Lucide):
  - "Copiar Texto": Copia o conteúdo otimizado para a área de transferência e exibe um toast de sucesso (Sonner).
  - "Salvar em PDF": Aciona um `window.print()`. IMPORTANTE: Configure o CSS com `@media print` para que, ao imprimir, o navegador oculte os botões, cabeçalhos, inputs e badges, renderizando EXCLUSIVAMENTE a folha do currículo otimizado em fundo branco, pronta para salvar como PDF.

Gere o código completo, responsivo e pronto para uso.
```

### Decisões de Arquitetura e Refinamentos
* **Planejamento Prévio (Modo Plan):** Antes de gerar o código, a especificação foi revisada no modo *Plan* para garantir que a chamada de IA ocorresse no servidor (sem expor chaves no frontend) e sem persistência em banco de dados, preservando a privacidade dos documentos dos usuários.
* **Exportação em PDF integrada desde a v1:** A regra `@media print` isolando o container `#resume-sheet` foi incorporada na primeira geração para entregar uma folha A4 limpa sem consumo extra de créditos de iteração.
* **Validação da Trava Anti-Alucinação:** Em testes práticos, verificou-se que quando um termo exigido na vaga não consta no currículo original (ex: *TypeScript* ou *OpenAI*), a aplicação sinaliza a ausência nos badges, mas **não** adiciona a tecnologia fictícia no currículo reescrito.

---

## 4. Evidências da Aplicação e Exemplo de Uso (Screenshots)

### 1. Tela Inicial e Entrada de Dados (Vaga vs. Currículo)
![Tela Inicial PasseNoATS](COLE_AQUI_O_PRINT_DA_TELA_INICIAL)

### 2. Dashboard de Análise (Match Score e Palavras-Chave)
![Match Score e Badges](COLE_AQUI_O_PRINT_DO_MATCH_SCORE)

### 3. Currículo Otimizado e Exportação em PDF
![Currículo Otimizado](COLE_AQUI_O_PRINT_DO_CURRICULO_GERADO)
