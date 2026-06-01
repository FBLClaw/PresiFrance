import { Link } from "react-router-dom";
import { BarChart3, GitCompare, LucideIcon, MapPin, Search } from "lucide-react";

import JsonLd from "@/components/JsonLd";
import SEOHead from "@/components/SEOHead";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConnectorCard {
  title: string;
  text: string;
  Icon: LucideIcon;
}

interface ConnectorPageProps {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  answerTitle: string;
  answer: string;
  stepsTitle: string;
  steps: string[];
  faq: Array<{ question: string; answer: string }>;
  cards: ConnectorCard[];
}

export default function SeoConnectorPage({
  path,
  eyebrow,
  title,
  description,
  intro,
  answerTitle,
  answer,
  stepsTitle,
  steps,
  faq,
  cards,
}: ConnectorPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title={title} description={description} path={path} />
      <JsonLd
        path={path}
        breadcrumbs={[
          { name: "Résultats présidentielle", path: "/resultats-presidentielle" },
          { name: title, path },
        ]}
      />
      <SiteHeader />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-10">
        <header className="max-w-3xl mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{eyebrow}</p>
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight mb-4">{title}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">{intro}</p>
        </header>

        <section className="rounded-xl border border-border bg-card p-6 mb-12">
          <h2 className="text-2xl font-black tracking-tight mb-3">{answerTitle}</h2>
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {cards.map(({ title: cardTitle, text, Icon }) => (
            <Card key={cardTitle}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Icon className="h-5 w-5 text-primary" />
                  {cardTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{text}</CardContent>
            </Card>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-2xl font-black tracking-tight mb-4">{stepsTitle}</h2>
            <ol className="space-y-3 text-sm text-muted-foreground">
              {steps.map((step, index) => (
                <li key={step}>
                  <strong className="text-foreground">{index + 1}.</strong> {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-2xl font-black tracking-tight mb-4">Questions fréquentes</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              {faq.map((item) => (
                <p key={item.question}>
                  <strong className="text-foreground">{item.question}</strong>
                  <br />
                  {item.answer}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Link to="/resultats-presidentielle" className="block">
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Hub résultats
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Revenir à l'architecture principale par année, commune et département.</CardContent>
            </Card>
          </Link>
          <Link to="/resultats-presidentielle-par-commune" className="block">
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Search className="h-5 w-5 text-primary" />
                  Par commune
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Trouver directement une ville ou un village.</CardContent>
            </Card>
          </Link>
          <Link to="/explorer" className="block">
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  Par département
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Parcourir les communes depuis une entrée géographique.</CardContent>
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
              <CardContent className="text-sm text-muted-foreground">Comparer deux communes côte à côte.</CardContent>
            </Card>
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
