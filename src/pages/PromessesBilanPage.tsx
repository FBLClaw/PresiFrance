import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ClipboardCheck, Loader2 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMacronPromisesBilan, type MacronPromiseItem, type PromiseStatus } from "@/lib/api/macronPromisesApi";

const STATUS_LABEL: Record<PromiseStatus, string> = {
  tenu: "Tenu",
  partiel: "Partiel",
  non_tenu: "Non tenu",
  en_cours: "En cours",
  non_evalue: "Non évalué",
};

const STATUS_BADGE: Record<PromiseStatus, string> = {
  tenu: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border-emerald-500/30",
  partiel: "bg-amber-500/15 text-amber-900 dark:text-amber-100 border-amber-500/35",
  non_tenu: "bg-red-500/12 text-red-800 dark:text-red-200 border-red-500/25",
  en_cours: "bg-blue-500/12 text-blue-800 dark:text-blue-200 border-blue-500/25",
  non_evalue: "bg-muted text-muted-foreground border-border",
};

const BAR_COLOR: Record<PromiseStatus, string> = {
  tenu: "hsl(142 76% 36%)",
  partiel: "hsl(38 92% 45%)",
  non_tenu: "hsl(0 72% 45%)",
  en_cours: "hsl(217 91% 45%)",
  non_evalue: "hsl(var(--muted-foreground))",
};

