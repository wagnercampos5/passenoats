import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  job: z.string().trim().min(20, "Descrição da vaga muito curta").max(15000),
  resume: z.string().trim().min(50, "Currículo muito curto").max(20000),
});

const resultSchema = z.object({
  score: z.number(),
  foundKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  optimizedResume: z.string(),
});

export type AnalysisResult = z.infer<typeof resultSchema>;

const SYSTEM = `Você é um especialista em sistemas ATS (Applicant Tracking Systems) e recrutamento no Brasil.
Compare a descrição da vaga com o currículo do candidato e responda em português.
- score: inteiro de 0 a 100 indicando o match de palavras-chave e requisitos.
- foundKeywords: palavras-chave/competências importantes da vaga presentes no currículo (máx. 25).
- missingKeywords: palavras-chave importantes da vaga ausentes no currículo (máx. 25).
- optimizedResume: o currículo reescrito em texto puro, bem estruturado (seções em MAIÚSCULAS, bullets com "•", quebras de linha), usando a terminologia da vaga.
REGRA ABSOLUTA: NUNCA invente experiências, cargos, empresas, datas, formações, certificações ou habilidades. Só incorpore um termo ausente quando ele descrever com fidelidade algo que o candidato já relatou (ex.: sinônimo ou nomenclatura equivalente). Termos sem respaldo no currículo original devem ficar de fora.`;

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; result: AnalysisResult } | { ok: false; error: string }> => {
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) return { ok: false, error: "Serviço de IA não configurado." };
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText, Output } = await import("ai");
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        system: SYSTEM,
        maxRetries: 0,
        messages: [
          { role: "user", content: `DESCRIÇÃO DA VAGA:\n${data.job}\n\nCURRÍCULO ATUAL:\n${data.resume}` },
        ],
        output: Output.object({ schema: resultSchema }),
        providerOptions: {
          openai: {
            store: false,
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const out = await result.output;
      return {
        ok: true,
        result: { ...out, score: Math.max(0, Math.min(100, Math.round(out.score))) },
      };
    } catch (e: any) {
      console.error("analyzeResume error", e);
      const status = e?.statusCode ?? e?.cause?.statusCode;
      if (status === 429) return { ok: false, error: "Muitas solicitações. Aguarde um momento e tente novamente." };
      if (status === 402) return { ok: false, error: "Créditos de IA esgotados. Adicione créditos ao workspace para continuar." };
      if (status === 403) return { ok: false, error: "Acesso à IA bloqueado para este workspace." };
      return { ok: false, error: "Não foi possível analisar agora. Tente novamente." };
    }
  });
