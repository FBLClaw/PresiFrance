import { Link } from "react-router-dom";
import { BarChart3, CalendarDays, GitCompare, Map, MapPin, Search, UsersRound } from "lucide-react";

import JsonLd from "@/components/JsonLd";
import SEOHead from "@/components/SEOHead";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRESIDENTIAL_YEAR_SUMMARIES } from "@/lib/presidentialSeo";

export default function ResultatsPresidentiellePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Résultats des élections présidentielles françaises"
        description="Tous les résultats des élections présidentielles françaises par année, commune et département : scores, participation, candidats et données officielles."
        path="/resultats-presidentielle"
      />
      <JsonLd path="/resultats-presidentielle" breadcrumbs={[{ name: "Résultats présidentielle", path: "/resultats-presidentielle" }]} />
      <SiteHeader />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-10">
        <header className="max-w-3xl mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Hub résultats</p>
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight mb-4">
            Résultats des élections présidentielles françaises
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Retrouvez les résultats officiels des présidentielles par année, puis descendez vers les départements et les communes pour comparer les scores, la participation et l'évolution du vote.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <Link to="/resultats-presidentielle-par-commune" className="block">
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  Par commune
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Accédez aux résultats détaillés dans chaque ville ou village, avec participation et scores par candidat.
              </CardContent>
            </Card>
          </Link>
          <Link to="/explorer" className="block">
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Search className="h-5 w-5 text-primary" />
                  Par département
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Parcourez les communes département par département pour construire une lecture géographique du scrutin.
              </CardContent>
            </Card>
          </Link>
          <Link to="/comparer" className="block">
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <GitCompare className="h-5 w-5 text-primary" />
                  Comparer
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Comparez deux communes côte à côte pour mesurer les écarts de participation et de vote.
              </CardContent>
            </Card>
          </Link>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <Search className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-black tracking-tight">Explorer par intention</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/carte-presidentielle" className="block">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Map className="h-5 w-5 text-primary" />
                    Carte présidentielle
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Lire les résultats comme un phénomène territorial.</CardContent>
              </Card>
            </Link>
            <Link to="/participation-presidentielle" className="block">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <UsersRound className="h-5 w-5 text-primary" />
                    Participation
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Comparer la mobilisation électorale par commune ou département.</CardContent>
              </Card>
            </Link>
            <Link to="/abstention-presidentielle" className="block">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Abstention
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Nuancer les scores grâce au niveau de non-vote.</CardContent>
              </Card>
            </Link>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-5">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-black tracking-tight">Résultats par année</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESIDENTIAL_YEAR_SUMMARIES.map((summary) => (
              <Link key={summary.year} to={`/presidentielle-${summary.year}`} className="block">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-3">
                      <span>Présidentielle {summary.year}</span>
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Vainqueur : <strong className="text-foreground">{summary.winner}</strong>. Face à {summary.runnerUp}, avec {summary.angle}.
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