export default function PromessesBilanPage() {
  const [themeFilter, setThemeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["macron-promises-bilan"],
    queryFn: getMacronPromisesBilan,
    staleTime: 60 * 60 * 1000,
  });

  const themes = useMemo(() => {
    if (!data) return [];
    const s = new Set(data.items.map((i) => i.theme));
    return [...s].sort((a, b) => a.localeCompare(b, "fr"));
  }, [data]);

  const filteredItems = useMemo(() => {
    if (!data) return [];
    return data.items.filter((i) => {
      if (themeFilter !== "all" && i.theme !== themeFilter) return false;
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      return true;
    });
  }, [data, themeFilter, statusFilter]);

  const chartRows = useMemo(() => {
    if (!data) return [];
    const counts: Record<PromiseStatus, number> = {
      tenu: 0,
      partiel: 0,
      non_tenu: 0,
      en_cours: 0,
      non_evalue: 0,
    };
    for (const i of data.items) counts[i.status] += 1;
    return (Object.keys(counts) as PromiseStatus[])
      .filter((k) => counts[k] > 0)
      .map((status) => ({
        status,
        label: STATUS_LABEL[status],
        n: counts[status],
        fill: BAR_COLOR[status],
      }));
  }, [data]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Promesses 2017 vs bilan 2017-2022 (Macron)"
        description="Synthèse pédagogique : engagements de campagne 2017 et mise en œuvre sur le premier quinquennat, avec sources presse et méthodologie."
        path="/promesses-bilan"
      />
      <JsonLd path="/promesses-bilan" breadcrumbs={[{ name: "Promesses vs bilan", path: "/promesses-bilan" }]} />
      <SiteHeader />

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Accueil
          </Link>
          <Link
            to="/analyse"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Sondages 2022
          </Link>
        </div>

        <header className="mb-10">
          <div className="flex items-center gap-3 text-primary mb-2">
            <ClipboardCheck className="h-8 w-8" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-widest">Analyse · mandat 2017-2022</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground tracking-tight mb-3">
            Promesses de campagne et bilan
          </h1>
          {data ? (
            <p className="text-muted-foreground max-w-3xl leading-relaxed space-y-3">
              <span className="block font-medium text-foreground">{data.meta.scope}</span>
              <span className="block text-sm">{data.meta.disclaimer}</span>
              <span className="block text-sm">{data.meta.methodologyNote}</span>
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">Chargement du texte d’introduction…</p>
          )}
        </header>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            Chargement…
          </div>
        )}

        {isError && (
          <p className="text-destructive text-center py-12">Impossible de charger les données. Réessayez plus tard.</p>
        )}

        {data && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sources principales (vue d’ensemble)</CardTitle>
                <CardDescription>Articles de référence pour le décompte global et la méthode — à lire avant d’interpréter le tableau.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {data.globalReferences.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
                        {r.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Répartition agrégée ({data.items.length} mesures)</CardTitle>
                <CardDescription className="space-y-3 text-sm">
                  <span className="block">
                    <strong className="text-foreground">{data.items.length} lignes</strong> dans le tableau = même décompte que
                    l’audit{" "}
                    {data.referenceTallies?.find((r) => r.id === "franceinfo-100-2022") ? (
                      <a
                        href={data.referenceTallies.find((r) => r.id === "franceinfo-100-2022")!.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-medium hover:underline"
                      >
                        franceinfo (100 mesures phares)
                      </a>
                    ) : (
                      "franceinfo (100 mesures phares)"
                    )}
                    .
                  </span>
                  {data.referenceTallies && data.referenceTallies.length > 0 ? (
                    <div className="rounded-lg border border-border/80 bg-muted/30 px-3 py-2.5 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Autres bilans de référence (non représentés barre par barre ici)
                      </p>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        {data.referenceTallies.map((ref) => {
                          const c = ref.counts;
                          const extra = c.non_evalue != null && c.non_evalue > 0;
                          const sum = c.tenu + c.partiel + c.non_tenu + (c.non_evalue ?? 0);
                          return (
                            <li key={ref.id}>
                              <a
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary font-medium hover:underline"
                              >
                                {ref.label}
                              </a>
                              <span className="block mt-0.5">
                                <strong className="text-foreground">
                                  {c.tenu} tenues · {c.partiel} partielles · {c.non_tenu} non tenues
                                  {extra ? ` · ${c.non_evalue} inévaluables` : ""}
                                </strong>
                                {sum > 0 ? (
                                  <span className="text-muted-foreground"> — {sum} promesse{sum > 1 ? "s" : ""} au total</span>
                                ) : null}
                              </span>
                              <span className="block mt-1 opacity-90">{ref.scope}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StatusBarChart rows={chartRows} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comparer les mesures</CardTitle>
                <CardDescription>
                  Filtrez par thème ou par statut. Pour l’inventaire complet des ~400 promesses derrière l’article des{" "}
                  <em>Décodeurs</em>, ouvrez{" "}
                  <a
                    href="https://www.luipresident.fr/emmanuel-macron/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline"
                  >
                    Lui Président
                  </a>
                  .
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor="filter-theme">Thème</Label>
                    <Select value={themeFilter} onValueChange={setThemeFilter}>
                      <SelectTrigger id="filter-theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les thèmes</SelectItem>
                        {themes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor="filter-status">Statut</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger id="filter-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {(Object.keys(STATUS_LABEL) as PromiseStatus[]).map((s) => (
                          <SelectItem key={s} value={s}>
                            {STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <ul className="space-y-4">
                  {filteredItems.map((item) => (
                    <PromiseRow key={item.id} item={item} />
                  ))}
                </ul>
                {filteredItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Aucun résultat avec ces filtres.</p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

type ChartRow = { status: PromiseStatus; label: string; n: number; fill: string };

function StatusBarChart({ rows }: { rows: ChartRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Aucune donnée à afficher.</p>;
  }
  return (
    <div className="h-[200px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="label" width={88} tick={{ fontSize: 11 }} />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted) / 0.35)" }}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
              fontSize: "12px",
            }}
            formatter={(v: number) => [`${v} mesure(s)`, ""]}
          />
          <Bar dataKey="n" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {rows.map((row) => (
              <Cell key={row.status} fill={row.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function PromiseRow({ item }: { item: MacronPromiseItem }) {
  return (
    <li className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-muted-foreground">{item.theme}</span>
        <span
          className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${STATUS_BADGE[item.status]}`}
        >
          {STATUS_LABEL[item.status]}
        </span>
      </div>
      <p className="font-semibold text-foreground text-sm sm:text-base leading-snug mb-2">{item.promise}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{item.note}</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {item.sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}
