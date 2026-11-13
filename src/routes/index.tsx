import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2, Copy, FileDown, FileText, Briefcase, Loader2, ShieldCheck, Sparkles, XCircle, Target,
} from "lucide-react";
import { analyzeResume, type AnalysisResult } from "@/lib/analyze.functions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PasseNoATS — Otimizador de currículos para ATS" },
      { name: "description", content: "Compare seu currículo com a vaga, veja o match e receba uma versão otimizada para robôs de triagem — sem inventar nada." },
      { property: "og:title", content: "PasseNoATS — Passe na triagem automática" },
      { property: "og:description", content: "Match score, palavras-chave e currículo otimizado para ATS com IA honesta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function scoreTone(score: number) {
  if (score >= 75) return { text: "text-success", stroke: "stroke-success", label: "Excelente match" };
  if (score >= 50) return { text: "text-warning", stroke: "stroke-warning", label: "Match moderado" };
  return { text: "text-destructive", stroke: "stroke-destructive", label: "Match baixo" };
}

function ScoreRing({ score }: { score: number }) {
  const r = 54, c = 2 * Math.PI * r, tone = scoreTone(score);
  return (
    <div className="relative size-40 shrink-0">
      <svg viewBox="0 0 128 128" className="size-full -rotate-90">
        <circle cx="64" cy="64" r={r} className="fill-none stroke-muted" strokeWidth="12" />
        <circle cx="64" cy="64" r={r} className={cn("fill-none transition-all duration-1000", tone.stroke)}
          strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (score / 100) * c} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-display text-4xl font-bold", tone.text)}>{score}%</span>
        <span className="text-xs text-muted-foreground">match</span>
      </div>
    </div>
  );
}

function Index() {
  const analyze = useServerFn(analyzeResume);
  const [job, setJob] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const canSubmit = job.trim().length >= 20 && resume.trim().length >= 50 && !loading;

  async function onAnalyze() {
    setLoading(true);
    try {
      const res = await analyze({ data: { job, resume } });
      if (!res.ok) { toast.error(res.error); return; }
      setResult(res.result);
      setTimeout(() => document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      toast.error("Não foi possível analisar. Verifique os textos e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.optimizedResume);
    toast.success("Currículo copiado para a área de transferência!");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="no-print border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-brand text-primary-foreground">
            <Target className="size-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight">PasseNoATS</h1>
            <p className="text-sm text-muted-foreground">Otimizador inteligente de currículos para triagem automática</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <Alert className="no-print border-success/40 bg-success-soft text-foreground">
          <ShieldCheck className="size-5 text-success" />
          <AlertTitle className="font-semibold">Nosso compromisso</AlertTitle>
          <AlertDescription className="text-foreground/80">
            A IA otimiza o uso de palavras-chave e a apresentação do seu currículo para os robôs, mas NUNCA inventa experiências, cargos ou habilidades que você não possui.
          </AlertDescription>
        </Alert>

        <section className="no-print space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Briefcase className="size-4 text-primary" />Cole a Descrição da Vaga</CardTitle>
                <CardDescription>Requisitos, responsabilidades e diferenciais.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea value={job} onChange={(e) => setJob(e.target.value)} placeholder="Ex.: Buscamos Analista de Dados com experiência em SQL, Power BI..." className="min-h-[320px] resize-y" />
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><FileText className="size-4 text-primary" />Cole seu Currículo Atual</CardTitle>
                <CardDescription>Texto completo: resumo, experiências, formação.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Cole aqui o conteúdo do seu currículo..." className="min-h-[320px] resize-y" />
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-center">
            <Button size="lg" onClick={onAnalyze} disabled={!canSubmit} className="h-12 bg-brand px-8 text-base shadow-card hover:opacity-90">
              {loading ? <><Loader2 className="animate-spin" />Analisando seu currículo...</> : <><Sparkles />Analisar e Otimizar para ATS</>}
            </Button>
          </div>
        </section>

        {result && (
          <section id="resultados" className="space-y-6">
            <Card className="no-print shadow-card">
              <CardContent className="flex flex-col items-center gap-6 pt-6 sm:flex-row">
                <ScoreRing score={result.score} />
                <div className="w-full space-y-3">
                  <h2 className="font-display text-2xl font-bold">Match Score</h2>
                  <p className={cn("font-medium", scoreTone(result.score).text)}>{scoreTone(result.score).label}</p>
                  <Progress value={result.score} className="h-4" />
                  <p className="text-sm text-muted-foreground">Compatibilidade do seu currículo original com as palavras-chave da vaga.</p>
                </div>
              </CardContent>
            </Card>

            <div className="no-print grid gap-6 md:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base"><CheckCircle2 className="size-4 text-success" />Palavras Encontradas ({result.foundKeywords.length})</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {result.foundKeywords.length ? result.foundKeywords.map((k) => (
                    <Badge key={k} variant="outline" className="border-success/30 bg-success-soft text-success">{k}</Badge>
                  )) : <p className="text-sm text-muted-foreground">Nenhuma encontrada.</p>}
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base"><XCircle className="size-4 text-destructive" />Palavras Faltando ({result.missingKeywords.length})</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {result.missingKeywords.length ? result.missingKeywords.map((k, i) => (
                    <Badge key={k} variant="outline" className={i % 2 ? "border-warning/30 bg-warning-soft text-warning" : "border-destructive/30 bg-danger-soft text-destructive"}>{k}</Badge>
                  )) : <p className="text-sm text-muted-foreground">Nada faltando — ótimo!</p>}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="no-print flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">O Novo Currículo</h2>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Otimizado para ATS</Badge>
              </div>
              <article id="resume-sheet" className="mx-auto max-w-[210mm] whitespace-pre-wrap rounded-lg border bg-card p-8 text-[15px] leading-relaxed text-card-foreground shadow-card sm:p-12 font-sans">
                {result.optimizedResume}
              </article>
              <div className="no-print flex flex-wrap justify-center gap-3">
                <Button variant="outline" size="lg" onClick={copy}><Copy />Copiar Texto</Button>
                <Button size="lg" onClick={() => window.print()} className="bg-success text-success-foreground hover:bg-success/90"><FileDown />Salvar em PDF</Button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
