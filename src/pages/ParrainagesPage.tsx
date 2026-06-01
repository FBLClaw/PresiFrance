import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, Users, BarChart3, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import { getParrainagesManifest, getParrainagesByYear, getParrainagesByDep } from "@/lib/api/parrainagesApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CANDIDATE_COLORS: Record<string, string> = {
  "MACRON Emmanuel": "#0091ff",
  "LE PEN Marine": "#004494",
  "MÉLENCHON Jean-Luc": "#cc2443",
  "ZEMMOUR Éric": "#404040",
  "PÉCRESSE Valérie": "#0066cc",
  "JADOT Yannick": "#00c000",
  "LASSALLE Jean": "#0091ff",
  "ROUSSEL Fabien": "#dd0000",
  "DUPONT-AIGNAN Nicolas": "#0082c4",
  "HIDALGO Anne": "#ff4000",
  "POUTOU Philippe": "#bb0000",
  "ARTHAUD Nathalie": "#8b0000",
  "TAUBIRA Christiane": "#cc2443",
  "ASSELINEAU François": "#666666",
};

const FALLBACK_PALETTE = ["#0091ff", "#cc2443", "#004494", "#00c000", "#ff6b35", "#404040", "#dd0000", "#8b0000"];

function getCandidateColor(candidat: string): string {
  return CANDIDATE_COLORS[candidat] ?? FALLBACK_PALETTE[Math.abs(candidat.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % FALLBACK_PALETTE.length];
}

const ParrainagesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const yearParam = searchParams.get("year");
  const depParam = searchParams.get("dep") || "";
  const [searchCandidat, setSearchCandidat] = useState("");
  const [selectedCandidat, setSelectedCandidat] = useState<string | null>(null);

  const year = yearParam ? Number(yearParam) : 2022;

  const { data: manifest, isLoading: manifestLoading } = useQuery({
    queryKey: ["parrainages-manifest"],
    queryFn: getParrainagesManifest,
  });

  const { data: dataByYear, isLoading: dataLoading } = useQuery({
    queryKey: ["parrainages", year],
    queryFn: () => getParrainagesByYear(year),
    enabled: !!manifest?.years?.includes(year),
  });

  const { data: byDep } = useQuery({
    queryKey: ["parrainages-by-dep", year],
    queryFn: () => getParrainagesByDep(year),
    enabled: !!manifest?.years?.includes(year),
  });

  const availableYears = manifest?.years ?? [2022];
  const effectiveYear = availableYears.includes(year) ? year : availableYears[0];

  const depList = byDep ? Object.keys(byDep).sort((a, b) => a.localeCompare(b)) : [];
  const selectedDep = depParam && depList.includes(depParam) ? depParam : null;

  const stats = dataByYear?.stats ?? [];
  const filteredStats = searchCandidat
    ? stats.filter((s) => s.candidat.toLowerCase().includes(searchCandidat.toLowerCase()))
    : stats;
  const sortedByTotal = [...filteredStats].sort((a, b) => b.total - a.total);
  const topCandidats = sortedByTotal.slice(0, 15);

  const depData = selectedDep && byDep ? byDep[selectedDep] ?? [] : [];
  const parrainagesList = selectedCandidat && dataByYear?.byCandidat
    ? (selectedDep
        ? dataByYear.byCandidat[selectedCandidat]?.filter((e) => e.dep === selectedDep) ?? []
        : dataByYear.byCandidat[selectedCandidat] ?? []
      )
    : [];

  const chartData = topCandidats.map((s) => ({
    name: s.candidat.replace(/^(\w+)\s+(.+)$/, "$2 $1"),
    candidat: s.candidat,
    total: s.total,
    deps: s.departements,
  }));

  const isLoading = manifestLoading || dataLoading;

  if (isLoading && !dataByYear) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead path="/parrainages" />
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Parrainages présidentiels"
        description="Parrainages validés par le Conseil constitutionnel — recherche par département et par candidat."
        path="/parrainages"
      />
      <JsonLd
        path="/parrainages"
        breadcrumbs={[{ name: "Parrainages", path: "/parrainages" }]}
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

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground tracking-tight mb-2">
            Parrainages présidentiels
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Les parrainages validés par le Conseil constitutionnel. 500 parrainages d'élus répartis sur au moins 30
            départements sont nécessaires pour candidater.
          </p>
        </header>

        <div className="flex flex-wrap gap-4 mb-8">
          <Select
            value={String(effectiveYear)}
            onValueChange={(v) => {
              const next = new URLSearchParams(searchParams);
              next.set("year", v);
              next.delete("dep");
              setSearchParams(next);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedDep || "all"}
            onValueChange={(v) => {
              const next = new URLSearchParams(searchParams);
              if (v === "all") next.delete("dep");
              else next.set("dep", v);
              setSearchParams(next);
            }}
          >
            <SelectTrigger className="w-[220px]">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Tous les départements" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              {depList.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Rechercher un candidat..."
            value={searchCandidat}
            onChange={(e) => setSearchCandidat(e.target.value)}
            className="w-[220px]"
          />
        </div>

        {dataByYear && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                  <Users className="h-3.5 w-3" />
                  Total parrainages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{dataByYear.total.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">parrainages validés</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                  <BarChart3 className="h-3.5 w-3" />
                  Candidats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{dataByYear.candidats.length}</div>
                <p className="text-xs text-muted-foreground mt-1">candidats parrainés</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-widest text-primary">
                  Source
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Conseil constitutionnel —{" "}
                  <a
                    href="https://www.data.gouv.fr/posts/donnees-liees-aux-elections-presidentielles"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    data.gouv.fr
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-border/50 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Parrainages par candidat</CardTitle>
              <p className="text-sm text-muted-foreground">
                {selectedDep ? `Répartition dans ${selectedDep}` : "Top 15 au niveau national"}
              </p>
            </CardHeader>
            <CardContent>
              {selectedDep ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {depData.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Aucun parrainage dans ce département.</p>
                  ) : (
                    depData.map((item) => (
                      <div key={item.candidat} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: getCandidateColor(item.candidat) }}
                        />
                        <span className="text-sm font-medium truncate flex-1">
                          {item.candidat.replace(/^(\w+)\s+(.+)$/, "$2 $1")}
                        </span>
                        <span className="text-sm font-bold tabular-nums">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(v: number, _: unknown, p: { payload: { candidat: string; deps: number } }) => [
                        `${v} parrainages • ${p.payload.deps} départements`,
                        "",
                      ]}
                    />
                    <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={getCandidateColor(entry.candidat)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Classement des candidats</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total de parrainages et nombre de départements couverts
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {sortedByTotal.slice(0, 25).map((s, i) => (
                  <button
                    key={s.candidat}
                    type="button"
                    onClick={() => setSelectedCandidat(s.candidat)}
                    className={`w-full flex items-center gap-3 py-2 border-b border-border/50 last:border-0 text-left hover:bg-muted/50 transition-colors rounded px-1 -mx-1 ${selectedCandidat === s.candidat ? "bg-primary/10 ring-1 ring-primary/30" : ""}`}
                  >
                    <span className="text-xs font-bold text-muted-foreground w-6">{i + 1}</span>
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: getCandidateColor(s.candidat) }}
                    />
                    <span className="text-sm font-medium flex-1 truncate">
                      {s.candidat.replace(/^(\w+)\s+(.+)$/, "$2 $1")}
                    </span>
                    <span className="text-sm font-bold tabular-nums">{s.total}</span>
                    <span className="text-xs text-muted-foreground">({s.departements} deps)</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {dataByYear && (
          <Card className="mt-10 border-border/50 overflow-hidden">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Qui a parrainé qui ?</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cliquez sur un candidat dans le classement pour voir la liste des élus qui l'ont parrainé.
                  </p>
                </div>
                <Select
                  value={selectedCandidat || ""}
                  onValueChange={(v) => setSelectedCandidat(v || null)}
                >
                  <SelectTrigger className="w-[260px]">
                    <SelectValue placeholder="Choisir un candidat..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedByTotal.map((s) => (
                      <SelectItem key={s.candidat} value={s.candidat}>
                        {s.candidat.replace(/^(\w+)\s+(.+)$/, "$2 $1")} ({s.total})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {selectedCandidat ? (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong className="text-foreground">
                      {selectedCandidat.replace(/^(\w+)\s+(.+)$/, "$2 $1")}
                    </strong>
                    {selectedDep && ` — Département : ${selectedDep}`}
                    {" — "}
                    {parrainagesList.length} parrainage{parrainagesList.length > 1 ? "s" : ""}
                  </p>
                  <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold">Parrain</th>
                          <th className="text-left py-3 px-4 font-semibold">Mandat</th>
                          <th className="text-left py-3 px-4 font-semibold">Commune / Circonscription</th>
                          <th className="text-left py-3 px-4 font-semibold">Département</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parrainagesList.map((p, i) => (
                          <tr key={i} className="border-t border-border/50 hover:bg-muted/30">
                            <td className="py-2 px-4 font-medium">
                              {p.prenom} {p.nom}
                            </td>
                            <td className="py-2 px-4 text-muted-foreground">{p.mandat}</td>
                            <td className="py-2 px-4">{p.circonscription || "—"}</td>
                            <td className="py-2 px-4">{p.dep || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-sm py-8 text-center">
                  Sélectionnez un candidat pour afficher la liste des parrainages.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <p className="mt-8 text-xs text-muted-foreground">
          Données : Conseil constitutionnel. Le total des parrainages affiché ne préjuge pas de la validité de la
          candidature. Une candidature est retenue si au plus 50 parrainages proviennent d'un même département et si les
          parrainages couvrent au moins 30 départements.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
};

export default ParrainagesPage;
