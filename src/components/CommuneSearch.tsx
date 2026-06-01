import { useState, useEffect, useRef } from "react";
import { Search, Loader2, MapPin } from "lucide-react";
import { searchCommunes, GeoCommune } from "@/lib/api/geoApi";

interface CommuneSearchProps {
  onSelect: (commune: GeoCommune) => void;
  autoFocus?: boolean;
}

const CommuneSearch = ({ onSelect, autoFocus = false }: CommuneSearchProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [communeResults, setCommuneResults] = useState<GeoCommune[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (query.length < 2) {
      setCommuneResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const communes = await searchCommunes(query, 50);
        setCommuneResults(communes);
      } catch (e) {
        console.error("Search error:", e);
        setCommuneResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const hasResults = communeResults.length > 0;

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <label htmlFor="commune-search" className="sr-only">Rechercher une commune ou un code postal</label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <input
          id="commune-search"
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Commune ou code postal…"
          className="w-full rounded-md border border-input bg-card pl-11 pr-4 py-3 text-base font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all border-primary/20 hover:border-primary/40"
          role="combobox"
          aria-expanded={open && hasResults}
          aria-autocomplete="list"
          aria-controls="search-results"
          autoComplete="off"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" aria-label="Chargement" />}
      </div>
      {open && hasResults && (
        <ul id="search-results" role="listbox" className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg overflow-hidden max-h-80 overflow-y-auto animae-in fade-in zoom-in-95 duration-200">
          {communeResults.map((commune) => (
            <li key={commune.code}>
              <button
                className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3"
                onClick={() => {
                  onSelect(commune);
                  setQuery(commune.nom);
                  setOpen(false);
                }}
              >
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <span className="font-semibold text-foreground">{commune.nom}</span>
                  <span className="text-sm text-muted-foreground">
                    {commune.codesPostaux?.[0]} — {commune.codeDepartement}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.length >= 2 && !loading && !hasResults && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg p-4 text-sm text-muted-foreground">
          Aucun résultat pour « {query} ».
        </div>
      )}
    </div>
  );
};

export default CommuneSearch;
