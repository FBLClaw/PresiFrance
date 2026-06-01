import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <SEOHead title="Page introuvable" description="La page demandée n'existe pas." path={pathname} />
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Oups ! Cette page n'existe pas.</p>
      <Link to="/">
        <Button size="lg" className="gap-2">
          <Home className="h-4 w-4" />
          Retour à l'accueil
        </Button>
      </Link>
    </div>
  );
}
