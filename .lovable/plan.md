# PasseNoATS — Otimizador de currículos para ATS

## O que será construído
Página única em `/` (português), visual corporativo: fundo Slate 50, texto Slate 900, ações em Emerald e Indigo.

1. **Cabeçalho** com logo/nome "PasseNoATS" e subtítulo.
2. **Alerta permanente** (Alert shadcn) com o texto exato do compromisso: a IA nunca inventa experiências, cargos ou habilidades.
3. **Entrada**: dois Textareas grandes lado a lado no desktop, empilhados no celular — "Cole a Descrição da Vaga" e "Cole seu Currículo Atual". Botão "Analisar e Otimizar para ATS" com spinner durante a análise; desabilitado se algum campo estiver vazio.
4. **Resultados** (aparecem abaixo após a análise):
   - Match Score: indicador circular grande + barra de progresso, cor muda conforme a nota (vermelho/âmbar/verde).
   - Palavras Encontradas (badges verdes) e Palavras Faltando (badges âmbar/vermelhas).
   - Card "Seu Novo Currículo" com o texto otimizado preservando quebras de linha, estilo folha A4.
5. **Exportação**: "Copiar Texto" (toast de sucesso) e "Salvar em PDF" (impressão). No modo impressão só a folha do currículo aparece, em fundo branco.
6. Mensagens de erro claras (ex.: limite de uso de IA atingido).

## Detalhes técnicos
- Ativar Lovable Cloud para a chave da IA (sem banco de dados, nada é salvo).
- Server function `analyzeResume` (createServerFn) chamando o Lovable AI Gateway via AI SDK (`openai/gpt-6-astra`, Responses API, streaming consumido no servidor) com saída estruturada em schema estrito: `score`, `foundKeywords`, `missingKeywords`, `optimizedResume`. Prompt do sistema proíbe inventar dados; termos ausentes só entram se sustentados pelo currículo original.
- Validação com zod (tamanho máximo de entrada).
- Componentes: Card, Button, Textarea, Badge, Progress, Alert, Sonner (`<Toaster />` no root).
- Tokens de cor em `src/styles.css` (oklch) e bloco `@media print` que oculta tudo exceto `#resume-sheet`.
- Fonte distinta via `<link>` no root; head() com título/descrição em português.
