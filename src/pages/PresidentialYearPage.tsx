import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, BarChart3, MapPin, Trophy, Users } from "lucide-react";

import JsonLd from "@/components/JsonLd";
import SeoConnectorLinks from "@/components/SeoConnectorLinks";
import SEOHead from "@/components/SEOHead";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPresidentialYearSummary, isPresidentialYear } from "@/lib/presidentialSeo";

export default function PresidentialYearPage() {
  const { year: yearParam } = useParams<{ year: string }>();
  const { pathname } = useLocation();
  const year = Number(yearParam || pathname.match(/^\/presidentielle-(\d{4})$/)?.[1]);
  const summary = getPresidentialYearSummary(year);

  if (!summary || !isPresidentialYear(year)) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEOHead title="Année présidentielle introuvable" description="Cette année de présidentielle n'est pas disponible sur PrésiFrance." path="/resultats-presidentielle" />
        <SiteHeader />
        <main className="flex-1 container max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-black mb-4">Année introuvable</h1>
          <Link to="/resultats-presidentielle" className="text-primary hover:underline">Voir toutes les présidentielles</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={`Résultats présidentielle ${year}`}
        description={`Résultats de l'élection présidentielle ${year} : ${summary.winner} face à ${summary.runnerUp}, scores, participation et accès aux données par commune.`}
        path={`/presidentielle-${year}`}
      />
      <JsonLd
        path={`/presidentielle-${year}`}
        breadcrumbs={[
          { name: "Résultats présidentielle", path: "/resultats-presidentielle" },
          { name: `Présidentielle ${year}`, path: `/presidentielle-${year}` },
        ]}
      />
      <SiteHeader />

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-10">
        <Link to="/resultats-presidentielle" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Toutes les présidentielles
        </Link>

        <header className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Élection présidentielle</p>
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight mb-4">
            Résultats présidentielle {year}
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
            {summary.winner} remporte l'élection face à {summary.runnerUp}. Cette page sert de point d'entrée vers les résultats par commune, par département et les outils de comparaison de PrésiFrance.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Trophy className="h-5 w-5 text-primary" />
                Vainqueur
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-black">{summary.winner}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Finaliste
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-black">{summary.runnerUp}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                Lecture utile
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{summary.angle}.</CardContent>
          </Card>
        </section>

        <SeoConnectorLinks context="year" year={year} />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link to={`/explorer?year=${year}`} className="block">
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  Explorer les communes en {year}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Recherchez une commune ou parcourez les départements pour retrouver les résultats locaux de la présidentielle {year}.
              </CardContent>
            </Card>
          </Link>
          <Link to={`/comparer?year=${year}`} className="block">
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Comparer deux communes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Comparez les scores, la participation et les écarts entre deux territoires pour cette année électorale.
              </CardContent>
            </Card>
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
