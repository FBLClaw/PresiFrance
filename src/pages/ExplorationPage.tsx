import { Link } from "react-router-dom";
import { ChevronRight, Globe } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Simplified list of departments for the exploration page
const DEPARTMENTS = [
  { code: "01", nom: "Ain" }, { code: "02", nom: "Aisne" }, { code: "03", nom: "Allier" },
  { code: "04", nom: "Alpes-de-Haute-Provence" }, { code: "05", nom: "Hautes-Alpes" }, { code: "06", nom: "Alpes-Maritimes" },
  { code: "07", nom: "Ardèche" }, { code: "08", nom: "Ardennes" }, { code: "09", nom: "Ariège" },
  { code: "10", nom: "Aube" }, { code: "11", nom: "Aude" }, { code: "12", nom: "Aveyron" },
  { code: "13", nom: "Bouches-du-Rhône" }, { code: "14", nom: "Calvados" }, { code: "15", nom: "Cantal" },
  { code: "16", nom: "Charente" }, { code: "17", nom: "Charente-Maritime" }, { code: "18", nom: "Cher" },
  { code: "19", nom: "Corrèze" }, { code: "2A", nom: "Corse-du-Sud" }, { code: "2B", nom: "Haute-Corse" },
  { code: "21", nom: "Côte-d'Or" }, { code: "22", nom: "Côtes-d'Armor" }, { code: "23", nom: "Creuse" },
  { code: "24", nom: "Dordogne" }, { code: "25", nom: "Doubs" }, { code: "26", nom: "Drôme" },
  { code: "27", nom: "Eure" }, { code: "28", nom: "Eure-et-Loir" }, { code: "29", nom: "Finistère" },
  { code: "30", nom: "Gard" }, { code: "31", nom: "Haute-Garonne" }, { code: "32", nom: "Gers" },
  { code: "33", nom: "Gironde" }, { code: "34", nom: "Hérault" }, { code: "35", nom: "Ille-et-Vilaine" },
  { code: "36", nom: "Indre" }, { code: "37", nom: "Indre-et-Loire" }, { code: "38", nom: "Isère" },
  { code: "39", nom: "Jura" }, { code: "40", nom: "Landes" }, { code: "41", nom: "Loir-et-Cher" },
  { code: "42", nom: "Loire" }, { code: "43", nom: "Haute-Loire" }, { code: "44", nom: "Loire-Atlantique" },
  { code: "45", nom: "Loiret" }, { code: "46", nom: "Lot" }, { code: "47", nom: "Lot-et-Garonne" },
  { code: "48", nom: "Lozère" }, { code: "49", nom: "Maine-et-Loire" }, { code: "50", nom: "Manche" },
  { code: "51", nom: "Marne" }, { code: "52", nom: "Haute-Marne" }, { code: "53", nom: "Mayenne" },
  { code: "54", nom: "Meurthe-et-Moselle" }, { code: "55", nom: "Meuse" }, { code: "56", nom: "Morbihan" },
  { code: "57", nom: "Moselle" }, { code: "58", nom: "Nièvre" }, { code: "59", nom: "Nord" },
  { code: "60", nom: "Oise" }, { code: "61", nom: "Orne" }, { code: "62", nom: "Pas-de-Calais" },
  { code: "63", nom: "Puy-de-Dôme" }, { code: "64", nom: "Pyrénées-Atlantiques" }, { code: "65", nom: "Hautes-Pyrénées" },
  { code: "66", nom: "Pyrénées-Orientales" }, { code: "67", nom: "Bas-Rhin" }, { code: "68", nom: "Haut-Rhin" },
  { code: "69", nom: "Rhône" }, { code: "70", nom: "Haute-Saône" }, { code: "71", nom: "Saône-et-Loire" },
  { code: "72", nom: "Sarthe" }, { code: "73", nom: "Savoie" }, { code: "74", nom: "Haute-Savoie" },
  { code: "75", nom: "Paris" }, { code: "76", nom: "Seine-Maritime" }, { code: "77", nom: "Seine-et-Marne" },
  { code: "78", nom: "Yvelines" }, { code: "79", nom: "Deux-Sèvres" }, { code: "80", nom: "Somme" },
  { code: "81", nom: "Tarn" }, { code: "82", nom: "Tarn-et-Garonne" }, { code: "83", nom: "Var" },
  { code: "84", nom: "Vaucluse" }, { code: "85", nom: "Vendée" }, { code: "86", nom: "Vienne" },
  { code: "87", nom: "Haute-Vienne" }, { code: "88", nom: "Vosges" }, { code: "89", nom: "Yonne" },
  { code: "90", nom: "Territoire de Belfort" }, { code: "91", nom: "Essonne" }, { code: "92", nom: "Hauts-de-Seine" },
  { code: "93", nom: "Seine-Saint-Denis" }, { code: "94", nom: "Val-de-Marne" }, { code: "95", nom: "Val-d'Oise" },
  { code: "971", nom: "Guadeloupe" }, { code: "972", nom: "Martinique" }, { code: "973", nom: "Guyane" },
  { code: "974", nom: "La Réunion" }, { code: "976", nom: "Mayotte" }
];

const ExplorationPage = () => {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <SEOHead 
        title="Exploration des Communes de France" 
        description="Parcourez les résultats électoraux de toutes les communes de France par département. Accédez aux données officielles de la présidentielle 2022."
      />
      
      <SiteHeader />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 bg-white shadow-sm border-neutral-200 text-neutral-600 px-4 py-1 rounded-full text-sm font-medium">
              <Globe className="w-3.5 h-3.5 mr-2 text-neutral-400" />
              Répertoire National
            </Badge>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4 font-serif">
              Explorez les Communes de France
            </h1>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
              Retrouvez les résultats détaillés de l'élection présidentielle 2022 pour chacune des 35 000 communes, classées par département.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {DEPARTMENTS.map((dep) => (
              <Link key={dep.code} to={`/explorer/${dep.code}`} className="block transition-transform hover:scale-[1.02]">
                <Card className="h-full border border-neutral-200 hover:border-blue-500/50 hover:bg-blue-50/50 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center font-bold text-neutral-600 border border-neutral-200 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                        {dep.code}
                      </div>
                      <CardTitle className="text-base font-semibold text-neutral-800 group-hover:text-blue-700 transition-colors">
                        {dep.nom}
                      </CardTitle>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-400 transition-colors" />
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default ExplorationPage;
