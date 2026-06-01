import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import SeoConnectorLinks from "@/components/SeoConnectorLinks";
import { getCandidateColor } from "@/lib/candidateColors";
import { ArrowLeft, Loader2, Users, Vote, UserCheck, BarChart3, Share2, GitCompare, TrendingUp, MapPin } from "lucide-react";
import { useQuery, useQueries } from "@tanstack/react-query";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getCommuneWithCoords } from "@/lib/api/geoApi";
import { getCommuneResults, ElectionResult } from "@/lib/api/resultsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { addToSearchHistory } from "@/lib/searchHistory";
import { toast } from "@/components/ui/sonner";
import { getCandidatePhotoUrl } from "@/lib/candidatePhotos";
import { DEFAULT_YEAR, PresidentialYear } from "@/lib/elections";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icon with Vite
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const EVOLUTION_YEARS = [2002, 2007, 2012, 2017, 2022] as const;

function CandidateAvatar({
  prenom,
  nom,
  color,
  size = 48,
}: {
  prenom: string;
  nom: string;
  color: string;
  size?: number;
}) {
  const [imgError, setImgError] = useState(false);
  const photoUrl = getCandidatePhotoUrl(prenom, nom);
  const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();

  if (photoUrl && !imgError) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-full shadow-lg"
        style={{ width: size, height: size, boxShadow: `0 2px 8px rgba(0,0,0,0.12), 0 0 0 2px ${color}50` }}
      >
        <img
          src={photoUrl}
          alt={`${prenom} ${nom}`}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-lg"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: Math.max(14, size * 0.38),
      }}
    >
      {initials}
    </div>
  );
}

