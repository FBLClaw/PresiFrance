import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MapPin, Search, Loader2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import SeoConnectorLinks from "@/components/SeoConnectorLinks";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getDepartmentCommunes, GeoCommuneWithCoords } from "@/lib/api/geoApi";
import { getDepartmentIntro } from "@/lib/departmentSeo";
import { getDepartmentName } from "@/lib/departments";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const DepartmentExplorationPage = () => {
  const { depCode } = useParams<{ depCode: string }>();
  const [communes, setCommunes] = useState<GeoCommuneWithCoords[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (depCode) {
      setLoading(true);
      getDepartmentCommunes(depCode).then((data) => {
        // Sort by name
        const sorted = [...data].sort((a, b) => a.nom.localeCompare(b.nom));
        setCommunes(sorted);
        setLoading(false);
      });
    }
  }, [depCode]);

  const filteredCommunes = communes.filter((c) =>
    c.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.includes(searchQuery)
  );
  const departmentName = getDepartmentName(depCode);
  const departmentIntro = getDepartmentIntro(depCode);

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <SEOHead 
        title={`Résultats présidentielle : ${departmentName}`} 
        description={`Liste des communes pour le département ${departmentName}. Retrouvez les résultats de l'élection présidentielle par ville, village et commune.`}
        path={depCode ? `/explorer/${depCode}` : "/explorer"}
      />
      <JsonLd
        path={depCode ? `/explorer/${depCode}` : "/explorer"}
        breadcrumbs={[
          { name: "Explorer par commune", path: "/explorer" },
          { name: departmentName, path: depCode ? `/explorer/${depCode}` : "/explorer" },
        ]}
      />
      
      <SiteHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Link to="/explorer" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Retour à la liste des départements
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 uppercase font-bold px-2 py-0.5 rounded text-xs">
                    Département {depCode}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-neutral-900 font-serif">
                  Communes du {departmentName}
                </h1>
                <p className="text-sm text-neutral-500 mt-2 max-w-2xl">
                  {departmentIntro}
                </p>
              </div>
              
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  placeholder="Rechercher une commune..."
                  className="pl-10 h-11 bg-neutral-50 border-neutral-200 focus:bg-white transition-all rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Chargement des communes...</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-neutral-500 mb-6 font-medium">
                  {filteredCommunes.length} commune{filteredCommunes.length > 1 && 's'} trouvée{filteredCommunes.length > 1 && 's'}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredCommunes.map((commune) => (
                    <Link key={commune.code} to={`/commune/${commune.code}`} className="block">
                      <Card className="hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 group border-neutral-100 shadow-none bg-neutral-50/50">
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <MapPin className="w-4 h-4 text-neutral-300 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                            <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors truncate">
                              {commune.nom}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400 group-hover:text-blue-400 transition-colors ml-2 bg-white px-1.5 py-0.5 rounded border border-neutral-100">
                            {commune.code}
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {filteredCommunes.length === 0 && (
                  <div className="text-center py-12 text-neutral-500 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                    Aucune commune ne correspond à votre recherche.
                  </div>
                )}
              </div>
            )}
          </div>

          <SeoConnectorLinks context="department" departmentName={departmentName} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default DepartmentExplorationPage;
