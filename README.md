# Passenoats

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

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://passenoats.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9f36982a-0bde-4ee2-9026-26a9f104780b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
