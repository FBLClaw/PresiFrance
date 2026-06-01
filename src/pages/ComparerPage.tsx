import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import { getCandidateColor } from "@/lib/candidateColors";
import { ArrowLeft, Loader2, Users, Vote, BarChart3, MapPin, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CommuneSearch from "@/components/CommuneSearch";
import { getCommuneByCode, GeoCommune } from "@/lib/api/geoApi";
import { getCommuneResults } from "@/lib/api/resultsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DEFAULT_YEAR, PRESIDENTIAL_YEARS_DESC } from "@/lib/elections";
import { toast } from "@/components/ui/sonner";

const ComparerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [round, setRound] = useState<1 | 2>(1);

  const yearParam = searchParams.get("year");
  const codeA = searchParams.get("a");
  const codeB = searchParams.get("b");
  const year = (yearParam ? Number(yearParam) : DEFAULT_YEAR) as (typeof PRESIDENTIAL_YEARS_DESC)[number];

  const { data: communeA } = useQuery({
    queryKey: ["geo", codeA],
    queryFn: () => getCommuneByCode(codeA!),
    enabled: !!codeA,
  });
  const { data: communeB } = useQuery({
    queryKey: ["geo", codeB],
    queryFn: () => getCommuneByCode(codeB!),
    enabled: !!codeB,
  });

  const { data: resultsA, isLoading: loadingA } = useQuery({
    queryKey: ["results", communeA?.code, round, year],
    queryFn: () => getCommuneResults(communeA!.code, round, year),
    enabled: !!communeA?.code,
  });
  const { data: resultsB, isLoading: loadingB } = useQuery({
    queryKey: ["results", communeB?.code, round, year],
    queryFn: () => getCommuneResults(communeB!.code, round, year),
    enabled: !!communeB?.code,
  });

  const handleSelectA = (c: GeoCommune) => {
    const next = new URLSearchParams(searchParams);
    next.set("a", c.code);
    setSearchParams(next);
  };
  const handleSelectB = (c: GeoCommune) => {
    const next = new URLSearchParams(searchParams);
    next.set("b", c.code);
    setSearchParams(next);
  };

  const bothSelected = communeA && communeB;
  const isLoading = loadingA || loadingB;
  const hasResults = resultsA && resultsB;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Comparer des communes"
        description="Comparez les résultats présidentiels de deux communes françaises côte à côte."
        path="/comparer"
      />
      <JsonLd
        path="/comparer"
        breadcrumbs={[{ name: "Comparer des communes", path: "/comparer" }]}
      />
      <SiteHeader />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </Link>

        <header className="mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground tracking-tight mb-2">
              Comparer des communes
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Comparez les résultats électoraux de deux communes côte à côte : participation, scores des candidats, etc.
            </p>
          </div>
          {bothSelected && (
            <button
              type="button"
              onClick={() => {
                const url = `${window.location.origin}/comparer?a=${codeA}&b=${codeB}&year=${year}`;
                navigator.clipboard.writeText(url).then(() => toast.success("Lien copié dans le presse-papier"));
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 text-sm font-medium shrink-0"
            >
              <Share2 className="h-4 w-4" />
              Copier le lien
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Première commune
            </label>
            {communeA ? (
              <div className="flex items-center justify-between p-4 rounded-lg border border-primary/30 bg-primary/5">
                <Link to={`/commune/${communeA.code}?year=${year}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-bold">{communeA.nom}</p>
                    <p className="text-sm text-muted-foreground">
                      {communeA.codeDepartement} • {communeA.population?.toLocaleString()} hab.
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete("a");
                    setSearchParams(next);
                  }}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  Changer
                </button>
              </div>
            ) : (
              <CommuneSearch onSelect={handleSelectA} />
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Deuxième commune
            </label>
            {communeB ? (
              <div className="flex items-center justify-between p-4 rounded-lg border border-primary/30 bg-primary/5">
                <Link to={`/commune/${communeB.code}?year=${year}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-bold">{communeB.nom}</p>
                    <p className="text-sm text-muted-foreground">
                      {communeB.codeDepartement} • {communeB.population?.toLocaleString()} hab.
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete("b");
                    setSearchParams(next);
                  }}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  Changer
                </button>
              </div>
            ) : (
              <CommuneSearch onSelect={handleSelectB} />
            )}
          </div>
        </div>

        {bothSelected && (
          <>
            <Tabs value={String(round)} onValueChange={(v) => setRound(Number(v) as 1 | 2)} className="mb-8">
              <TabsList>
                <TabsTrigger value="1">1er tour</TabsTrigger>
                <TabsTrigger value="2">2nd tour</TabsTrigger>
              </TabsList>
            </Tabs>

            {isLoading && !hasResults ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : hasResults ? (
              <div className="space-y-10">
                {/* Participation comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatCard
                    title="Participation"
                    value={`${resultsA!.votantsPourcent.toFixed(1)}%`}
                    sub={`${resultsA!.votants.toLocaleString()} / ${resultsA!.inscrits.toLocaleString()}`}
                    icon={<Users className="h-3.5 w-3.5" />}
                    commune={communeA!.nom}
                    progress={resultsA!.votantsPourcent}
                    variant="primary"
                  />
                  <StatCard
                    title="Participation"
                    value={`${resultsB!.votantsPourcent.toFixed(1)}%`}
                    sub={`${resultsB!.votants.toLocaleString()} / ${resultsB!.inscrits.toLocaleString()}`}
                    icon={<Users className="h-3.5 w-3.5" />}
                    commune={communeB!.nom}
                    progress={resultsB!.votantsPourcent}
                    variant="primary"
                  />
                </div>

                {/* Abstention */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatCard
                    title="Abstention"
                    value={`${resultsA!.abstentionsPourcent.toFixed(1)}%`}
                    sub={resultsA!.abstentions.toLocaleString()}
                    icon={<Vote className="h-3.5 w-3.5" />}
                    commune={communeA!.nom}
                    progress={resultsA!.abstentionsPourcent}
                    variant="muted"
                  />
                  <StatCard
                    title="Abstention"
                    value={`${resultsB!.abstentionsPourcent.toFixed(1)}%`}
                    sub={resultsB!.abstentions.toLocaleString()}
                    icon={<Vote className="h-3.5 w-3.5" />}
                    commune={communeB!.nom}
                    progress={resultsB!.abstentionsPourcent}
                    variant="muted"
                  />
                </div>

                {/* Candidates comparison - barres côte à côte */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">Résultats par candidat</h2>
                  </div>

                  <ComparativeChart
                    resultsA={resultsA!}
                    resultsB={resultsB!}
                    communeA={communeA!.nom}
                    communeB={communeB!.nom}
                  />
                </section>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Résultats introuvables pour une ou plusieurs communes.</p>
                <p className="text-sm mt-2">Vérifiez que les données existent pour l'année {year}.</p>
              </div>
            )}
          </>
        )}

        {!bothSelected && (
          <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
            <p>Sélectionnez deux communes pour les comparer.</p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
};

function StatCard({
  title,
  value,
  sub,
  icon,
  commune,
  progress,
  variant,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  commune: string;
  progress: number;
  variant: "primary" | "muted";
}) {
  return (
    <Card className="border-border/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
          <span className={variant === "primary" ? "text-primary" : "text-muted-foreground"}>{icon}</span>
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{commune}</p>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black mb-1">{value}</div>
        <p className="text-sm text-muted-foreground mb-4">{sub}</p>
        <Progress value={progress} className={`h-2 rounded-full ${variant === "muted" ? "bg-muted" : ""}`} />
      </CardContent>
    </Card>
  );
}

type CandidateResult = { prenom: string; nom: string; voix: number; pourcentExprimes: number };

function ComparativeChart({
  resultsA,
  resultsB,
  communeA,
  communeB,
}: {
  resultsA: { candidates: CandidateResult[] };
  resultsB: { candidates: CandidateResult[] };
  communeA: string;
  communeB: string;
}) {
  const byKey = (c: CandidateResult) => `${c.prenom} ${c.nom}`;
  const mapA = new Map(resultsA.candidates.map((c) => [byKey(c), c]));
  const mapB = new Map(resultsB.candidates.map((c) => [byKey(c), c]));
  const allKeys = [...new Set([...mapA.keys(), ...mapB.keys()])];
  const chartData = allKeys.map((key, i) => {
    const ca = mapA.get(key);
    const cb = mapB.get(key);
    const pctA = ca?.pourcentExprimes ?? 0;
    const pctB = cb?.pourcentExprimes ?? 0;
    const diff = pctA - pctB;
    const gapText =
      diff > 0
        ? `+${diff.toFixed(1)} pts à ${communeA}`
        : diff < 0
          ? `+${Math.abs(diff).toFixed(1)} pts à ${communeB}`
          : "Égalité";
    return {
      name: key.replace(/^(\w+)\s+(.+)$/, "$2 $1"),
      fullKey: key,
      communeA: pctA,
      communeB: pctB,
      pctA,
      pctB,
      gapText,
      color: getCandidateColor(
        ca?.prenom ?? cb?.prenom ?? "",
        ca?.nom ?? cb?.nom ?? "",
        i
      ),
    };
  });

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={Math.min(500, 80 + chartData.length * 44)}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 60, left: 100, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.2} />
          <XAxis type="number" domain={[0, "auto"]} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="name" width={95} tick={{ fontSize: 11 }} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-background border border-border p-3 rounded-lg shadow-xl text-sm">
                  <p className="font-bold mb-2">{d.name}</p>
                  <p>{communeA}: <strong>{d.pctA.toFixed(1)}%</strong></p>
                  <p>{communeB}: <strong>{d.pctB.toFixed(1)}%</strong></p>
                  <p className="text-primary font-medium mt-1">{d.gapText}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="communeA" fill="#0091ff" radius={[0, 2, 2, 0]} barSize={14} name={communeA} />
          <Bar dataKey="communeB" fill="#cc2443" radius={[0, 2, 2, 0]} barSize={14} name={communeB} />
          <Legend />
        </BarChart>
      </ResponsiveContainer>

      <div className="border rounded-lg divide-y divide-border max-h-[320px] overflow-y-auto">
        {chartData.map((d) => (
          <div key={d.fullKey} className="flex items-center gap-4 p-3 hover:bg-muted/30">
            <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <div className="min-w-[100px] font-medium text-sm">{d.name}</div>
            <div className="flex-1 flex gap-4 text-sm">
              <span className="text-blue-600 font-semibold">{d.pctA.toFixed(1)}%</span>
              <span className="text-muted-foreground">vs</span>
              <span className="text-red-600 font-semibold">{d.pctB.toFixed(1)}%</span>
            </div>
            <span className="text-xs text-primary font-medium shrink-0">{d.gapText}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComparerPage;