const CommunePage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [round, setRound] = useState<1 | 2>(1);
  const yearParam = searchParams.get("year");
  const year = (yearParam ? Number(yearParam) : DEFAULT_YEAR) as PresidentialYear;

  const { data: geo, isLoading: geoLoading } = useQuery({
    queryKey: ["geo", code],
    queryFn: () => getCommuneWithCoords(code!),
    enabled: !!code,
  });

  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ["results", code, round, year],
    queryFn: () => getCommuneResults(code!, round, year),
    enabled: !!code,
  });

  const evolutionQueries = useQueries({
    queries: EVOLUTION_YEARS.map((y) => ({
      queryKey: ["results", code, 1, y],
      queryFn: () => getCommuneResults(code!, 1, y),
      enabled: !!code && !results?.niveau,
    })),
  });

  const evolutionData = evolutionQueries
    .map((q, i) => (q.data ? { year: EVOLUTION_YEARS[i], ...q.data } : null))
    .filter(Boolean) as Array<{ year: number } & ElectionResult>;

  useEffect(() => {
    if (geo) {
      addToSearchHistory(geo);
    }
  }, [geo]);

  if (geoLoading || resultsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead path={code ? `/commune/${code}` : "/"} />
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!geo || !results) {
    const noCommuneDataRound = year === 1981 && round === 2;
    const noCommuneData = noCommuneDataRound;
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead
          title={noCommuneData ? "Données indisponibles" : "Commune introuvable"}
          path={code ? `/commune/${code}` : "/"}
        />
        <SiteHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">
            {noCommuneData ? "Données par commune indisponibles" : "Commune ou résultats introuvables"}
          </h1>
          {noCommuneDataRound && (
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Le 2ᵉ tour 1981 n'est pas disponible par commune. Seul le 1ᵉʳ tour est accessible (communes de plus de 9 000 habitants).
            </p>
          )}
          <button onClick={() => navigate(`/?year=${encodeURIComponent(String(year || 2022))}`)} className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const chartData = results.candidates.map((c, i) => ({
    name: `${c.prenom} ${c.nom}`,
    voix: c.voix,
    percentage: c.pourcentExprimes,
    color: getCandidateColor(c.prenom, c.nom, i),
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={`Résultats présidentielle ${year} à ${geo.nom}`}
        description={`Résultats de l'élection présidentielle ${year} à ${geo.nom} : scores des candidats, participation, abstention et évolution du vote.`}
        path={`/commune/${code}`}
      />
      <JsonLd
        path={`/commune/${code}`}
        commune={{ nom: geo.nom, code: geo.code, codeDepartement: geo.codeDepartement }}
        breadcrumbs={[
          { name: "Explorer par commune", path: "/explorer" },
          { name: `Département ${geo.codeDepartement}`, path: `/explorer/${geo.codeDepartement}` },
          { name: geo.nom, path: `/commune/${code}` },
        ]}
      />
      <SiteHeader />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/?year=${encodeURIComponent(String(year || 2022))}`)}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Retour à la recherche
        </button>

        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">
                {results.niveau === "departement" ? "Résultats par département" : `Département ${geo.codeDepartement}`}
              </p>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                {results.niveau === "departement" ? results.nomDepartement || `Département ${geo.codeDepartement}` : geo.nom}
              </h1>
              <p className="text-muted-foreground mt-2">
                {results.niveau === "departement"
                  ? `Commune : ${geo.nom} (située dans ce département) • ${geo.population?.toLocaleString()} habitants`
                  : `${geo.population?.toLocaleString()} habitants`}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Link
                to={`/comparer?a=${geo.code}&year=${year}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 text-sm font-medium shrink-0"
              >
                <GitCompare className="h-4 w-4" />
                Comparer avec une autre
              </Link>
              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/commune/${geo.code}?year=${year}&round=${round}`;
                  navigator.clipboard.writeText(url).then(() => toast.success("Lien copié dans le presse-papier"));
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 text-sm font-medium shrink-0"
              >
                <Share2 className="h-4 w-4" />
                Copier le lien
              </button>
              <Tabs value={String(round)} onValueChange={(v) => setRound(Number(v) as 1 | 2)} className="shrink-0">
                <TabsList className="bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="1" className="rounded-lg px-6">1er Tour</TabsTrigger>
                  <TabsTrigger value="2" className="rounded-lg px-6">2nd Tour</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </header>

        {results.niveau === "departement" && (
          <div className="mb-8 p-4 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Pour les années 1965, 1969, 1974, 1981 et 1988</strong>, les résultats par commune n'existent pas. Nous affichons donc les résultats du <strong>département {results.nomDepartement}</strong>, dans lequel se trouve {geo.nom}. Les chiffres correspondent à l’ensemble du département.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-2 bg-primary/5">
              <CardTitle className="text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                <Users className="h-3 w-3" /> Participation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black mb-1">{results.votantsPourcent.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground mb-4">{results.votants.toLocaleString()} votants sur {results.inscrits.toLocaleString()}</p>
              <Progress value={results.votantsPourcent} className="h-2 rounded-full" />
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-2 bg-muted/50">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Vote className="h-3 w-3" /> Abstention
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black mb-1">{results.abstentionsPourcent.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground mb-4">{results.abstentions.toLocaleString()} inscrits n'ont pas voté</p>
              <Progress value={results.abstentionsPourcent} className="h-2 rounded-full bg-muted" color="bg-muted-foreground" />
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-2 bg-muted/50">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <UserCheck className="h-3 w-3" /> Votes Blancs & Nuls
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black mb-1">{(results.blancs + results.nuls).toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mb-4">{((results.blancs + results.nuls) / results.votants * 100).toFixed(1)}% des votants</p>
              <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                 <div className="bg-slate-300" style={{ width: `${results.blancsPourcentVotants}%` }} />
                 <div className="bg-slate-400" style={{ width: `${results.nulsPourcentVotants}%` }} />
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Résultats par candidat</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div
              className="w-full"
              style={{ height: `${Math.max(120, Math.min(400, 80 + results.candidates.length * 56))}px` }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, bottom: 5, left: 40, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.1} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={150} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border p-3 rounded-lg shadow-xl">
                            <p className="font-bold">{payload[0].payload.name}</p>
                            <p className="text-primary text-lg font-black">{payload[0].value}%</p>
                            <p className="text-xs text-muted-foreground">{payload[0].payload.voix.toLocaleString()} voix</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={24}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {results.candidates.map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-colors group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex flex-col items-center shrink-0">
                       <span className="text-[10px] font-black text-muted-foreground/50">#{i+1}</span>
                       <div className="h-8 w-1 rounded-full" style={{ backgroundColor: getCandidateColor(c.prenom, c.nom, i) }} />
                    </div>
                    <CandidateAvatar
                      prenom={c.prenom}
                      nom={c.nom}
                      color={getCandidateColor(c.prenom, c.nom, i)}
                      size={52}
                    />
                    <div className="min-w-0">
                      <div className="font-bold group-hover:text-primary transition-colors truncate">{c.prenom} {c.nom}</div>
                      <div className="text-xs text-muted-foreground">{c.voix.toLocaleString()} voix</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-black">{c.pourcentExprimes.toFixed(1)}%</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">des exprimés</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SeoConnectorLinks context="commune" communeName={geo.nom} />

        {evolutionData.length >= 2 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Évolution dans le temps (1er tour)</h2>
            </div>

            <div className="space-y-8">
              {/* Participation */}
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Taux de participation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={evolutionData.map((d) => ({
                          year: String(d.year),
                          participation: d.votantsPourcent,
                        }))}
                        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                        <XAxis dataKey="year" tick={{ fontSize: 13, fontWeight: 600 }} />
                        <YAxis
                          tickFormatter={(v) => `${v}%`}
                          domain={[
                            (dataMin: number) => Math.max(0, Math.floor(dataMin) - 5),
                            100,
                          ]}
                          tick={{ fontSize: 12 }}
                          width={40}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload?.[0]) {
                              return (
                                <div className="bg-background border border-border px-4 py-2 rounded-lg shadow-xl">
                                  <p className="font-bold">{payload[0].payload.year}</p>
                                  <p className="text-primary text-lg font-black">
                                    {payload[0].value?.toFixed(1)}% de participation
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="participation"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={80}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Vainqueurs locaux */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">Vainqueur local par année</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {evolutionData.map((d) => {
                    const c = d.candidates[0];
                    if (!c) return null;
                    const color = getCandidateColor(c.prenom, c.nom, 0);
                    return (
                      <div
                        key={d.year}
                        className="p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-colors"
                      >
                        <p className="text-xs font-bold text-muted-foreground mb-1">{d.year}</p>
                        <p className="font-bold text-sm leading-tight">{c.prenom} {c.nom}</p>
                        <p className="text-lg font-black mt-1" style={{ color }}>{c.pourcentExprimes.toFixed(1)}%</p>
                        <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${c.pourcentExprimes}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top 3 par année */}
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Podium (top 3) par année
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={evolutionData.map((d) => ({
                          year: String(d.year),
                          ...Object.fromEntries(
                            d.candidates.slice(0, 3).map((c, i) => [
                              `c${i}`,
                              c.pourcentExprimes,
                            ])
                          ),
                          ...Object.fromEntries(
                            d.candidates.slice(0, 3).map((c, i) => [
                              `nom${i}`,
                              `${c.prenom} ${c.nom}`,
                            ])
                          ),
                          ...Object.fromEntries(
                            d.candidates.slice(0, 3).map((c, i) => [
                              `color${i}`,
                              getCandidateColor(c.prenom, c.nom, i),
                            ])
                          ),
                        }))}
                        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                        <XAxis dataKey="year" tick={{ fontSize: 13, fontWeight: 600 }} />
                        <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 50]} tick={{ fontSize: 12 }} width={40} />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload?.length && label) {
                              const d = evolutionData.find((x) => String(x.year) === label);
                              if (!d) return null;
                              return (
                                <div className="bg-background border border-border p-3 rounded-lg shadow-xl min-w-[180px]">
                                  <p className="font-bold mb-2">{label}</p>
                                  {d.candidates.slice(0, 3).map((c, i) => (
                                    <div key={i} className="flex justify-between gap-4 text-sm">
                                      <span>#{i + 1} {c.prenom} {c.nom}</span>
                                      <span className="font-bold">{c.pourcentExprimes.toFixed(1)}%</span>
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="c0" name="1er" fill="#eab308" radius={[4, 4, 0, 0]} maxBarSize={32} />
                        <Bar dataKey="c1" name="2e" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={32} />
                        <Bar dataKey="c2" name="3e" fill="#b45309" radius={[4, 4, 0, 0]} maxBarSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Barres empilées : 1er (or) · 2e (gris) · 3e (bronze) — survolez pour les noms
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {geo?.centre?.coordinates && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Localisation</h2>
            </div>
            <Card className="border-border/50 overflow-hidden">
              <div className="h-80 w-full rounded-b-lg overflow-hidden">
                <MapContainer
                  center={[geo.centre.coordinates[1], geo.centre.coordinates[0]]}
                  zoom={12}
                  className="h-full w-full"
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[geo.centre.coordinates[1], geo.centre.coordinates[0]]}>
                    <Popup>{geo.nom}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </Card>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
};

export default CommunePage;
