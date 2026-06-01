import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { ArrowLeft, ClipboardCheck, LineChart as LineChartIcon, Loader2 } from "lucide-react";

import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCandidateColor } from "@/lib/candidateColors";
import { buildSmoothedPollTrend, getPolls2022Round1 } from "@/lib/api/pollsApi";

const DEFAULT_VISIBLE = new Set(["macron", "le_pen", "melenchon", "zemmour", "pecresse"]);

function colorForPollCandidate(label: string, index: number): string {
  const parts = label.trim().split(/\s+/);
  if (parts.length < 2) return getCandidateColor("", label, index);
  const nom = parts.pop()!;
  const prenom = parts.join(" ");
  return getCandidateColor(prenom, nom, index);
}

const WINDOW_OPTIONS = [
  { value: "7", label: "7 jours" },
  { value: "10", label: "10 jours" },
  { value: "14", label: "14 jours" },
];

export default function AnalysePage() {
  const [visible, setVisible] = useState<Set<string>>(() => new Set(DEFAULT_VISIBLE));
  const [windowDays, setWindowDays] = useState(10);

  const { data: dataset, isLoading, isError } = useQuery({
    queryKey: ["polls", "2022", "t1"],
    queryFn: getPolls2022Round1,
    staleTime: 60 * 60 * 1000,
  });

  const candidateIds = useMemo(() => (dataset ? dataset.candidates.map((c) => c.id) : []), [dataset]);

  const chartData = useMemo(() => {
    if (!dataset) return [];
    const ids = candidateIds.filter((id) => visible.has(id));
    if (ids.length === 0) return [];
    return buildSmoothedPollTrend(dataset, ids, windowDays);
  }, [dataset, candidateIds, visible, windowDays]);

  const toggleCandidate = (id: string, checked: boolean) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Sondages présidentielle 2022 — 1er tour"
        description="Chronologie des intentions de vote au 1er tour (mars–avril 2022) : courbes lissées à partir des sondages publiés après la liste officielle des candidats."
        path="/analyse"
      />
      <JsonLd path="/analyse" breadcrumbs={[{ name: "Sondages 2022", path: "/analyse" }]} />
      <SiteHeader />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 text-primary mb-2">
            <LineChartIcon className="h-8 w-8" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-widest">Sondages · 2022</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground tracking-tight mb-3">
            Chronologie des sondages — 1er tour
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed space-y-3">
            <span className="block">
              <strong className="text-foreground">Présidentielle 2022</strong>,{" "}
              <strong className="text-foreground">1er tour</strong> (10 avril). Période : du 7 mars au 10 avril, comme le
              tableau «&nbsp;Official campaign&nbsp;» sur Wikipédia (en) — pas le graphique LOESS 2021–2022.
            </span>
            <span className="block">
              Chaque point du graphique est une <strong className="text-foreground">moyenne pondérée</strong> des sondages
              dont la fin de terrain tombe dans les{" "}
              <strong className="text-foreground">{windowDays} derniers jours</strong> (poids = taille d&apos;échantillon
              si connue). Ce n&apos;est pas une LOESS : les formes peuvent différer du grand graphique Wikipédia.
            </span>
          </p>
        </header>

        <div className="space-y-8 max-w-5xl mx-auto">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              Chargement des sondages…
            </div>
          )}

          {isError && (
            <p className="text-destructive text-center py-12">Impossible de charger les sondages. Réessayez plus tard.</p>
          )}

          {dataset && (
            <>
              <Card className="border-primary/15 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">Intentions de vote agrégées — 2022, 1er tour</CardTitle>
                      <CardDescription className="mt-1">{dataset.meta.tableNote}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-1.5 w-full sm:w-[200px]">
                      <Label htmlFor="poll-window" className="text-xs text-muted-foreground">
                        Fenêtre de lissage
                      </Label>
                      <Select value={String(windowDays)} onValueChange={(v) => setWindowDays(Number(v))}>
                        <SelectTrigger id="poll-window" className="border-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {WINDOW_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {chartData.length > 0 && visible.size > 0 ? (
                    <div className="h-[340px] sm:h-[420px] w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                          <XAxis
                            dataKey="labelShort"
                            tick={{ fontSize: 11 }}
                            interval="preserveStartEnd"
                            className="text-muted-foreground"
                          />
                          <YAxis
                            domain={[0, 36]}
                            tick={{ fontSize: 11 }}
                            width={36}
                            tickFormatter={(v) => `${v}%`}
                            className="text-muted-foreground"
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "8px",
                              border: "1px solid hsl(var(--border))",
                              background: "hsl(var(--card))",
                            }}
                            labelFormatter={(_, payload) => {
                              const row = payload?.[0]?.payload as { date?: string } | undefined;
                              return row?.date
                                ? new Date(`${row.date}T12:00:00.000Z`).toLocaleDateString("fr-FR", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                : "";
                            }}
                            formatter={(value, name) =>
                              typeof value === "number" ? [`${value}%`, name] : [String(value ?? ""), name]
                            }
                          />
                          <Legend wrapperStyle={{ fontSize: "12px" }} />
                          {(() => {
                            const electionTick = chartData.find((r) => r.date === dataset.meta.electionDate)?.labelShort;
                            return electionTick ? (
                              <ReferenceLine
                                x={electionTick}
                                stroke="hsl(var(--muted-foreground))"
                                strokeDasharray="4 4"
                                label={{
                                  value: "1er tour",
                                  position: "top",
                                  fill: "hsl(var(--muted-foreground))",
                                  fontSize: 11,
                                }}
                              />
                            ) : null;
                          })()}
                          {dataset.candidates
                            .map((c, index) => ({ ...c, index }))
                            .filter((c) => visible.has(c.id))
                            .map((c) => (
                              <Line
                                key={c.id}
                                type="monotone"
                                dataKey={c.id}
                                name={c.label}
                                stroke={colorForPollCandidate(c.label, c.index)}
                                strokeWidth={2}
                                dot={false}
                                connectNulls
                              />
                            ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
                      Cochez au moins un candidat pour afficher les courbes.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Candidats affichés</CardTitle>
                  <CardDescription>Affinez le graphique en sélectionnant les courbes à comparer.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {dataset.candidates.map((c, index) => (
                      <div key={c.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`cand-${c.id}`}
                          checked={visible.has(c.id)}
                          onCheckedChange={(ch) => toggleCandidate(c.id, ch === true)}
                        />
                        <Label
                          htmlFor={`cand-${c.id}`}
                          className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: colorForPollCandidate(c.label, index) }}
                            aria-hidden
                          />
                          {c.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                      <ClipboardCheck className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Promesses de campagne vs bilan réel</CardTitle>
                      <CardDescription className="mt-1">
                        Mandat <strong className="text-foreground">2017-2022</strong> : exemples d’engagements du
                        programme de 2017 et synthèse de mise en œuvre, avec liens vers la presse de référence (Les
                        Décodeurs, franceinfo, LCP…). Ce n’est pas un jugement officiel.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link
                    to="/promesses-bilan"
                    className="inline-flex text-sm font-semibold text-primary hover:underline underline-offset-4"
                  >
                    Ouvrir le comparatif promesses / bilan →
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-muted/30 border-dashed">
                <CardHeader>
                  <CardTitle className="text-base">Sources &amp; méthode</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                  <p>
                    Les pourcentages par ligne de sondage reprennent le tableau «&nbsp;Official campaign&nbsp;» (section
                    2022) de la page Wikipédia anglophone — pas le graphique «&nbsp;Graphical summary&nbsp;» en tête de page,
                    qui est une régression locale (LOESS) sur une période et une base de sondages plus larges. Ce n&apos;est
                    pas une moyenne publiée par un institut&nbsp;: c&apos;est une agrégation à des fins pédagogiques.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    {dataset.meta.sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {s.label}
                        </a>
                        {s.license ? <span className="block text-xs mt-0.5 opacity-90">{s.license}</span> : null}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
