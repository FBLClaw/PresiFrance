import { Link } from "react-router-dom";
import { BarChart3, Map, MapPin, Search, UsersRound } from "lucide-react";

interface SeoConnectorLinksProps {
  context: "commune" | "department" | "year";
  communeName?: string;
  departmentName?: string;
  year?: number;
}

const copyByContext = {
  commune: {
    eyebrow: "Comprendre ce résultat",
    title: "Explorer le vote local autrement",
    intro: "Ces pages replacent le résultat communal dans une lecture plus large : carte, mobilisation, abstention et comparaison.",
  },
  department: {
    eyebrow: "Explorer autrement",
    title: "Lire les résultats du département",
    intro: "Après avoir choisi une commune, ces pages aident à comprendre les dynamiques territoriales et la mobilisation électorale.",
  },
  year: {
    eyebrow: "Approfondir l'année",
    title: "Analyser cette présidentielle",
    intro: "Ces entrées relient le scrutin aux communes, aux cartes et aux indicateurs de mobilisation.",
  },
} as const;

export default function SeoConnectorLinks({ context, communeName, departmentName, year }: SeoConnectorLinksProps) {
  const copy = copyByContext[context];
  const place = communeName || departmentName;
  const suffix = place ? ` pour ${place}` : year ? ` en ${year}` : "";

  const links = [
    {
      to: "/resultats-presidentielle-par-commune",
      label: "Résultats par commune",
      text: `Trouver les scores, la participation et l'abstention${suffix}.`,
      Icon: Search,
    },
    {
      to: "/carte-presidentielle",
      label: "Carte présidentielle",
      text: "Visualiser les rapports de force entre territoires.",
      Icon: Map,
    },
    {
      to: "/participation-presidentielle",
      label: "Participation",
      text: "Comparer la mobilisation électorale entre communes et années.",
      Icon: UsersRound,
    },
    {
      to: "/abstention-presidentielle",
      label: "Abstention",
      text: "Nuancer les scores avec le niveau de non-vote.",
      Icon: BarChart3,
    },
  ];

  return (
    <section className="mb-12 rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{copy.eyebrow}</p>
          <h2 className="text-2xl font-black tracking-tight">{copy.title}</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-3xl">{copy.intro}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {links.map(({ to, label, text, Icon }) => (
          <Link
            key={to}
            to={to}
            className="rounded-lg border border-border bg-background p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-2">
              <Icon className="h-4 w-4 text-primary" />
              {label}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
